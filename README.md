# Stale Tab Closer

An Edge/Chrome extension (Manifest V3) that closes tabs you haven't looked at for a while, and duplicate tabs.

- Choose how long a tab must be unviewed (default 3 days).
- Optionally close duplicate tabs (keeps one per page).
- Review the list and untick any tab before closing.
- Pinned tabs and tabs playing audio are kept by default; the active tab is never closed.
- The toolbar badge shows system memory use: green, yellow at 80%, red at 90% (thresholds in `background.js`).

## Install

1. Open `edge://extensions` (or `chrome://extensions`) and enable Developer mode.
2. Click **Load unpacked** and select this folder.
