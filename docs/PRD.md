# PRODUCT REQUIREMENTS DOCUMENT (PRD)
## Company Profile Website & Filament CMS

| Metadata | Value |
|---|---|
| Document ID | PRD-CP-001 |
| Version | 1.1 |
| Date | 2026-11-24 |
| Status | Approved requirements baseline for planning; implementation not started |
| Project | Company Profile CMS |
| Repository | New, separate repository (`company-profile-cms` proposed) |
| Product Owner | Project owner (human) |
| Priority now | GitHub multi-agent workflow foundation (M0), **not UI design** |

## 1. Purpose and problem statement
Develop a professional, modern-minimalist corporate profile website with a Laravel backend, MySQL database, and a Filament-based content management system. Public visitors should be able to discover the company's identity, team, achievements, news, publications/studies, IT projects, and contact details. Authorized administrators must be able to manage relevant content without manually editing source code.

The development process itself is a first-class requirement: GitHub Issues capture scoped work planned by a high-reasoning AI agent; a cost-efficient executor implements it via a feature branch and PR; a high-reasoning reviewer evaluates against acceptance criteria; failures generate actionable corrections; passing work proceeds through checks and human-controlled release gates.

## 2. Product objectives and measures
1. Publish accurate and navigable company information, managed through CMS.
2. Support editorial workflows for publication content, with draft versus published visibility.
3. Provide website-wide search and SEO-friendly pages.
4. Enforce authentication and authorization for CMS operations.
5. Ensure every implementation task is traceable from Issue to PR, review, tests, and release.
6. Optimize AI usage by reserving high-reasoning agents for planning and consequential reviews.

Initial acceptance metrics (targets; not current achievements): all mandatory pages reachable from navigation; 100% of public content types editable by permitted CMS users; draft content not publicly accessible; key automated tests passing; staging verified before human-approved production release.

## 3. Technology and constraints
- Language: **PHP 8.6 requested target**. This is a hard product preference, but its availability and actual compatibility with Laravel, Filament, Composer packages, required PHP extensions, CI runners and hosting **must be verified before application scaffolding**. Do not assert support or silently downgrade. Document any blockers and present an alternative for the owner's explicit approval.
- Framework: Laravel 13 target, pending the compatibility gate above.
- Database: MySQL 8.x.
- CMS: Filament 5 target, pending compatibility verification.
- Frontend: Laravel Blade, Tailwind CSS, Alpine.js and Vite (implementation deferred).
- Testing: Pest or PHPUnit, selected during architecture phase.
- Source and work coordination: GitHub repository, Issues, Projects, Pull Requests, Actions, rulesets and environments as supported by actual plan and permissions.
- Visual direction: **modern, minimalist, responsive**. Detailed UI design **is postponed** until the GitHub workflow foundation is working.

## 4. User roles
| Role | Intended permissions |
|---|---|
| Public visitor | Read published information, search site, send contact message |
| Super Admin | Configure website, roles, users, all content |
| Content Admin | Manage authorized content modules |
| Editor | Review and publish editorial content |
| Author | Create and edit assigned drafts |
| Product owner | Approve high-risk requirements and production deployment |

Authorization must be enforced server-side using Laravel policies/permissions, not only through hidden UI elements.

## 5. Information architecture — FINAL NAVIGATION
The navigation **must** be exactly structured as follows for MVP:

1. **Tentang Kami** (main menu)
2. **Layanan** (dropdown)
   - Visi/Misi
   - Direktur Eksekutif
   - Tim Ahli
   - Struktur Organisasi
   - Tujuan Perusahaan
   - Nilai Perusahaan
   - Pencapaian
3. **Publikasi** (dropdown with **exactly three** child menu items)
   - Berita
   - **Publikasi dan Kajian** (ONE combined submenu, not separate menu entries)
   - **Project IT** (inside Publikasi, NOT a standalone top-level menu)
4. **Kontak** (main menu)
5. **Search** (icon/control in navbar, site-wide search)

Homepage is accessible through logo/brand; it is not required as a separate text menu. Dropdowns must work by keyboard and pointer on desktop and by tap on mobile. The seemingly profile-related categories under `Layanan` are retained as explicitly requested; do not reorganize without product-owner approval.

## 6. Functional requirements
### 6.1 Public website
| ID | Requirement | Acceptance criteria |
|---|---|---|
| FR-001 | Navbar and dropdown | Exact structure in §5; desktop/mobile accessible; links valid |
| FR-002 | Homepage | Hero, short company intro, selected highlights, recent content, contact CTA, footer; content from CMS |
| FR-003 | Tentang Kami | Editable profile/history/overview and corporate identity |
| FR-004 | Visi/Misi | Editable vision and ordered mission list |
| FR-005 | Direktur Eksekutif | Profile, title, photo, biography and optional message |
| FR-006 | Tim Ahli | Multiple expert records with specialty, qualifications, photo, display ordering |
| FR-007 | Struktur Organisasi | Chart/file and explanatory content; file validation |
| FR-008 | Tujuan Perusahaan | Ordered goals, editable in CMS |
| FR-009 | Nilai Perusahaan | Ordered values, editable in CMS |
| FR-010 | Pencapaian | Year/title/description/media, display ordering |
| FR-011 | Berita | Listing, detail, category, cover, slug, draft/published state, publication date, pagination |
| FR-012 | Publikasi dan Kajian | **One combined public landing/listing and submenu** displaying publications and studies; content type/category filter is permitted. Fields include title, summary, year, category/type, cover, optional public file, detail page. CMS may use one resource with type field or separate internal resources if justified, **but the public menu remains combined** |
| FR-013 | Project IT | Public listing/detail for IT portfolio, technology, media, year, status and optional public demo link; menu lives under Publikasi |
| FR-014 | Kontak | Address, phone, email, social links, map link, inquiry form |
| FR-015 | Site search | Search across published news, publications/studies, IT projects and relevant static pages; keyword input, results page, empty state, pagination |
| FR-016 | SEO | Per-page title, description, canonical, Open Graph, friendly slug, sitemap; site search is not a substitute for SEO |

### 6.2 Filament CMS
| ID | Module | Core capability |
|---|---|---|
| CMS-001 | Dashboard | Content counts and operational status |
| CMS-002 | Company profile | Edit general identity, hero, company text |
| CMS-003 | Vision/mission, goals, values | Edit and reorder |
| CMS-004 | Executive, experts, structure | CRUD and upload validated media |
| CMS-005 | Achievements | CRUD, reorder, feature selection |
| CMS-006 | News | CRUD, draft/publish, category, scheduled publish if feasible |
| CMS-007 | Publications & studies | Maintain categorized content shown under a single combined public section; upload public files safely |
| CMS-008 | Project IT | CRUD, media gallery, project metadata |
| CMS-009 | Contact inbox | View and update inquiry statuses; anti-spam controls |
| CMS-010 | Media | Allowed MIME types, file size limits, storage control |
| CMS-011 | Site settings | Logo, favicon, contact/footer/social links and SEO defaults |
| CMS-012 | Users/roles | Backend authorization and role management |
| CMS-013 | Audit logging | Record sensitive content/admin changes |
| CMS-014 | Navigation | Update labels/order/visibility where safe, preserving required default structure |

Common content fields: id, title/name, unique slug if applicable, body/summary, published status/time, metadata, image references, created_at, updated_at; use soft delete where justified.

### 6.3 Contact security and file handling
- Validate all inputs and apply rate limiting/anti-spam to the contact form.
- Store messages securely; email sending should fail safely without losing the message record.
- Files intended to be private must not be placed directly in public storage.
- Permit public downloads only when deliberately marked and authorized for release.

## 7. Preliminary data model (not a committed schema)
Tables/entities to evaluate during architectural design: `users`, role/permission tables, `company_profiles`, `company_missions`, `executives`, `experts`, `organization_structures`, `company_goals`, `company_values`, `achievements`, `news`, `content_categories`, `publications_and_studies` (single polymorphic or typed model **or** distinct models with a unified presentation layer), `it_projects`, `media`, `navigation_items`, `contact_messages`, `site_settings`, `activity_logs`.

The exact schema, indexes, constraints and whether publications/studies share one physical table must be planned by the Planner. Do not derive a requirement for two public menu items or two separate CMS modules merely from separate content concepts.

## 8. Nonfunctional requirements
- Responsive and keyboard-accessible UI; target WCAG 2.2 AA for major flows.
- Performance: define reproducible measurement setup, target Lighthouse 85+ on key public pages after implementation.
- Secure authentication, server-side permissions, CSRF protection, input validation, upload hardening, secret management.
- Search should not expose drafts or private records.
- Automated test strategy covering authorization, publication status, search, contact form, and CMS CRUD.
- Logging, backups, and tested rollback for production operation.
- SEO-friendly URLs and content metadata.
- Maintainable Laravel architecture and documented setup commands.

## 9. Multi-agent GitHub development workflow — PRIMARY FIRST MILESTONE
### 9.1 Roles
**Planner (high-reasoning model)**: reads this PRD, assesses repository and environment, drafts architecture, creates small GitHub Issues with dependencies, risks, detailed acceptance criteria and testing plan. No routine feature coding.

**Executor (cost-efficient coding model)**: reads ready Issue and `AGENTS.md`, edits only approved scope on feature branch, runs tests, creates linked PR, records results, responds to reviewer feedback. No production credentials or direct production deployment.

**Reviewer (high-reasoning model)**: reads Issue/PR and actual diffs, checks behavior against acceptance criteria, security, tests, and regression risks; returns `APPROVED`, `CHANGES_REQUESTED` with exact actionable fixes, or `BLOCKED`. Never invents test execution or approvals.

**Human owner**: approves architecture changes, high-risk changes and release to production. AI review is not equivalent to GitHub branch protection or required human approval.

### 9.2 Required states
`BACKLOG → READY → IN_PROGRESS → IN_REVIEW`.
From review: `CHANGES_REQUESTED → IN_PROGRESS → IN_REVIEW`, or `APPROVED → MERGED → STAGING → PRODUCTION_APPROVAL → DEPLOYED → DONE`; `BLOCKED` may interrupt with recorded reasons. Document who can transition each state and the evidence required.

### 9.3 Issue contract
Each Issue must specify: title, user/business value, technical objectives, scope and out-of-scope, dependencies, suggested components/files, acceptance criteria, tests, security risks, priority, risk level, agent ownership, Definition of Done. No vague issue such as “build the website”.

### 9.4 Pull Request contract
Every PR links an Issue and contains implementation summary, changed files, tests with actual outputs, data migration implications, security considerations, limitations and reviewer checklist. Reviewer rejection must include severity, file/location, defect reason, exact fix and verification instructions. Rework the **same PR**, avoiding duplicate tasks.

### 9.5 GitHub requirements
- New repository; protected `main` with required PR and checks wherever supported.
- Labels for type (`feature`, `bug`, `chore`), module, priority, risk and agent responsibility.
- GitHub Projects board for workflow states if supported.
- Issue Forms, PR template, `AGENTS.md`, architectural docs, CI and deploy workflow templates.
- Automated CI tests before expensive reasoning-heavy review.
- Deployment to staging before production, with human authorization and rollback. Do not claim that GitHub Actions, reviewer bots, or external connectors are configured unless verified.
- Follow least-privilege permission model; never expose production secrets to untrusted agent code or forks.

### 9.6 Minimum M0 deliverables (workflow-first)
1. `docs/PRD.md` containing this approved baseline (do not silently rewrite product requirements).
2. `AGENTS.md` for model-neutral coding conventions, boundaries and tests.
3. `docs/ARCHITECTURE.md`, `docs/AGENT-WORKFLOW.md`, `docs/ROADMAP.md`, `docs/PHP-COMPATIBILITY.md`.
4. `.github/ISSUE_TEMPLATE/feature.yml`, `bug.yml`, `chore.yml`.
5. `.github/PULL_REQUEST_TEMPLATE.md`.
6. `.github/workflows/ci.yml` that validates files actually present; future Laravel jobs should not claim to have run before scaffolding exists.
7. `.github/workflows/deploy-staging.yml`, `deploy-production.yml` as safe disabled/manual templates, requiring real configuration and release controls.
8. Document branch protection / ruleset setup and Github Projects configuration steps.
9. First small backlog of GitHub Issues for workflow wiring and PHP compatibility validation.
10. Report what is implemented versus blocked, proposed, or pending permission.

**M0 exclusions:** no application scaffolding, database migrations, Filament Resources, public UI styling, hero/mockups, or deployment to any production site. Those come only after workflow foundation acceptance.

## 10. Later milestone roadmap (outline)
- **M0 — Workflow foundation:** GitHub Issue/PR conventions, multi-agent runbook, safe CI, compatibility gate.
- **M1 — Application foundation:** once compatible runtime approved, Laravel+MySQL+Filament, auth, roles, basic application CI.
- **M2 — Company profile CMS:** company, executive, experts, organization, values, goals, achievements, homepage content.
- **M3 — Publishing CMS:** news, **combined Publications & Studies**, and Project IT; all three under Publikasi dropdown.
- **M4 — Search, contact, SEO:** public site search, inquiries, metadata, sitemap.
- **M5 — UI/UX and verification:** modern-minimalist design, responsiveness, accessibility, security and regression testing.
- **M6 — Release:** staging UAT, backups, rollback, explicit approval and production deployment.

## 11. Definition of Done and release gates
A feature is considered complete only when it meets the Issue acceptance criteria, tests and security checks have run and passed (with evidence), reviewer findings are resolved, and relevant documentation is updated. Merge requires branch protections/checks actually configured. Production release requires separate human authorization, backups and rollback readiness. An AI comment saying `APPROVED` never by itself authorizes production deployment.

## 12. Out of scope for M0 and unresolved decisions
Out of M0: UI design, public pages, business content entry, physical schema creation, paid search infrastructure, deployment execution.

Unresolved and to be verified/documented by Planner: PHP 8.6 support by the selected framework/dependencies/host; GitHub account plan and supported required checks/environment approvals; AI runner/model integrations and their costs; target production hosting; real company name/logo/content; editorial governance for document publication; whether combined Publications & Studies use one model or two models behind one menu. Do not block M0 documentation for unresolved later-stage choices.

## 13. Change control and precedence
This PRD is the authoritative product requirements baseline. The latest explicit owner decisions override previous drafts: **PHP 8.6 as target, a new repository, a combined “Publikasi dan Kajian” submenu, Project IT inside Publikasi, and workflow implementation before design**.

Planner may elaborate architecture and issue detail but may not silently alter these decisions. Proposed deviations must be recorded as a decision request and approved by the owner. Issues and PRs must reference this PRD and relevant section IDs.
