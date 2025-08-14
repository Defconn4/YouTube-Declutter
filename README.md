# YT De-Clutter: Hide Shorts, Playables & Distractions

Simple Chrome extension that removes YouTube **Shorts**, **Playables**, the **Explore** section, and **video page distractions** across youtube.com for a cleaner, more focused viewing experience.

## What it removes

- **Shorts** tiles/shelves/sections/items in the feed and search results
- **Shorts** links in the left sidebar and mini-guide
- **Playables** modules and links
- The entire **Explore** sidebar section (Shopping, Music, etc.)
- The **More From YouTube** section which details other YouTube services
- **Video page sidebar** (recommendations, related videos, comments) for distraction-free viewing

## Extra protections

- **Hard block & redirect** if you navigate to `youtube.com/shorts` or `youtube.com/playables`
- **Click interception** to prevent links that try to open Shorts/Playables
- **Popup action**: clicking the toolbar icon forces a fresh “clean” on the current YouTube tab

## How it works

- **CSS-first** using `:has()` selectors to instantly hide obvious modules
- **Content script** uses a `MutationObserver` to re-apply hiding on SPA route changes and dynamic loads
- **Text-based matching** removes sidebar items that _contain_ the word “Shorts”
- **Optional ruleset** (Declarative Net Request) redirects network navigations to Shorts/Playables at the request layer

## Files

yt-declutter/
manifest.json
content.js # SPA-aware cleaner + redirects + click blocking
hide.css # Fast, CSS-first removal (:has() selectors)
popup.html # Minimal popup (no controls)
popup.js # Sends 'forceClean' to active YouTube tab
rules_1.json # (optional) DNR redirect for /shorts & /playables
icons/
icon16.png
icon32.png
icon48.png
icon128.png

## Install (dev)

1. Visit `chrome://extensions`.
2. Enable **Developer mode** (top-right).
3. **Load unpacked** → select the `yt-declutter` folder.
4. Open YouTube and refresh.

> Tip: After updating files, toggle the extension off/on in `chrome://extensions` to reload.

## Permissions

- `host_permissions`: `https://www.youtube.com/*`, `https://m.youtube.com/*`
- `tabs`, `scripting`: needed for messaging and content script behavior
- _(Optional)_ `declarativeNetRequest`, `declarativeNetRequestWithHostAccess` if you include `rules_1.json`

## Troubleshooting

- **Icon not showing?** Ensure `icons/icon16|32|48|128|512.png` exist and are referenced in both `"icons"` and `"action.default_icon"` in `manifest.json`.
- **Something slips through?** YouTube changes markup often. Add a new selector to `hide.css` or extend `SELECTORS_TO_REMOVE` in `content.js`.
- **Popup seems empty?** That’s by design—opening it sends a one-shot `forceClean` message to the active YouTube tab.

## Privacy

No analytics, no tracking, no data collection. All logic runs locally in the browser.

## Changelog

### v1.2.0

- Hide **video page sidebar** (recommendations, related videos, filter chips, comments) for distraction-free viewing
- Enhanced focus mode when watching individual videos

### v1.1.0

- Hide **Explore** section (and its children) in the sidebar
- Hide any sidebar item whose text includes **"Shorts"**
- Block direct navigation to `/shorts` and `/playables` with instant redirect
- Intercept clicks that try to open Shorts/Playables
- Add **popup** that triggers a force clean on the active YouTube tab
- Proper **icons** wired up for extension entry and toolbar
- _(Optional)_ Add `rules_1.json` for request-layer redirects via DNR

### v1.0.0

- Initial MV3 release: CSS + MutationObserver to remove Shorts and Playables across feeds, sections, chips, and search results

## License

MIT
