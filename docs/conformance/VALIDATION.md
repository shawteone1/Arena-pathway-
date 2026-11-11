# Validation — November 11, 2026

| Check | Result | Evidence |
| --- | --- | --- |
| `npm run check` (syntax, original data, participation, discovery publication, Node tests) | **PASS — 194 passed, 0 failed, 0 skipped** | [Full log](logs/unit-data.txt) |
| `python scripts/qa-pathway.py` | **PASS — 10/10** | [Preserved Pathway interactions](logs/pathway-browser.txt) |
| `npm run test:conformance:browser` | **PASS — 12/12** | [Chromium conformance](logs/chromium-conformance.txt) |
| `WEBKIT_PATH=/workspace/scratch/webkit-local.sh npm run test:conformance:webkit` | **PASS — 12/12** | [Actual WebKit conformance](logs/webkit-conformance.txt) |
| `WEBKIT_PATH=/workspace/scratch/webkit-local.sh python scripts/qa-siem-webkit.py` | **PASS — 5/5** | [WebKit startup, failure recovery, permissions, evidence and iPad regressions](logs/webkit-regressions.txt) |
| `python scripts/qa-siem-family.py` | **PASS — 18/18** | [Rivera family demonstration](logs/rivera-family.txt) |
| `git diff --check` | **PASS** | No whitespace errors |

Conformance includes creating and editing an athlete, all six profile sections, the same local athlete ID in My Family and local scheduling, independent club saving, day/week/month ranges, activity labels, message provenance, all four searchable sport directories, overlapping region selection, privacy, source drilldown, modern/legacy media-query handling, responsive layouts and no horizontal overflow after fonts and navigation settle.

The 12-test conformance suite reuses 6 existing My AP tests and adds 6 focused workflows; these are not 12 additional independent scenarios beyond the existing My AP coverage. Existing Pathway browser tests still cover optional preference ordering, disable/re-enable data retention, family isolation, media preferences, legacy data, calendar export, recruiting notes and storage failures. Their entry paths and UI assertions now reflect the requested profile-first experience.

## Browser runtime

Chromium uses `/usr/bin/chromium`. WebKit uses the official Playwright **WebKit 26.5 / build 2336** downloaded with `python -m playwright install webkit`.

The first WebKit attempt could not launch because system libraries were absent. This environment has no sudo or scoped package installer. Required Debian trixie libraries were downloaded from the official Debian repository with a user-local APT index, extracted under `/workspace/scratch/webkit-runtime`, and loaded through `/workspace/scratch/webkit-local.sh`. No system package, system library or browser binary was modified. The wrapper sets the normal official bundle paths plus the extracted library directory, then launches the actual bundled WPE MiniBrowser. No Safari user-agent emulation was used. The default Playwright launcher's library path replacement and host-cache checks do not find these user-local libraries, so the provided `WEBKIT_PATH` selects the working wrapper.

On a machine with normal Playwright dependencies installed, run `npm run test:conformance:webkit` and `npm run test:siem:webkit` without `WEBKIT_PATH`. The temporary wrapper in this session is:

```sh
#!/bin/sh
WEBKIT_BUNDLE=/home/agent/.cache/ms-playwright/webkit-2336/minibrowser-wpe
export WEBKIT_EXEC_PATH="$WEBKIT_BUNDLE/bin"
export WEBKIT_INJECTED_BUNDLE_PATH="$WEBKIT_BUNDLE/lib"
export WEBKIT_INSPECTOR_RESOURCES_PATH="$WEBKIT_BUNDLE/share"
export LD_LIBRARY_PATH="/workspace/scratch/webkit-runtime/usr/lib/x86_64-linux-gnu:$WEBKIT_BUNDLE/lib:$WEBKIT_BUNDLE/sys/lib"
export WEBKIT_FORCE_COMPLEX_TEXT=1
exec "$WEBKIT_BUNDLE/bin/MiniBrowser" "$@"
```

Initial runs exposed outdated historical UI/branch-byte assumptions, a test waiting on hidden My Day statistics while opening My Family, and an early WebKit overflow assertion during navigation/font loading. Assertions now test the appropriate dependency bytes and settled UI; native directory inputs/selects also have explicit shrink constraints. Final results above have no failures. The source-based follow-up also fixed a real quick-edit hydration race by disabling the basic fields until existing data is initialized. A delayed-script test verifies it in both engines without weakening CSP. Calendar month-end navigation, fixed Denver dates and source-based event labels have additional unit coverage.

Physical Safari, live provider authorization, live acquisition acceptance and exact GoDaddy Airo visual parity were not tested or claimed. Soccer Center source structures were inspected read-only; see [reuse assessment](SOCCER-CENTER-REUSE.md).
