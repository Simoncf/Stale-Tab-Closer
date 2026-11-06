# Stale Tab Closer

An Edge/Chrome extension (Manifest V3) that closes tabs you haven't looked at for a while, and duplicate tabs.

- Choose how long a tab must be unviewed (default 3 days).
- Optionally close duplicate tabs (keeps one per page).
- Review the list and untick any tab before closing.
- Pinned tabs and tabs playing audio are kept by default; the active tab is never closed.
- On Edge/Chrome the toolbar badge shows system memory use: green, yellow at 80%, red at 90% (thresholds in `background.js`). Firefox has no API for this, so the badge is not shown there.

## Install

**Edge / Chrome:** open `edge://extensions` (or `chrome://extensions`), enable Developer mode, click **Load unpacked** and select this folder.

**Firefox (121+):** open `about:debugging#/runtime/this-firefox`, click **Load Temporary Add-on** and select `manifest.json`. It stays until Firefox restarts. For a permanent install the extension must be signed via addons.mozilla.org.
