# PlayRcmd standalone demonstration

Your sports life. One command center.

This is a lightweight presentation/server package inside the existing AP source checkout. It reuses the SIEM components in place. It has no AP home-page entry dependency, account, connector, backend data store or copied scheduling engine.

From the repository root:

```sh
npm ci --ignore-scripts
npm --prefix playrcmd start
```

Review at http://127.0.0.1:4310. Direct demo: http://127.0.0.1:4310/demo?scenario=family. Stop with Ctrl-C. The AP server is started separately with the unchanged root command and port.

`review.config.json` supplies the isolated local port and host. `PLAYRCMD_PORT` and `PLAYRCMD_HOST` can override them. Default bind is loopback. No domain, hosting account or production deployment is configured.

```sh
npm --prefix playrcmd test
npm --prefix playrcmd run test:browser
npm test
```

Browser checks require Python Playwright and its Chromium browser. Set `PLAYRCMD_ENGINES=chromium,webkit` only where both browser runtimes and native libraries are installed. `WEBKIT_PATH` optionally selects a compatible WebKit launcher. `PLAYRCMD_QA_BASE` overrides the review URL; `PLAYRCMD_QA_ARTIFACTS` selects the screenshot directory. Browser tests create fictional records in an isolated context, import a tiny UTC ICS fixture, verify AP storage isolation, reset the demo and capture desktop/iPad/mobile screenshots.

## Review / future deployment boundary

Run the PlayRcmd server, never the root AP server, for this demo. Its explicit asset allowlist serves only the SIEM dependency closure and its own branding. `/api/catalog` is an empty compatible projection: no AP directory, athlete database or production data is served. Each browser has an isolated `playrcmd.demo.v1.` namespace in the existing Web Storage system. No new data store is introduced.

This package currently imports shared renderer modules from the same source checkout. A future deployment must pin this entire source revision (or first extract a versioned shared SIEM package); copying only this folder is not a supported deployment. Do not duplicate or fork the engine. Do not copy AP secrets, production stores or athlete data into a demo deployment. Root renderer dependencies read public catalog/design metadata while composing the view; the PlayRcmd API does not expose those records.

Publication, push, merge, DNS and domain binding require separate explicit approval. No deployment has been performed. LXDiN is handled separately and is outside this package.

See [component reuse map](../docs/playrcmd/COMPONENT-REUSE.md), [implementation report](../docs/playrcmd/IMPLEMENTATION.md), and [open issues](../docs/playrcmd/OPEN-ISSUES.md).

Final readiness, exact engine coverage, commands, before/after evidence and historical-suite limitations are in [the executive qualification report](../docs/playrcmd/QUALIFICATION.md).
