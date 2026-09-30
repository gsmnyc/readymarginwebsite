"""Render the shared editorial board source as vector PDF and editable SVG."""
from pathlib import Path
import sys, json, io, html, re
sys.path.insert(0, str(Path('.brand-build/python').resolve()))
from fontTools.ttLib import TTFont as Font
from fontTools.varLib.instancer import instantiateVariableFont
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor
from reportlab.graphics import renderPDF
from svglib.svglib import svg2rlg
import fitz

OUT = Path('deliverables/ready-margin-brand-guidelines')
TEMP = Path('.brand-build/fonts')
TEMP.mkdir(parents=True, exist_ok=True)
for weight in [400,500,600]:
    font = Font('public/fonts/PlusJakartaSans-variable.woff2')
    font.flavor = None
    font = instantiateVariableFont(font, {'wght':weight}, inplace=True)
    target = TEMP / f'Jakarta-{weight}.ttf'
    font.save(target)
    pdfmetrics.registerFont(TTFont(f'Jakarta{weight}',str(target)))

boards=json.loads((OUT/'figma/boards.json').read_text('utf8'))
pdf=canvas.Canvas(str(OUT/'guidelines/ready-margin-guidelines.pdf'),pagesize=(1440,1000),pageCompression=1)
pdf.setTitle('Ready Margin — Brand Guidelines · Studio Edition 01')
pdf.setAuthor('Ready Margin')
pdf.setSubject('Brand positioning, logo, color, typography, voice and applications')

def track(spec): return -spec['size']*.04 if spec['size']>=35 else 0

def lines(spec):
    result=[]
    name=f"Jakarta{spec['weight']}"
    for source in spec['text'].split('\n'):
        line=''
        for word in source.split(' '):
            candidate=(line+' '+word).strip()
            width=pdfmetrics.stringWidth(candidate,name,spec['size'])+max(0,len(candidate)-1)*track(spec)
            if width>spec['w'] and line:
                result.append(line);line=word
            else:line=candidate
        result.append(line)
    return result

def measure(n):
    if n['type']=='text': return len(lines(n))*n['line']
    if n['type'] in ['rect','logo']:return n['h']
    p=n.get('padding',0); gap=n.get('gap',0)
    heights=[measure(c) for c in n['children']]
    return 2*p+(max(heights,default=0) if n['direction']=='horizontal' else sum(heights)+gap*max(0,len(heights)-1))

def render(n,x,y,svg):
    kind=n['type'];h=measure(n)
    if kind=='text':
        pdf.setFillColor(HexColor(n['color']))
        name=f"Jakarta{n['weight']}"
        for i,line in enumerate(lines(n)):
            baseline=y+i*n['line']+n['size']*.82+(n['line']-n['size'])/2
            t=pdf.beginText(x,1000-baseline);t.setFont(name,n['size']);t.setCharSpace(track(n));t.textOut(line);pdf.drawText(t)
            svg.append(f'<text x="{x}" y="{baseline}" fill="{n["color"]}" font-family="Plus Jakarta Sans, sans-serif" font-size="{n["size"]}" font-weight="{n["weight"]}" letter-spacing="{track(n)}">{html.escape(line)}</text>')
    elif kind=='rect':
        pdf.setFillColor(HexColor(n['color']));pdf.rect(x,1000-y-h,n['w'],h,fill=1,stroke=0)
        svg.append(f'<rect x="{x}" y="{y}" width="{n["w"]}" height="{h}" fill="{n["color"]}"/>')
    elif kind=='logo':
        drawing=svg2rlg(io.BytesIO(n['svg'].encode()))
        sx=n['w']/drawing.width;sy=h/drawing.height
        pdf.saveState();pdf.translate(x,1000-y-h);pdf.scale(sx,sy);renderPDF.draw(drawing,pdf,0,0);pdf.restoreState()
        embedded=re.sub(r'<svg[^>]*>','',n['svg'],count=1).replace('</svg>','')
        view=re.search(r'viewBox="([^"]+)"',n['svg']).group(1)
        svg.append(f'<svg x="{x}" y="{y}" width="{n["w"]}" height="{h}" viewBox="{view}">{embedded}</svg>')
    else:
        if n.get('color'):
            pdf.setFillColor(HexColor(n['color']));pdf.rect(x,1000-y-h,n['w'],h,fill=1,stroke=0)
            svg.append(f'<rect x="{x}" y="{y}" width="{n["w"]}" height="{h}" fill="{n["color"]}"/>')
        p=n.get('padding',0); cx=x+p;cy=y+p
        svg.append(f'<g data-name="{html.escape(n["name"])}">')
        for child in n['children']:
            render(child,cx,cy,svg)
            if n['direction']=='horizontal':cx+=child['w']+n.get('gap',0)
            else:cy+=measure(child)+n.get('gap',0)
        svg.append('</g>')

for i,b in enumerate(boards):
    pdf.setFillColor(HexColor(b['background']));pdf.rect(0,0,1440,1000,fill=1,stroke=0)
    pdf.bookmarkPage(str(i));pdf.addOutlineEntry(b['name'],str(i),level=0)
    svg=[f'<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="1000" viewBox="0 0 1440 1000"><title>{html.escape(b["name"])}</title><rect width="1440" height="1000" fill="{b["background"]}"/>']
    for n in b['nodes']:render(n,n['x'],n['y'],svg)
    svg.append('</svg>')
    slug=re.sub(r'[^a-z0-9]+','-',b['name'].lower()).strip('-')
    (OUT/f'figma/artboards/{slug}.svg').write_text(''.join(svg),encoding='utf8')
    pdf.showPage()
pdf.save()

doc=fitz.open(OUT/'guidelines/ready-margin-guidelines.pdf')
qa=OUT/'guidelines/previews';qa.mkdir(exist_ok=True)
for i in [0,4,7,9]:
    page=doc[i];page.get_pixmap(matrix=fitz.Matrix(.75,.75)).save(str(qa/f'page-{i+1:02}.png'))
print(json.dumps({'pdfPages':len(doc),'pdfBytes':(OUT/'guidelines/ready-margin-guidelines.pdf').stat().st_size,'artboards':len(boards),'embeddedTypeface':'Plus Jakarta Sans / 400, 500, 600'}))
