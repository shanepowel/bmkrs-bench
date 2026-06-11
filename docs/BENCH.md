# the bench — product spec

working name: **the bench**. builder-coded, lowercase. network@bmkrs.com's product.

## mapping

| portal | bench | change |
|---|---|---|
| freelancer profile | partner profile | keep, enrich |
| public signup | application to the network | repurpose |
| search / categories | bench search (studio-only) | keep, private |
| job listing | project brief (invited partners) | reshape |
| proposal | availability response | simplify (phase 3) |
| messaging | project + network threads | keep |
| star reviews | track record + studio notes | replace (phase 5) |
| payments | off-platform invoicing | retire ui v1 |
| public seo | fnm only | not in bench |
| admin | studio view | expand |

## trust model

`applied` → `reviewed` → `trusted` → `core`

every change logged in `PartnerStatusEvent`. engagements write the inspectable track record.

## roles (clerk + db)

| role | view |
|---|---|
| applicant | `/application` only |
| partner (TALENT) | `/partner` |
| client | `/client` |
| studio (ADMIN) | `/studio` |

## build phases

1. **fork + strip + retheme + shells** — shipped
2. **partner profiles + pipeline workflow** — shipped: application form, status events, studio vetting ui
3. bench search + briefs + availability responses
4. client "your team" panels + project threads
5. track records surfaced on profiles

## strategic

- amplifiedteams thesis productised under bmkrs
- website team section eventually reads from bench api (core partners)
- credibility asset on bmkrs work page when phase 2 ships
