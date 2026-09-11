# Security Policy

## Scope

AI Can Run is a fully client-side static site. There is no server, no database,
no account system and no data collection, so the attack surface is limited to
the browser code in `index.html`, `js/` and `css/`.

## Reporting a vulnerability

Please report privately through GitHub's
[Security Advisories](https://github.com/Amz34/ai-can-run/security/advisories/new)
rather than a public issue. Include:

- affected file and line,
- what an attacker could achieve,
- reproduction steps, and
- the browser and version you tested on.

You can expect an acknowledgement within 72 hours and a fix or a written
explanation within 14 days. Please allow that window before public disclosure.

## Categories that matter here

- Cross-site scripting through model or GPU names rendered into the DOM.
- Any code path that transmits user data off the device — this would break the
  project's core privacy promise and is treated as critical.
- Supply-chain issues: a pull request that adds an external script, CDN
  dependency or analytics call.

## Supported versions

The deployed site at <https://amz34.github.io/ai-can-run/> tracks `main`;
fixes land there first. Older commits are not maintained.
