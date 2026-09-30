# Restoration release

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

Review the PR before merging to `main`. No merge is performed as part of preparing the branch. Deployment settings determine what publishes after a merge. A static enquiry prepares a visitor-controlled email draft; the server enquiry needs a configured receiver to confirm delivery.

Before a live server release, confirm the receiver, business origin and redirect configuration in that deployment environment. Keep credentials out of commits and source archives.
