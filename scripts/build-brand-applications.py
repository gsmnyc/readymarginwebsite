"""Build Ready Margin identity exports and practical, editable application masters."""
from pathlib import Path
import sys, json, re, io, html, shutil
import xml.etree.ElementTree as ET
sys.path.insert(0, str(Path('.brand-build/python').resolve()))
from svglib.svglib import svg2rlg
from reportlab.graphics import renderPDF
from reportlab.pdfgen import canvas
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
import pymupdf

ROOT=Path.cwd(); OUT=ROOT/'deliverables/ready-margin-brand-guidelines'
for p in ['logos','templates','mockups','website/assets/identity','website/assets/mockups','website/downloads','figma/application-masters']:
    (OUT/p).mkdir(parents=True,exist_ok=True)
PUBLIC=ROOT/'public/brand-guide';(PUBLIC/'identity').mkdir(exist_ok=True)
font=TTFont('.brand-build/fonts/Jakarta-600.ttf');glyphs=font.getGlyphSet();cmap=font.getBestCmap();units=font['head'].unitsPerEm
def outlined(text,x,y,size,color='#222222',tracking=0):
    result=[];pos=x
    for ch in text:
        name=cmap.get(ord(ch),'space');pen=SVGPathPen(glyphs);glyphs[name].draw(pen)
        result.append(f'<path d="{pen.getCommands()}" transform="translate({pos:.3f} {y}) scale({size/units} {-size/units})" fill="{color}"/>')
        pos+=font['hmtx'][name][0]*size/units+tracking
    return ''.join(result)
def root_svg(body,w,h,view=None): return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="{view or f"0 0 {w} {h}"}"><title>Ready Margin</title>{body}</svg>'
def inner(svg): return re.sub(r'^.*?<svg[^>]*>','',svg,flags=re.S).rsplit('</svg>',1)[0]
horizontal=(PUBLIC/'ready-margin.svg').read_text('utf8')
word_group=ET.fromstring((ROOT/'public/brand/logo_horizontal_primary_transparent.svg').read_text('utf8')).find("{http://www.w3.org/2000/svg}g[@id='text-003']")
word=ET.tostring(word_group,encoding='unicode').replace('ns0:','').replace(':ns0','')
symbol=(ROOT/'public/brand/logo_symbol_primary_transparent.svg').read_text('utf8')
stacked=(ROOT/'public/brand/logo_stacked_primary_transparent.svg').read_text('utf8')
forms={
 'ready-margin':horizontal,
 'ready-margin-stacked':stacked,
 'ready-margin-wordmark':root_svg(word,351,61,'103 37 351 61'),
 'ready-margin-logomark':root_svg(inner(symbol),144,144,'24 24 144 144'),
 'ready-margin-badge':root_svg(f'<rect width="320" height="320" fill="#F4F1E8"/><svg x="104" y="55" width="112" height="112" viewBox="24 24 144 144">{inner(symbol)}</svg><svg x="35" y="207" width="250" height="44" viewBox="103 37 351 61">{word}</svg>',320,320),
 'ready-margin-badge-xl':root_svg(f'<rect width="800" height="520" fill="#F4F1E8"/><svg x="52" y="64" width="160" height="160" viewBox="24 24 144 144">{inner(symbol)}</svg><svg x="50" y="292" width="630" height="110" viewBox="103 37 351 61">{word}</svg>{outlined("RESTAURANT FINANCE & OPERATIONS",56,464,18,tracking=1.5)}',800,520)
}
def pdf_png(svg,pdf_path,png_path,pixels=1800):
    drawing=svg2rlg(io.BytesIO(svg.encode('utf8')))
    c=canvas.Canvas(str(pdf_path),pagesize=(drawing.width,drawing.height),pageCompression=1)
    c.setTitle('Ready Margin — '+pdf_path.stem.replace('-',' ').title());c.setAuthor('Ready Margin');renderPDF.draw(drawing,c,0,0);c.save()
    doc=pymupdf.open(pdf_path);page=doc[0];page.get_pixmap(matrix=pymupdf.Matrix(pixels/max(page.rect.width,page.rect.height),pixels/max(page.rect.width,page.rect.height)),alpha=True).save(png_path)
identities=[]
for base,svg in forms.items():
    for suffix in ['', '-reverse','-one-color']:
        art=svg
        if suffix=='-reverse':art=art.replace('#F4F1E8','#REVERSEBG').replace('#222222','#F4F1E8').replace('#REVERSEBG','#222222')
        if suffix=='-one-color':art=art.replace('#E7C14B','#222222')
        name=base+suffix
        (OUT/f'logos/{name}.svg').write_text(art,'utf8')
        pdf_png(art,ROOT/f'.brand-build/{name}.pdf',OUT/f'logos/{name}.png',1800 if 'xl' in name else 1400)
        for ext in ['svg','png']:
            shutil.copy2(OUT/f'logos/{name}.{ext}',PUBLIC/f'identity/{name}.{ext}')
            shutil.copy2(OUT/f'logos/{name}.{ext}',OUT/f'website/assets/identity/{name}.{ext}')
        identities.append({'name':name,'svg':f'{name}.svg','png':f'{name}.png'})

N='#222222';P='#F4F1E8';G='#E7C14B';M='#596058';B='#D5D5CC';F='#203D2C'
native=[]
def txt(s,x,y,size=14,color=N,weight=400):
    native.append({'type':'text','text':s,'x':x,'y':y-size*.82,'w':max(100,len(s)*size*.66),'size':size,'color':color,'weight':weight,'line':size*1.5})
    return f'<text x="{x}" y="{y}" font-family="Plus Jakarta Sans, sans-serif" font-size="{size}" font-weight="{weight}" fill="{color}">{html.escape(s)}</text>'
def rect(x,y,w,h,color):
    native.append({'type':'rect','x':x,'y':y,'w':w,'h':h,'color':color})
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{color}"/>'
def logo(x,y,w=190):
    native.append({'type':'logo','x':x,'y':y,'w':w,'h':w*70/433,'svg':horizontal})
    return f'<svg x="{x}" y="{y}" width="{w}" height="{w*70/433}" viewBox="20 24 433 70">{inner(horizontal)}</svg>'
def lines(text,x,y,size=14,color=N,gap=24): return ''.join(txt(t,x,y+i*gap,size,color) for i,t in enumerate(text))
masters=[]
def export(name,title,w,h,body):
    svg=root_svg(body,w,h)
    (OUT/f'templates/{name}.svg').write_text(svg,'utf8')
    # PDF keeps live text in embedded Jakarta; the SVG is editable in design software.
    from reportlab.pdfbase import pdfmetrics
    from reportlab.pdfbase.ttfonts import TTFont as RLFont
    for weight in [400,500,600]:
        if f'Jakarta{weight}' not in pdfmetrics.getRegisteredFontNames():pdfmetrics.registerFont(RLFont(f'Jakarta{weight}',f'.brand-build/fonts/Jakarta-{weight}.ttf'))
    drawing=svg2rlg(io.BytesIO(svg.encode()))
    weights={n['text']:n['weight'] for n in native if n['type']=='text'}
    def fonts(node):
        if getattr(node,'__class__',None).__name__=='String':
            node.fontName=f"Jakarta{weights.get(node.text,400)}"
        for child in getattr(node,'contents',[]):fonts(child)
    fonts(drawing)
    c=canvas.Canvas(str(OUT/f'templates/{name}.pdf'),pagesize=(w,h));c.setTitle(title);c.setAuthor('Ready Margin');c.scale(w/drawing.width,h/drawing.height);renderPDF.draw(drawing,c,0,0);c.save()
    doc=pymupdf.open(OUT/f'templates/{name}.pdf');doc[0].get_pixmap(matrix=pymupdf.Matrix(2,2)).save(OUT/f'templates/{name}.png')
    masters.append({'id':name,'title':title,'width':w,'height':h,'background':P,'nodes':list(native)})
    native.clear()

# A4 correspondence: real contact details; editable example recipient and message.
body=rect(0,0,595,842,'#FFFFFF')+logo(48,45,195)+lines(['contact@readymargin.com','readymargin.com'],420,56,10,M,18)+rect(48,112,499,2,G)
body+=lines(['30 September 2026','Harbor Table','Attn: Restaurant owner'],48,165,11,M,23)+txt('Your September close',48,277,29,N,600)
body+=lines(['Hello,','We have reconciled the sales records and bank settlements for September.','The monthly review is attached. Two supplier invoices need your approval','before we finish the payable schedule.','Please confirm the items on the approval list by Friday. Each item includes','the invoice, the amount and the question we need you to answer.','Once those items are resolved, we will send the final review and the next','month’s working schedule.','Thank you,','Ready Margin','Restaurant finance & operations'],48,335,11,N,30)
body+=rect(48,763,499,1,B)+txt('READY MARGIN',48,790,9,M,500)+txt('Restaurant finance & operations',338,790,9,M)
export('letterhead','Ready Margin / Letterhead',595,842,body)

body=rect(0,0,595,842,'#FFFFFF')+logo(48,45,185)+txt('Invoice',48,150,36,N,600)+txt('RM-2026-091',420,150,12,N,500)
body+=lines(['BILL TO','Harbor Table','Sample restaurant account'],48,213,12,N,24)+lines(['Issued 30 September 2026','Due 14 October 2026','Currency USD'],360,213,11,M,24)
body+=rect(48,313,499,38,P)+txt('SERVICE',62,337,10,M,500)+txt('AMOUNT',456,337,10,M,500)
body+=txt('Monthly finance support — September',62,388,12)+txt('$1,500.00',446,388,12)+rect(48,410,499,1,B)
body+=txt('Payroll preparation and approved adjustments',62,452,11)+txt('$350.00',455,452,12)+rect(48,474,499,1,B)
body+=txt('Subtotal',360,527,12)+txt('$1,850.00',446,527,12)+txt('Tax',360,561,12)+txt('$0.00',469,561,12)
body+=rect(338,587,209,56,G)+txt('Total due',352,621,13,N,600)+txt('$1,850.00',440,621,13,N,600)
body+=lines(['Payment instructions','Use the payment method in your agreed service terms. Quote RM-2026-091.','Questions about this invoice? contact@readymargin.com'],48,702,10,M,23)
body+=txt('SAMPLE INVOICE / REPLACE THE RECIPIENT, TERMS AND AMOUNTS BEFORE USE',48,792,8,M)
export('invoice','Ready Margin / Invoice',595,842,body)

body=rect(0,0,1280,900,P)+rect(0,0,210,900,N)
body+=txt('Ready Margin',30,55,21,P,600)+txt('CLIENT WORKSPACE',30,88,10,'#E7C14B',500)
for i,t in enumerate(['Overview','Reconciliation','Supplier invoices','Payroll approvals','Monthly reviews']):
    if i==0:body+=rect(16,143,178,42,'#365C42')
    body+=txt(t,30,170+i*57,12,P,500)
body+=txt('Harbor Table',248,48,15,N,600)+txt('Sample restaurant workspace',954,48,11,M)
body+=txt('September at a glance',248,125,32,N,600)+txt('Sales, costs and the items waiting for a decision.',248,157,13,M)
for i,(label,value,note) in enumerate([('NET SALES','$84,620','September 2026'),('FOOD COST','31.0%','$26,232'),('LABOR COST','29.0%','$24,540'),('PRIME COST','60.0%','$50,772')]):
    x=248+i*248;body+=rect(x,191,228,137,'#FFFFFF')+txt(label,x+18,220,10,M,500)+txt(value,x+18,262,27,N,600)+txt(note,x+18,294,11,M)
body+=rect(248,354,630,264,'#FFFFFF')+txt('Weekly net sales',269,390,18,N,600)+txt('September / USD',715,390,10,M)
for i,(value,label) in enumerate([(18840,'Week 1'),(21560,'Week 2'),(20140,'Week 3'),(24080,'Week 4')]):
    h=value/24080*130;x=289+i*140;body+=rect(x,556-h,78,h,G)+txt(f'${value:,}',x-1,542-h,11,N,500)+txt(label,x,584,10,M)
body+=rect(902,354,320,264,'#EDF2EC')+txt('Needs your approval',924,390,18,F,600)
body+=lines(['02 supplier invoices','01 payroll adjustment','Due Friday, 2 October'],924,437,14,F,42)+rect(924,560,274,36,F)+txt('Open approval list',947,584,11,P,500)
body+=rect(248,644,974,197,'#FFFFFF')+txt('Reconciliation queue',269,681,19,N,600)
for i,(record,status,amount) in enumerate([('Card settlements / 29 Sep','Matched','$3,412.80'),('Delivery platform / 29 Sep','Timing difference','$684.30'),('Supplier price change','Needs approval','$128.00')]):
    y=729+i*40;body+=txt(record,270,y,12)+txt(status,720,y,11,M)+txt(amount,1100,y,12)
body+=txt('SAMPLE RECORDS / PRODUCT DESIGN TEMPLATE',248,878,9,M)
export('dashboard','Ready Margin / Restaurant workspace',1280,900,body)

body=rect(0,0,640,900,'#FFFFFF')+rect(0,0,640,50,P)+txt('From: Ready Margin <contact@readymargin.com>',30,31,11,N)
body+=logo(44,88,195)+txt('September close: two approvals needed',44,182,24,N,600)+txt('Hello,',44,243,14)
body+=lines(['Your sales records and bank settlements have been reconciled.','Two supplier invoices need your approval before we finish','the payable schedule.'],44,286,13,N,24)
body+=rect(44,376,552,165,P)+txt('Approval list',65,410,19,N,600)+txt('02 supplier invoices',65,451,14)+txt('Reply by Friday, 2 October',65,492,13,M)
body+=rect(65,510,154,2,G)+lines(['Open the approval list in your workspace. Each item includes','the invoice, amount and the question we need you to answer.','Once approved, we will send the final monthly review.'],44,585,13,N,27)
body+=rect(44,704,552,1,B)+txt('Ready Margin',44,748,17,N,600)+lines(['Restaurant finance & operations','contact@readymargin.com  ·  readymargin.com'],44,781,11,M,22)
body+=txt('SAMPLE CLIENT EMAIL / EDIT THE DATES AND ACTIONS BEFORE SENDING',44,864,8,M)
export('client-email','Ready Margin / Client email',640,900,body)

body=rect(0,0,595,842,P)+logo(48,50,206)+txt('HARBOR TABLE / SAMPLE RESTAURANT',48,145,10,M,500)+txt('September',48,253,52,N,600)+txt('monthly review',48,318,43,N,600)+rect(48,358,160,6,G)
body+=lines(['Sales reconciled.','Costs reviewed.','Decisions recorded.'],48,452,23,N,45)
body+=rect(48,639,499,115,'#E9E5D9')+txt('NET SALES',68,674,10,M,500)+txt('$84,620',68,718,27,N,600)+txt('PRIME COST',300,674,10,M,500)+txt('60.0%',300,718,27,N,600)
body+=txt('Restaurant finance & operations',48,801,11,M)+txt('SEPTEMBER 2026',421,801,9,M,500)
export('monthly-review','Ready Margin / Monthly review',595,842,body)

body=rect(0,0,1004,650,P)+logo(65,62,390)+txt('Restaurant finance',65,299,40,N,600)+txt('& operations',65,351,40,N,600)+rect(65,431,875,2,G)+txt('contact@readymargin.com',65,512,24)+txt('readymargin.com',65,556,24,M)
body+=txt('BUSINESS CARD / FRONT / 85 × 55 MM / SCALE ARTWORK TO FINAL SIZE',65,615,11,M)
export('business-card','Ready Margin / Business card',1004,650,body)
body=rect(0,0,800,1100,F)+f'<svg x="58" y="62" width="240" height="156" viewBox="0 0 800 520">{inner(forms["ready-margin-badge-xl"].replace("#222222",P).replace(P,F,1))}</svg>'
body+=txt('Restaurant review',58,406,46,P,600)+txt('WORKING NOTES',58,461,16,'#AFCAA8',500)+rect(58,527,684,3,G)+lines(['Sales records','Supplier questions','Payroll approvals','Next steps'],58,617,23,P,58)+txt('Ready Margin / Operations support',58,1022,15,P)
export('review-notebook','Ready Margin / Restaurant review notebook',800,1100,body)
badge= forms['ready-margin-badge']
body=rect(0,0,595,842,P)+f'<svg x="178" y="145" width="240" height="240" viewBox="0 0 320 320">{inner(badge)}</svg>'+txt('Client review pack',48,555,34,N,600)+txt('Restaurant finance & operations',48,599,14,M)+rect(48,652,499,3,G)+txt('readymargin.com',48,766,12,M)
native.append({'type':'logo','form':'ready-margin-badge','x':178,'y':145,'w':240,'h':240,'svg':badge})
export('review-folder','Ready Margin / Client review folder',595,842,body)

# Print-ready browser documents and an email message with a CID-attached logo.
for master in masters:
    slug=master['id'];svg=(OUT/f'templates/{slug}.svg').read_text('utf8')
    document=f'<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{master["title"]}</title><style>@font-face{{font-family:"Plus Jakarta Sans";src:url("../font/PlusJakartaSans-variable.woff2")}}body{{margin:0;background:#e9e5d9}}main{{max-width:{master["width"]}px;margin:30px auto}}svg{{width:100%;height:auto}}@media print{{body{{background:white}}main{{margin:0}}@page{{margin:0}}}}</style><main>{svg}</main></html>'
    (OUT/f'templates/{slug}.html').write_text(document,'utf8')
from email.message import EmailMessage
email_html='''<html><body style="margin:0;font-family:Arial,sans-serif;color:#222222"><table role="presentation" width="600" cellpadding="28"><tr><td><img src="cid:ready-margin-logo" width="190" alt="Ready Margin"><h1 style="font-size:25px;line-height:1.3">September close: two approvals needed</h1><p>Hello,</p><p>Your sales records and bank settlements have been reconciled. Two supplier invoices need your approval before we finish the payable schedule.</p><table role="presentation" width="100%" cellpadding="18" style="background:#F4F1E8"><tr><td><strong>02 supplier invoices</strong><p>Reply by Friday, 2 October.</p></td></tr></table><p>Open the approval list in your workspace. Each item includes the invoice, amount and the question we need you to answer.</p><p>Once approved, we will send the final monthly review.</p><hr style="border:0;border-top:1px solid #D5D5CC"><p><strong>Ready Margin</strong><br>Restaurant finance &amp; operations<br><a href="mailto:contact@readymargin.com" style="color:#222222">contact@readymargin.com</a><br><a href="https://readymargin.com" style="color:#222222">readymargin.com</a></p></td></tr></table></body></html>'''
msg=EmailMessage();msg['Subject']='September close: two approvals needed';msg['From']='Ready Margin <contact@readymargin.com>';msg.set_content('Hello,\n\nYour sales records and bank settlements have been reconciled. Two supplier invoices need your approval. Reply by Friday, 2 October.\n\nReady Margin\ncontact@readymargin.com');msg.add_alternative(email_html,subtype='html');msg.get_payload()[1].add_related((OUT/'logos/ready-margin.png').read_bytes(),maintype='image',subtype='png',cid='<ready-margin-logo>')
(OUT/'templates/client-email.eml').write_bytes(bytes(msg))
(OUT/'templates/client-email.html').write_text(email_html.replace('cid:ready-margin-logo','../logos/ready-margin.png'),'utf8')
signature='''<table role="presentation" cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif;color:#222222"><tr><td style="padding:0 22px 0 0;border-right:3px solid #E7C14B"><img src="../logos/ready-margin.png" width="165" alt="Ready Margin"></td><td style="padding-left:22px;font-size:12px;line-height:1.65"><strong style="font-size:15px">[Full name]</strong><br>[Role] · Ready Margin<br><a href="mailto:contact@readymargin.com" style="color:#222222">contact@readymargin.com</a><br><a href="https://readymargin.com" style="color:#222222">readymargin.com</a></td></tr></table>'''
(OUT/'templates/email-signature.html').write_text('<!doctype html><html lang="en"><meta charset="utf-8"><title>Ready Margin email signature</title><body style="padding:32px">'+signature+'</body></html>','utf8')
(OUT/'figma/application-masters.json').write_text(json.dumps(masters,ensure_ascii=False),'utf8')
(OUT/'logos/identity-index.json').write_text(json.dumps(identities,indent=2),'utf8')
shutil.copy2(ROOT/'brand-guidelines/dashboard-prototype.html',OUT/'templates/dashboard.html')
for image in (ROOT/'brand-guidelines/mockups').glob('*.png'):
    for destination in [OUT/'mockups'/image.name, OUT/'website/assets/mockups'/image.name,PUBLIC/'mockups'/image.name]:
        destination.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(image,destination)
print(json.dumps({'identityForms':len(forms),'svgVariants':len(identities),'pngVariants':len(identities),'applicationMasters':len(masters),'emailFiles':2}))
