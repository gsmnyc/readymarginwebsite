# Restoration release

## Directory and dashboard coverage follow-up — 1 October 2026

This follow-up addresses the audience, Insights and service-directory annotations after PR #13 merged. It uses consistent rounded cards, distinct service icons and shared workflow coverage based on a read-only review of the live dashboard. Nine service pages add specific team, shift, tip, payroll, cash, payment-record and compliance-record tasks. See [Dashboard service review](DASHBOARD_SERVICE_REVIEW.md) for the observed functionality and limits.

Local lint, TypeScript, the 128-page server build and the 127-page static export passed. Public browser review covered desktop, 800px tablet and 389px phone layouts, both themes, Insights search/topic filtering and pagination. The branch is `codex/service-directory-refinements`; it follows the merged PR #13 as a new review PR. These checks do not claim live provider execution, automated test-suite coverage or measured search rankings.

## Title and metadata follow-up — 1 October 2026

The follow-up changes the homepage search title, refines thirteen route titles and aligns canonical/social URLs. It adds actual social-image dimensions, alternative text, locale, existing article dates and the root metadata base/application name. [Title and metadata review](TITLE_AND_METADATA_REVIEW.md) records competitor sources and official search guidance. The user authorized pushing this focused commit and merging PR #13 after successful build checks, preserving its existing commit history.

## Copy and search review — 1 October 2026

This review rewrites 121 content routes, the homepage and shared product, pricing and enquiry copy. It adds page-specific questions, direct answers and consistent search metadata. See [Copy and search review](COPY_AND_SEARCH_REVIEW.md) for scope, sources and business confirmation items.

The expanded product tabs, desktop/mobile menu organization, theme-aware service cards and compact mobile legal links are retained and reviewed. The desktop footer has four equal columns. The follow-up review removes the footer stickers, repeated hero badges, generic screenshot labels and arbitrary section numbering. Hero and body cards now use the same outer width and content gutter.

Lint (zero warnings), standalone TypeScript, the server production build and the public static export passed. Manual browser review covered desktop and mobile menus, tab labels, centered close controls, light/dark surfaces, footer columns and an accounting-page FAQ. No automated test suites or field-speed measurements were run for this revision.

The user reviewed the public website and authorized these follow-up fixes and focused GitHub commits to PR #13. Publication uses a separate Sites source snapshot. The later title/metadata request authorizes merging after successful build checks.

The follow-up commits are `0d7895a` (content), `21f4b81` (search and visible answers), and `efde649` (shared layout and footer). Documentation is committed separately. All 121 headings and descriptions are distinct; the content review covers 344 sections. The shared body wrapper also removes the older tablet width cap rather than compensating with route-specific offsets.

Final follow-up checks: lint, standalone TypeScript, server build and public static export passed. Manual review confirmed matching hero/product card edges and heading gutters at desktop and 700px tablet width, matching service-card widths at phone width, a visible short answer, no repeated hero badges or section-number ornaments, and a footer wordmark without stickers or reserved sticker space. Desktop and phone checks included theme surfaces. These checks do not claim that every route received a separate browser session.

Branch: `codex/website-quality-restoration`.

## Scope

Restore the accepted website before the speed rewrite, then fix specific interaction, copy and search issues. The discarded performance commit is not part of this branch. Existing Motion and Radix behavior is retained; original screenshot assets and the rounded layout are unchanged.

The new history separates the earlier website revision, interface fixes, content cleanup and documentation. See the changelog for commit references. Unfinished brand-guide work in the original workspace is preserved separately.

## Build and review

The release supports the Next.js server build and static Sites export. CI installs the locked dependencies, checks lint and TypeScript, and builds both formats. The server build generates Next.js type declarations before the separate type check. IndexNow is disabled in CI, and the static CI export uses preview mode.

Local production checks completed:

- Standalone TypeScript and lint checks passed with zero lint warnings.
- Next.js server build: compilation, TypeScript and 128 generated pages succeeded.
- Static Sites export: compilation, TypeScript and 127 generated pages succeeded.
- Browser review at desktop, 390px and 320px: product keyboard tabs, screenshot dialog, desktop/mobile menu differences, centered menu close control, light/dark footer surfaces and responsive legal links.
- Both service directories use the same 19-service registry. The overview directory renders without horizontal overflow at 320px; a rewritten answer page was also reviewed at that width.
- Blank enquiry submission focuses the required name field. No enquiry was transmitted.
- The `motion=off` setting is retained, and the desktop footer keeps four equal columns.

The release does not claim a Lighthouse score or measured field-vitals improvement. Existing automated test suites were not run. Confirm receiver delivery and domain redirects in the intended deployment environment before publication.

## Merge and publication

The user authorized merging PR #13 after the metadata follow-up passes its checks. Preserve the focused history using a normal merge commit. Deployment settings determine what publishes after a merge. A static enquiry prepares a visitor-controlled email draft; the server enquiry needs a configured receiver to confirm delivery.

Before a live server release, confirm the receiver, business origin and redirect configuration in that deployment environment. Keep credentials out of commits and source archives.
