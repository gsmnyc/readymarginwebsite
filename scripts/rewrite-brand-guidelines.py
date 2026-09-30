"""Replace generic brand language with Ready Margin's restaurant operating context."""
from pathlib import Path
import json
data_path=Path('content/brand-guidelines.json')
data=json.loads(data_path.read_text('utf8'));data['version']='1.1'
data['positioning']='Restaurant finance and operations support, from daily sales reconciliation to the monthly close.'
roles=['Paper for documents; ink for text; stone for table rules and dividers.','Gold marks actions, key figures and the centre of the Ready Margin symbol.','Use green for operations, approved work and completed records.','Use terracotta for restaurant stories, team communication and printed working materials.','Use slate for reports, data views and longer financial documents.']
for palette,role in zip(data['palettes'],roles):palette['role']=role
for composition,name,note in zip(data['compositions'],['Client correspondence','Operations & approvals','Restaurant stories','Monthly reporting'],['Use paper, ink and gold for letters, invoices, business cards and client emails.','Use deep forest for operational reviews and sage for confirmed or approved work.','Use warm clay tones for restaurant visits, working notes and stories from the floor.','Use midnight and cloud for reporting covers and data-heavy communication.']):
    composition['name']=name;composition['note']=note
data['voice']=[
 {'title':'Name the record','description':'Say which invoice, settlement or time record needs attention. Include the amount or date that identifies it.','before':'There are outstanding items on your account.','after':'Two supplier invoices from 29 September need your approval.'},
 {'title':'Give the next step','description':'Tell the owner what to do, where to do it and when the work is due.','before':'Please review this when you get a chance.','after':'Approve the two invoices in your workspace by Friday, 2 October.'},
 {'title':'Keep the scope clear','description':'Distinguish prepared work from approved work. Keep the owner’s decision separate from the finance task.','before':'Payroll is sorted.','after':'Payroll is prepared. The manager needs to approve the amended hours before submission.'}
]
data['identity']=[
 {'id':'ready-margin','name':'Primary logo','use':'Website headers, client letters, invoices and email sign-offs. Minimum width: 140 px / 35 mm.','width':433,'height':70},
 {'id':'ready-margin-stacked','name':'Stacked logo','use':'Square covers and narrow placements where the horizontal logo will not fit. Minimum width: 110 px / 28 mm.','width':320,'height':306},
 {'id':'ready-margin-wordmark','name':'Wordmark','use':'Small document footers and text-led placements where the full logo already appears nearby. Minimum width: 110 px / 28 mm.','width':351,'height':61},
 {'id':'ready-margin-logomark','name':'Logomark','use':'Workspace navigation, app icons, favicons and the back of a business card. Minimum width: 24 px / 6 mm.','width':144,'height':144},
 {'id':'ready-margin-badge','name':'Badge','use':'Notebook labels, folder seals and square profile artwork. Keep the badge as a single supplied asset. Minimum width: 120 px / 30 mm.','width':320,'height':320},
 {'id':'ready-margin-badge-xl','name':'Badge XL','use':'Review folders, larger notebook covers and presentation cover panels. Includes the service descriptor. Minimum width: 240 px / 60 mm.','width':800,'height':520}
]
data['applications']=[
 {'id':'business-cards','title':'Business cards','category':'Print','description':'Contact cards for restaurant visits. The front carries the full logo; the back can carry the logomark.','template':'business-card','format':'85 × 55 mm','usage':'Scale the supplied artwork to 85 × 55 mm. Add a 3 mm bleed for print and keep contact details at least 4 mm from the trim.'},
 {'id':'letterhead','title':'Letters & correspondence','category':'Print','description':'An A4 letterhead for review summaries, agreed next steps and formal client correspondence.','template':'letterhead','format':'A4 / 210 × 297 mm','usage':'Keep the logo at the top left and the contact details at the top right. Use the subject line to identify the month and the task.'},
 {'id':'invoice','title':'Client invoices','category':'Print','description':'A service invoice with clear dates, line items, payment terms and an easy-to-find total.','template':'invoice','format':'A4 / 210 × 297 mm','usage':'Replace the sample client, invoice number, service lines and payment terms. Use the gold panel for the total only; keep tax and payment details explicit.'},
 {'id':'dashboard','title':'Restaurant workspace','category':'Digital','description':'A product application for sales, prime cost, reconciliation and the owner’s approval queue.','template':'dashboard','format':'1280 px / responsive HTML','usage':'Use paper for the work area, ink for navigation and gold for key figures. Show a text status beside every colored indicator. Sample records are included in the prototype.'},
 {'id':'client-email','title':'Client emails','category':'Digital','description':'A monthly-close update and email signature, with the requested action and deadline above the sign-off.','template':'client-email','format':'600 px email / HTML & EML','usage':'Lead with the task, name the records and give one deadline. The EML file embeds the logo as an attachment; edit the recipient and message before sending.'},
 {'id':'monthly-review','title':'Monthly review packs','category':'Print','description':'A printed cover for the sales reconciliation, cost review and decisions discussed with the owner.','template':'monthly-review','format':'A4 / 210 × 297 mm','usage':'Put the restaurant and reporting month on the cover. Keep sample figures out of live reports; replace them with the approved client records.'},
 {'id':'review-notebook','title':'Restaurant review notebooks','category':'Print','description':'A working notebook for site visits, supplier questions, payroll approvals and the next review.','template':'review-notebook','format':'A5 cover / scale artwork','usage':'Use Badge XL on the cover and keep the working title separate. The notebook belongs to the operations team; it is not restaurant guest-facing merchandise.'}
]
data_path.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n','utf8')
p=Path('app/brand-guidelines/guide.tsx');text=p.read_text('utf8')
changes={
 'Studio edition / 01':'Ready Margin / 2026',
 'A little clarity goes a long way.':'Restaurant finance & operations',
 'Made for the work behind':'Support for the work behind',
 '<h1>Make room for<br />what <span>matters.</span></h1>':'<h1>For the work<br />behind <span>service.</span></h1>',
 'Clear numbers. Calmer operations.<br />More time for the restaurant.':'Sales, supplier bills, payroll<br />and the monthly close.',
 'This is how Ready Margin shows up. A considered system for building a brand that feels as capable, clear and human as the work we do.':'Ready Margin supports the work that happens before, during and after service. These guidelines cover the identity and the materials we use with restaurant owners.',
 'Less back office.<br />More front of house<span>.</span>':'Sales reconciled.<br />Payroll ready<span>.</span>',
 'Quietly capable.':'Restaurant first.',
 'Clarity first.':'Work you can trace.',
 'Always human.':'A named next step.',
 'Turn the work behind the scenes into clear records, named responsibilities and useful next steps.':'Keep the invoice, time record or settlement with the question it raises. The owner should be able to follow the work.',
 'Warm, grounded and practical. We understand there’s a real service on the other side of every number.':'Say what needs checking, who needs to approve it and when the work can move forward.',
 'title="One logo. Used well."':'title="The Ready Margin identity"',
 'A recognisable signature, with enough room to breathe. Keep it simple and consistent.':'Six identity formats for documents, product screens and printed working materials. Use the supplied files rather than rebuilding them.',
 'A little warmth. A lot of range.':'Color specifications',
 'Our core stays familiar. Supporting palettes give the brand room to work across stories, reports and everyday communication.':'Paper, ink and gold are the primary colors. Green supports operations; terracotta supports restaurant communication; slate supports reporting.',
 'Built to work together':'Approved color combinations',
 'Choose a palette to see a considered composition.':'Choose the application to see its color combination.',
 'Good work.<br />Clearer numbers.':'Restaurant finance.<br />Work accounted for.',
 'Make room for what matters':'Restaurant finance & operations',
 'Color with a purpose':'Status colors',
 'READABILITY IS PART OF THE BRAND':'TEXT & DATA LEGIBILITY',
 'Good contrast.<br />Every time.':'Readable records.<br />Clear status.',
 'title="Say it clearly."':'title="Typography"',
 'One type family. A useful range of weights. Plus Jakarta Sans brings precision with a human edge.':'Plus Jakarta Sans is used in the website, client documents and workspace. Use regular for paragraphs and semibold for headings.',
 'Good things happen<br />with a little clarity.':'September sales<br />are reconciled.',
 'Less is clearer.':'Separate the levels.',
 'Make the details count.':'Line up the figures.',
 'title="Sound like a person. A capable one."':'title="Writing to restaurant owners"',
 'Write to someone who has a restaurant to run. Be clear about the work, warm about the people and honest about the scope.':'Write the way we work: identify the record, explain the question and give the next step. Use the restaurant’s name and the reporting period when they help.',
 'Can someone understand the work, who owns it and what happens next? If so, it sounds like Ready Margin.':'Name the record. State the action. Include the owner and the deadline. Avoid claims that go beyond the agreed work.',
 'Everything you need.<br />Nothing you don’t.':'Download the<br />Ready Margin files.',
 'The guidelines, essential logo files, color tokens and editable layouts. Everything you need to put the brand to work.':'The identity files, application mockups, document templates and color specifications are available below.',
 'The guidelines, essential logo files, color tokens, editable layouts and a standalone website. All in one considered kit.':'Download the complete identity system, application mockups, working templates and website source.',
 'Essential logo files':'Complete identity files',
 'SVG · Primary, reverse & one-color':'SVG & PNG · Logos, marks, wordmarks & badges',
 'Clarity for the work behind it.':'Restaurant finance & operations.'
}
for before,after in changes.items():text=text.replace(before,after)
start=text.index('      <section id="applications"');end=text.index('      <section id="downloads"',start)
text=text[:start]+'''      <section id="applications" className="bg-section">
        <SectionTitle number="06" title="Ready Margin at work">Letters, invoices, email and the restaurant workspace. Each application includes a downloadable mockup and the files needed to build it.</SectionTitle>
        <div className="bg-application-filters" role="group" aria-label="Application type">{["All", "Print", "Digital"].map((filter) => <button key={filter} aria-pressed={applicationFilter === filter} onClick={() => setApplicationFilter(filter)}>{filter}</button>)}<a href={`${downloadRoot}/ready-margin-mockups.zip`} download>Download all mockups <Arrow down /></a></div>
        <div className="bg-real-applications">{data.applications.filter((item) => applicationFilter === "All" || item.category === applicationFilter).map((item) => <article key={item.id} className={`bg-real-application bg-real-${item.id}`}>
          <a className="bg-real-image" href={`${assetRoot}/mockups/${item.id}.png`} download aria-label={`Download ${item.title} mockup`}><img src={`${assetRoot}/mockups/${item.id}.png`} alt={`Ready Margin ${item.title.toLowerCase()} application mockup`} width="1536" height="1024" loading="lazy" /><span>Download PNG <Arrow down /></span></a>
          <div className="bg-real-caption"><span className="bg-small-label">{item.category.toUpperCase()} / {item.format}</span><h3>{item.title}</h3><p>{item.description}</p><div className="bg-real-downloads"><a href={`${assetRoot}/mockups/${item.id}.png`} download>Mockup PNG <Arrow down /></a><a href={`${downloadRoot}/${item.template}-template.zip`} download>Template files <Arrow down /></a>{item.category === "Digital" && <a href={`${downloadRoot}/templates/${item.template}.html`} target="_blank" rel="noreferrer">Open {item.id === "dashboard" ? "prototype" : "email"} <Arrow /></a>}</div><details><summary>How to use this application</summary><p>{item.usage}</p></details></div>
        </article>)}</div>
        <div className="bg-application-note"><span className="bg-small-label">WORKING FILES</span><p>Mockups show the identity in context. Templates include editable SVG and HTML, plus PDF and PNG exports. Client names and figures in the examples are sample records.</p></div>
      </section>

''' +text[end:]
text=text.replace('  const [weight, setWeight] = useState(600);','  const [weight, setWeight] = useState(600);\n  const [applicationFilter, setApplicationFilter] = useState("All");')
insert=text.index('        <div className="bg-rules-grid">',text.index('<section id="logo"'))
text=text[:insert]+'''        <div className="bg-identity-grid">{data.identity.map((item) => <article key={item.id}><div className="bg-identity-art"><img src={`${assetRoot}/identity/${item.id}.svg`} alt={`Ready Margin ${item.name.toLowerCase()}`} width={item.width} height={item.height} /></div><h3>{item.name}</h3><p>{item.use}</p><div className="bg-identity-downloads">{[{suffix:"",label:"Primary"},{suffix:"-reverse",label:"Reverse"},{suffix:"-one-color",label:"One-color"}].map((variant) => <div key={variant.label}><span>{variant.label}</span><a href={`${assetRoot}/identity/${item.id}${variant.suffix}.svg`} download>SVG</a><a href={`${assetRoot}/identity/${item.id}${variant.suffix}.png`} download>PNG</a></div>)}</div></article>)}</div>
''' +text[insert:]
text=text.replace('file:"ready-margin-tokens.json"},{name:"Editable Figma project"','file:"ready-margin-tokens.json"},{name:"Application mockups",detail:"PNG · Print & digital applications",file:"ready-margin-mockups.zip"},{name:"Working templates",detail:"PDF, SVG, HTML & email files",file:"ready-margin-templates.zip"},{name:"Editable Figma project"')
p.write_text(text,'utf8')
print('Brand language, six identity forms and seven downloadable applications updated.')
