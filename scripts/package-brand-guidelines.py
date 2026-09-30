"""Package the curated brand kit and publish its downloadable files locally."""
from pathlib import Path
import json
import shutil
import zipfile

ROOT = Path(__file__).resolve().parents[1]
KIT = ROOT / 'deliverables' / 'ready-margin-brand-guidelines'
PUBLIC = ROOT / 'public' / 'brand-guide' / 'downloads'
PUBLIC.mkdir(parents=True, exist_ok=True)
DOWNLOADS = KIT / 'website' / 'downloads'
DOWNLOADS.mkdir(parents=True, exist_ok=True)

def curated(path):
    rel = path.relative_to(KIT)
    return path.is_file() and 'previews' not in rel.parts and not path.name.startswith('mcp-') and path.name != 'build-input.json'

def archive(destination, paths, prefix=''):
    with zipfile.ZipFile(destination, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        for p in sorted(paths):
            z.write(p, str(Path(prefix) / p.relative_to(KIT)).replace('\\', '/'))
    with zipfile.ZipFile(destination) as z:
        assert z.testzip() is None, destination

logo_zip = DOWNLOADS / 'ready-margin-logos.zip'
archive(logo_zip, [p for p in (KIT/'logos').iterdir() if p.suffix in ('.svg','.png')])
archive(DOWNLOADS / 'ready-margin-mockups.zip', (KIT / 'mockups').glob('*.png'))
template_assets=[KIT/'font/PlusJakartaSans-variable.woff2',KIT/'font/OFL.txt',KIT/'logos/ready-margin.png',KIT/'logos/ready-margin-reverse.png']
archive(DOWNLOADS/'ready-margin-templates.zip',list((KIT/'templates').glob('*'))+template_assets)
content=json.loads((ROOT/'content/brand-guidelines.json').read_text('utf8'))
for app in content['applications']:
    slug=app['template']; files=list((KIT/'templates').glob(slug+'.*'))+template_assets
    if slug=='client-email':files.append(KIT/'templates/email-signature.html')
    if slug=='dashboard':files += [KIT/'templates/monthly-review.pdf',KIT/'templates/letterhead.pdf']
    archive(DOWNLOADS/f'{slug}-template.zip',files)
for directory in ['templates','font','logos']:
    shutil.copytree(KIT/directory,DOWNLOADS/directory,dirs_exist_ok=True)
shutil.copy2(KIT / 'guidelines' / 'ready-margin-guidelines.pdf', DOWNLOADS)
shutil.copy2(KIT / 'tokens' / 'ready-margin-tokens.json', DOWNLOADS)
asset_zip = DOWNLOADS / 'ready-margin-assets.zip'
assets = [p for d in ('logos', 'tokens', 'font', 'guidelines', 'figma','templates','mockups') for p in (KIT / d).rglob('*') if curated(p)]
archive(asset_zip, assets, 'Ready-Margin-Brand-Assets')
for p in DOWNLOADS.iterdir():
    if p.is_file():
        shutil.copy2(p, PUBLIC / p.name)
    else:
        shutil.copytree(p,PUBLIC/p.name,dirs_exist_ok=True)

zip_path = ROOT / 'deliverables' / 'Ready-Margin-Brand-Guidelines-Studio.zip'
archive(zip_path, [p for p in KIT.rglob('*') if curated(p)], 'Ready-Margin-Brand-Guidelines')
shutil.copy2(zip_path, PUBLIC / 'ready-margin-brand-kit.zip')
shutil.copytree(KIT / 'website', ROOT / 'public' / 'brand-guide' / 'site', dirs_exist_ok=True)
print(json.dumps({'zip': str(zip_path), 'bytes': zip_path.stat().st_size, 'files': len(zipfile.ZipFile(zip_path).namelist()), 'downloads': [p.name for p in PUBLIC.iterdir() if p.is_file()]}))
