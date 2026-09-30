"""Synchronize the written guideline boards and add the identity format sheet."""
from pathlib import Path
import json,re
OUT=Path('deliverables/ready-margin-brand-guidelines')
data=json.loads(Path('content/brand-guidelines.json').read_text('utf8'))
boards=json.loads((OUT/'figma/boards.json').read_text('utf8'))
replacements={
 'Make room for\nwhat matters.':'For the work\nbehind service.',
 'Clear numbers. Calmer operations.\nMore time for the restaurant.':'Sales, supplier bills, payroll\nand the monthly close.',
 'A considered system for showing up\nwith clarity, capability and warmth.':'Ready Margin identity,\nclient materials and working files.',
 'BRAND GUIDELINES\nVERSION 1.0':'BRAND GUIDELINES\nVERSION 1.1',
 'Quietly capable. Always human.':'Restaurant finance & operations.',
 '01 / QUIETLY CAPABLE':'01 / RESTAURANT FIRST',
 '02 / CLARITY FIRST':'02 / WORK YOU CAN TRACE',
 '03 / ALWAYS HUMAN':'03 / A NAMED NEXT STEP',
 'Calm confidence.':'Restaurant first.',
 'Room to think.':'Keep the record.',
 'Grounded warmth.':'Name the next step.',
 'Be specific about the work and honest about the agreed scope. Show useful next steps, rather than grand claims.':'Work around the restaurant’s service schedule. Identify the invoice, time record or settlement that needs attention.',
 'Use clear records, generous space and a sensible hierarchy. Help restaurant owners understand what happens next.':'Keep the document with the question it raises. The owner should be able to follow the record and the decision.',
 'Write to real people with a service to run. The brand should feel considered, approachable and quietly capable.':'Say who needs to approve the work and when. Separate prepared records from approved records.',
 'One logo. Used well.':'The Ready Margin identity',
 'Use the supplied artwork. Preserve the proportions, colors and generous clear space.':'Use the supplied identity files. Six formats cover documents, product screens and printed working materials.',
 'THREE ESSENTIAL FILES':'PRIMARY / REVERSE / ONE-COLOR',
 'A little warmth. A lot of range.':'Color specifications',
 'Five families. Thirty considered colors.':'Five palettes. Thirty colors.',
 'Built to work together.':'Approved color combinations',
 'Four approved starting points. Keep the composition calm and the hierarchy clear.':'Use the combination assigned to client correspondence, operational reviews, restaurant stories or monthly reporting.',
 'Good work. Clearer numbers.':'Restaurant finance & operations.',
 'Good contrast. Every time.':'Text & data legibility',
 'Say it clearly.':'Typography',
 'Plus Jakarta Sans. One family, a useful range of weights and a human edge.':'Plus Jakarta Sans is used in the website, client documents and restaurant workspace.',
 'Good things happen with a little clarity.':'September sales are reconciled.',
 'Sound like a person. A capable one.':'Writing to restaurant owners',
 'Be clear about the work, warm about the people and honest about the scope.':'Identify the record, explain the question and give the owner a specific next step.',
 'Made for the real world.':'Ready Margin at work',
 'Use these compositions as starting points. Applications and charts are illustrative templates.':'Working materials for the monthly close, client correspondence and restaurant reviews. Sample records are shown.',
 'FOR THE WORK BEHIND THE WORK.':'CLIENT CLOSE UPDATE',
 'A clearer close.\nA calmer\ntomorrow.':'September close.\nTwo approvals\nto confirm.',
 'A clearer view\nof the month.':'September\nmonthly review.',
 'The numbers. The context.\nThe next step.':'Sales reconciled.\nCosts reviewed.',
 'READY MARGIN / PERSPECTIVES':'READY MARGIN / OPERATIONS',
 'More time\nat the table.':'Restaurant\nreview notes.',
 'CLARITY FOR THE WORK BEHIND IT.':'RESTAURANT FINANCE & OPERATIONS.',
 'STUDIO EDITION 01 / SEPTEMBER 2026':'READY MARGIN / SEPTEMBER 2026'
}
def normalized(t):return re.sub(r'\s+',' ',t).strip()
norm={normalized(k):v for k,v in replacements.items()}
def update(node):
    if node['type']=='text':
        match=norm.get(normalized(node['text']))
        if match:node['text']=match
    for child in node.get('children',[]):update(child)
for board in boards:
    for node in board['nodes']:update(node)
def text(t,size=16,w=390,color='#222222',weight=400):return {'type':'text','text':t,'size':size,'color':color,'w':w,'weight':weight,'line':round(size*1.45)}
def group(name,x,y,w,children,gap=10):return {'type':'group','name':name,'x':x,'y':y,'w':w,'children':children,'direction':'vertical','gap':gap,'padding':0}
items=[]
for i,item in enumerate(data['identity']):
    w=210 if item['id']!='ready-margin-logomark' else 100
    h=w*item['height']/item['width']
    if h>128:w=w*128/h;h=128
    art={'type':'logo','form':item['id'],'svg':(OUT/f'logos/{item["id"]}.svg').read_text('utf8'),'w':w,'h':h}
    items.append(group(item['name'],64+(i%3)*448,325+(i//3)*280,410,[art,text(item['name'],24,390,weight=600),text(item['use'],13,375,'#596058')],12))
boards=[b for b in boards if not b['name'].startswith('11 —')]
boards.append({'name':'11 — Identity formats','width':1440,'height':1000,'background':'#F4F1E8','nodes':[group('Title',64,60,1280,[text('READY MARGIN / IDENTITY FORMATS',12,1200,'#596058',500),text('Choose the format for the placement.',53,1280,weight=600),text('Primary, reverse and one-color files are supplied as SVG and PNG for every format.',20,1200,'#596058')],18),*items,group('Footer',64,948,1280,[text('READY MARGIN / SEPTEMBER 2026 / VERSION 1.1',12,1280,'#596058',500)])]})
(OUT/'figma/boards.json').write_text(json.dumps(boards,ensure_ascii=False,indent=2),'utf8')
(OUT/'figma/build-input.json').write_text(json.dumps({'data':data,'boards':boards},ensure_ascii=False),'utf8')
Path('brand-guidelines/copy-replacements.json').write_text(json.dumps(replacements,ensure_ascii=False),'utf8')
print(json.dumps({'guidelineBoards':len(boards),'copyReplacements':len(replacements)}))
