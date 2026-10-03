import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { stripTypeScriptTypes } from 'node:module';
import { hasDurableCrmReceipt } from '../lib/crm-receipt.ts';
import { nextEnquiryAttempt } from '../lib/enquiry-attempt.ts';
import { readEnquiryBody, EnquiryBodyTooLarge, EnquiryBodyTimeout } from '../lib/enquiry-body.ts';

const key='a'.repeat(64),id='11111111-1111-4111-8111-111111111111';
test('CRM receipt requires committed ID and the matching submission',()=>{
  assert.equal(hasDurableCrmReceipt({ok:true,receiptId:id,submissionId:key,created:true},key,201),true);
  for(const value of [null,{}, {ok:true}, {ok:false,receiptId:id,submissionId:key}, {ok:true,receiptId:'queued',submissionId:key}, {ok:true,receiptId:id,submissionId:'b'.repeat(64)}]) assert.equal(hasDurableCrmReceipt(value,key,201),false);
});
test('attempt ID survives an unchanged retry and resets for edited/new enquiries',()=>{
  const payload={name:'Synthetic Operator',email:'qa@example.invalid'};
  const first=nextEnquiryAttempt(null,payload,()=>'first');
  assert.equal(nextEnquiryAttempt(first,payload,()=>'should-not-run'),first);
  assert.equal(nextEnquiryAttempt(first,{...payload,name:'Edited'},()=>'edited').id,'edited');
  assert.equal(nextEnquiryAttempt(null,payload,()=>'intentional-new').id,'intentional-new');
});
test('body byte limit cancels a stream before reading unbounded input',async()=>{
  let canceled=false;
  const stream=new ReadableStream({start(controller){controller.enqueue(new Uint8Array(100));controller.enqueue(new Uint8Array(100));},cancel(){canceled=true;}});
  const request=new Request('https://site.example.invalid',{method:'POST',body:stream,duplex:'half'});
  await assert.rejects(readEnquiryBody(request,150),EnquiryBodyTooLarge);assert.equal(canceled,true);
  assert.equal(await readEnquiryBody(new Request('https://site.example.invalid',{method:'POST',body:'small'})),'small');
});
// Exercise the actual route transport. Validation is stubbed here; the existing
// adapters-check.mjs owns Zod/form coverage and remains a required CI check.
const source=await readFile(new URL('../app/api/review/route.ts',import.meta.url),'utf8');
const executable=stripTypeScriptTypes(source,{mode:'transform'})
  .replace('import { leadSchema } from "@/lib/forms";', 'const leadSchema = { safeParse: input => ({success:true,data:input}) };')
  .replace('"@/lib/crm-receipt"',JSON.stringify(new URL('../lib/crm-receipt.ts',import.meta.url).href))
  .replace('"@/lib/enquiry-body"',JSON.stringify(new URL('../lib/enquiry-body.ts',import.meta.url).href));
const { POST }=await import('data:text/javascript;base64,'+Buffer.from(executable).toString('base64'));
test('CRM mode forwards the private token and rejects incomplete acknowledgements',async()=>{
  const keys=['LEAD_WEBHOOK_URL','LEAD_WEBHOOK_TOKEN','LEAD_WEBHOOK_MODE','GOOGLE_APPS_SCRIPT_URL'];
  const saved=Object.fromEntries(keys.map(k=>[k,process.env[k]])),originalFetch=globalThis.fetch;
  try{
    process.env.LEAD_WEBHOOK_URL='https://receiver.example.invalid/api/v1/intake/ready-margin';
    process.env.LEAD_WEBHOOK_TOKEN='test-private-secret';process.env.LEAD_WEBHOOK_MODE='crm';delete process.env.GOOGLE_APPS_SCRIPT_URL;
    const input={name:'QA Operator',business:'QA Restaurant',email:'qa@example.invalid',consent:true};
    const invoke=()=>POST(new Request('https://readymargin.example.invalid/api/review',{method:'POST',headers:{'Content-Type':'application/json',Origin:'https://readymargin.example.invalid'},body:JSON.stringify(input)}));
    globalThis.fetch=async(_url,options)=>{
      assert.equal(options.headers.Authorization,'Bearer test-private-secret');
      assert.equal(options.redirect,'error');assert.equal(options.cache,'no-store');
      const payload=JSON.parse(options.body);assert.equal(payload.receiverToken,undefined);assert.equal(payload.source,'ready-margin-website');
      return new Response(JSON.stringify({ok:true,receiptId:id,submissionId:payload.submissionId,created:true}),{status:201});
    };
    assert.equal((await invoke()).status,200);
    for(const receipt of [{}, {ok:true}, {ok:true,receiptId:id,submissionId:'wrong'}]) {
      globalThis.fetch=async()=>new Response(JSON.stringify(receipt),{status:202});assert.equal((await invoke()).status,502);
    }
    globalThis.fetch=async()=>new Response('{}',{status:500});assert.equal((await invoke()).status,502);
    globalThis.fetch=async()=>{throw new Error('offline');};assert.equal((await invoke()).status,502);
    process.env.LEAD_WEBHOOK_MODE='apps-script';
    globalThis.fetch=async(_url,options)=>{assert.equal(JSON.parse(options.body).receiverToken,'test-private-secret');return new Response('{"ok":true}',{status:200});};
    assert.equal((await invoke()).status,200);
  }finally{globalThis.fetch=originalFetch;for(const k of keys){if(saved[k]===undefined)delete process.env[k];else process.env[k]=saved[k];}}
});
test('forwarded attempt receipt remains stable across UTC midnight',async t=>{
  const originalFetch=globalThis.fetch,keys=['LEAD_WEBHOOK_URL','LEAD_WEBHOOK_TOKEN','LEAD_WEBHOOK_MODE'];
  const saved=Object.fromEntries(keys.map(k=>[k,process.env[k]]));
  try{
    process.env.LEAD_WEBHOOK_URL='https://receiver.example.invalid';process.env.LEAD_WEBHOOK_TOKEN='test-private-secret';process.env.LEAD_WEBHOOK_MODE='crm';
    const recorded=[];
    globalThis.fetch=async(_url,options)=>{const p=JSON.parse(options.body);recorded.push(p.submissionId);return new Response(JSON.stringify({ok:true,receiptId:id,submissionId:p.submissionId,created:false}));};
    const invoke=attempt=>POST(new Request('https://site.example.invalid/api/review',{method:'POST',headers:{'Content-Type':'application/json','X-Submission-ID':attempt},body:JSON.stringify({name:'QA',email:'qa@example.invalid'})}));
    t.mock.timers.enable({apis:['Date'],now:new Date('2026-10-03T23:59:59Z')});
    assert.equal((await invoke('11111111-1111-4111-8111-111111111111')).status,200);
    t.mock.timers.setTime(new Date('2026-10-04T00:00:01Z').getTime());
    assert.equal((await invoke('11111111-1111-4111-8111-111111111111')).status,200);
    assert.equal(recorded[0],recorded[1]);
    assert.equal((await invoke('22222222-2222-4222-8222-222222222222')).status,200);assert.notEqual(recorded[1],recorded[2]);
    assert.equal((await invoke('invalid')).status,400);
  }finally{t.mock.timers.reset();globalThis.fetch=originalFetch;for(const k of keys){if(saved[k]===undefined)delete process.env[k];else process.env[k]=saved[k];}}
});

test('CRM success requires commit status and consistent creation metadata', () => {
  const receipt = {ok:true, receiptId:id, submissionId:key, created:true};
  assert.equal(hasDurableCrmReceipt(receipt,key,202),false);
  assert.equal(hasDurableCrmReceipt(receipt,key,200),false);
  assert.equal(hasDurableCrmReceipt({...receipt,created:false},key,200),true);
  assert.equal(hasDurableCrmReceipt({...receipt,created:undefined},key,201),false);
});
test('stalled streams time out even if cancellation never settles', async () => {
  let canceled=false;
  const stream=new ReadableStream({cancel(){canceled=true;return new Promise(()=>{});}});
  await assert.rejects(readEnquiryBody(new Response(stream),4096,20),EnquiryBodyTimeout);
  assert.equal(canceled,true);
});
test('body reading respects an already aborted delivery deadline', async () => {
  const controller=new AbortController();controller.abort();
  await assert.rejects(readEnquiryBody(new Response(new ReadableStream()),4096,5000,controller.signal),EnquiryBodyTimeout);
});
