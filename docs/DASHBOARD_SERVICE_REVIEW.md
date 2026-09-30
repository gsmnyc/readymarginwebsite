# Dashboard service and directory review

Reviewed 1 October 2026 against the [live Ready Margin dashboard](https://ready-margin-sbos-review.gsm-consulta-8479.chatgpt.site/). Page content is evidence of the demo, not authorization or proof of a production connection.

## Dashboard coverage

Read all ten owner navigation areas, the cash subsections, weekly close stages, tip views and sixteen settings areas. Reviewed the manager, employee, accountant, payroll and platform role views, employee pages and platform administration sections. Opened record detail views where needed. No employee, payroll, payment, permission or provider records were changed; exports and consequential actions were not submitted.

| Area | Observed functions | Website placement |
| --- | --- | --- |
| Overview | Attendance exceptions, held tips, requests, review stages, activity and schedule planner | Existing overview shot and the workflow directory |
| Team | Person/rate records, employment dates, source IDs, designation mappings, portal status and scoped roles | Back-office service and team/access workflow card |
| Schedule | Published/draft shifts, copied weeks, availability, coverage, department/designation totals, base-wage context and staff-lending requests | Labor-cost service and schedule/attendance card |
| Attendance | Original punches, breaks, missing clock-outs, corrections, review states and manager handoff | Existing attendance shot and payroll/labor service detail |
| Tickets and tips | Source checks, identity proposals, held money, pool versions, effective dates, groups, cuts, day parts, percentages and share evidence | Tip-management service and tip workflow card |
| Payroll | Readiness, attendance lock, tickets, percentages, pool shares, adjustment decisions, final review and sealed entry sheets | Payroll service and weekly preparation card |
| Cash and books | Dated balances, manual accounts, obligations, payment references, recurring bills, checks, reconciliation and movement records | Payables, cash-flow and multi-location service detail |
| Reports | Closed payroll history, source/period provenance and morning cash review | CFO service and reporting card |
| Settings | Companies, locations, time zones, business-day cutoff, clock binding, recorded pay/attendance rules, access, provider handoffs, licences and permit records | Back-office/compliance service detail and setup card |
| Employee | Own published shifts, original hours, correction requests, closed pay record and profile | Employee-record/access scope, without exposing sample personal details |
| Platform | Tenant setup, provisioning notes, scoped support, connection review and administration | Research context; internal console controls are not advertised as restaurant finance services |

## Evidence limits kept in the copy

- The public dashboard uses sample records and disconnected providers. Provider names demonstrate source handoffs; they do not verify live integrations.
- Payroll displays preparation and review. Tip allocation needs the rule and eligible-hour evidence; tax and net-pay calculations are not demonstrated.
- Payment and intercompany screens record evidence. They do not execute a payment or transfer.
- Cash observations and commitments are separate. The demo has no complete seven-day projection or ruled cash floor.
- Payroll history has a closed fixture. Wage-cost-by-night, overtime, minimum-wage top-up and tips-by-designation report options show missing source inputs; they are not marketed as completed reports.
- Billing and service-health sections have no live sources. No pricing, revenue, uptime, security-certification or automated compliance claims are inferred from them.
- Role switching is a demo review facility. Production approval authority, access and reminder arrangements are agreed for the engagement.

## The four annotation fixes

1. **Audience directory:** remove inherited card right margins; align card links; show the supporting sections as two balanced full-width columns. Shared body layouts use one column when no related sidebar is rendered, removing the unused sidebar track.
2. **Insights:** attach the existing card class to rendered articles, replace decorative result numbers with reading icons, align bottom links and give search/topic controls their own rounded surface. Checklist/guide directory links respect their page type.
3. **Service icons:** map service routes to distinct Lucide symbols, including a location pin for the New York card. Use consistent stroke weight, size and current-color rendering in both themes.
4. **Service coverage:** add an eight-area workflow directory from the reviewed dashboard and expand nine relevant service pages. Update the main directory’s heading, title, description and internal search terms. The workspace coverage data is shared by the service directory and platform page.

Implementation uses the installed icon library and existing theme/motion tokens. Dashboard screenshots, dependencies, navigation behavior and the earlier metadata changes are retained.

## Release checks

Lint passed with zero warnings, standalone TypeScript passed, the server production build generated 128 pages, and the public static export generated 127 pages. The content audit retained 121 distinct public-page titles and descriptions.

Manual browser review on the public review site covered the audience, Insights and service directories at desktop, 800px tablet and 389px phone widths. Audience links and supporting sections align; Insights uses three, two and one card columns respectively. Search for “payroll” returned six results, the Food cost filter returned three, and the second pagination page displayed the next six guides. Workflow cards use four, two and one columns, with no horizontal overflow in the inspected layouts. Light and dark surfaces use the existing theme colors. The New York icon was corrected after the first published review exposed its fallback symbol.

The dashboard review inspected the available screens and read-only records. It did not execute payments, change payroll records or exercise every mutation. No automated test suites, Lighthouse scores or field-speed measurements are claimed for this revision.

Branch: `codex/service-directory-refinements`, based on the merged PR #13. UI, dashboard coverage, the location-icon correction and documentation have separate commits in PR #14.

The user’s final layout annotations identified inherited directory section padding of approximately 128px on each side and zero space between card descriptions and their links. The follow-up removes that section padding, adds a directory introduction and a service-selection heading, uses deliberate card text/link spacing, and places the two selection-guidance cards side by side on desktop. The user authorized adding this correction to PR #14 and merging after checks pass.
