"""Check exported artifacts, relative website assets and package integrity."""
from pathlib import Path
import json
import re
import sys
import zipfile
sys.path.insert(0, str(Path('.brand-build/python').resolve()))
import pymupdf

kit = Path('deliverables/ready-margin-brand-guidelines')
content = json.loads(Path('content/brand-guidelines.json').read_text('utf8'))
assert all(len(p['colors']) == 6 for p in content['palettes'])
assert len(list((kit / 'logos').glob('*.svg'))) == 18
assert len(list((kit / 'logos').glob('*.png'))) == 18
assert len(list((kit / 'mockups').glob('*.png'))) == 8
for app in content['applications']:
    assert (kit / 'mockups' / (app['id']+'.png')).is_file()
    assert (kit / 'website/downloads' / (app['template']+'-template.zip')).is_file()
    assert (kit / 'templates' / (app['template']+'.svg')).is_file()
    assert (kit / 'templates' / (app['template']+'.pdf')).is_file()
pdf = pymupdf.open(kit / 'guidelines/ready-margin-guidelines.pdf')
assert len(pdf) == 11
outside = []
for number, page in enumerate(pdf):
    for block in page.get_text('dict')['blocks']:
        for line in block.get('lines', []):
            for span in line['spans']:
                x0, y0, x1, y1 = span['bbox']
                if x0 < -1 or y0 < -1 or x1 > page.rect.width + 1 or y1 > page.rect.height + 1:
                    outside.append((number + 1, span['text']))
assert not outside, outside
for pair in json.loads((kit / 'tokens/contrast-audit.json').read_text('utf8')):
    assert pair['ratio'] >= 4.5
for required in ('app.js', 'app.css', 'assets/PlusJakartaSans-variable.woff2', 'assets/ready-margin.svg', 'assets/ready-margin-reverse.svg', 'downloads/ready-margin-assets.zip', 'downloads/ready-margin-logos.zip', 'downloads/ready-margin-guidelines.pdf', 'downloads/ready-margin-tokens.json'):
    assert (kit / 'website' / required).is_file(), required
css = (kit / 'website/app.css').read_text('utf8')
assert 'var(--font-jakarta)' not in css
assert '/brand-guide/' not in css
assert './assets/PlusJakartaSans-variable.woff2' in css
code = (kit / 'figma/code.js').read_text('utf8')
assert 'BRAND_DATA' not in code and 'figma.createAutoLayout(' not in code
archive = Path('deliverables/Ready-Margin-Brand-Guidelines-Studio.zip')
with zipfile.ZipFile(archive) as z:
    assert z.testzip() is None
    names = z.namelist()
    assert not any(re.search(r'(mcp-|build-input)', name, re.I) for name in names)
    assert len([name for name in names if '/figma/artboards/' in name]) == 11
    for name in names:
        path = kit / Path(name).relative_to('Ready-Margin-Brand-Guidelines')
        assert z.read(name) == path.read_bytes(), name
print(json.dumps({'paletteColors': sum(len(p['colors']) for p in content['palettes']), 'logoFormats': 6, 'logoExports': 36, 'mockups':8, 'applicationTemplates':8, 'pdfPages': len(pdf), 'pdfTextWithinPage': True, 'svgBoards': 11, 'zipFiles': len(names), 'relativeWebsiteAssets': True, 'archiveMatchesFinalSource': True}))
