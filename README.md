# YT De-Clutter: Hide Shorts, Playables & Distractions

A powerful Chrome extension that removes YouTube **Shorts**, **Playables**, the **Explore** section, and **video page distractions** across youtube.com. Features an easy **toggle control** to switch between distraction-free and normal YouTube viewing instantly.

## What it removes

- **Shorts** tiles/shelves/sections/items in the feed and search results
- **Shorts** links in the left sidebar and mini-guide
- **Playables** modules and links
- The entire **Explore** sidebar section (Shopping, Music, etc.)
- The **More From YouTube** section which details other YouTube services
- **Video page sidebar** (recommendations, related videos, comments) for distraction-free viewing

## Toggle Control

- **🎛️ Easy Toggle**: Click the extension icon to instantly enable/disable all decluttering
- **Real-time Status**: Visual indicators show current extension state
- **Persistent Settings**: Your preference is saved across browser sessions
- **Smart Guidance**: Helpful tips when toggling between states

## Extra protections

- **Hard block & redirect** if you navigate to `youtube.com/shorts` or `youtube.com/playables`
- **Click interception** to prevent links that try to open Shorts/Playables
- **Page reload option**: "Reload Page" button for complete state reset

## How it works

- **CSS-first** using `:has()` selectors to instantly hide obvious modules
- **Content script** uses a `MutationObserver` to re-apply hiding on SPA route changes and dynamic loads
- **Text-based matching** removes sidebar items that _contain_ the word "Shorts"
- **Conditional styling** applies decluttering only when extension is enabled
- **Chrome storage** persists toggle state across browser sessions
- **Declarative Net Request** redirects network navigations to Shorts/Playables at the request layer

## Files

```
YouTube-Declutter/
├── manifest.json          # Extension configuration and permissions
├── content.js             # Core hiding logic and toggle state management
├── hide.css               # CSS-first element hiding with conditional scoping
├── popup.html             # User interface with toggle control
├── popup.js               # Toggle functionality and page reload logic
├── rules.json             # Declarative net request URL blocking rules
└── icons/
    └── icon.png           # Extension icon
```

## Installation

### Manual Installation (Developer Mode)

1. Download or clone this repository
2. Visit `chrome://extensions`
3. Enable **Developer mode** (top-right toggle)
4. Click **Load unpacked** → select the `YouTube-Declutter` folder
5. Navigate to YouTube and the extension will work automatically

### Usage

1. **Click the extension icon** in your Chrome toolbar
2. **Toggle the switch** to enable/disable decluttering
3. **Green = Active** (YouTube is decluttered)
4. **Red = Disabled** (Normal YouTube with all content visible)
5. **Click "Reload Page"** for immediate state reset when needed

> **Tip**: When disabling the extension, click "Reload Page" to immediately see all YouTube content (comments, recommendations, etc.)

## Permissions

- **`host_permissions`**: `https://www.youtube.com/*`, `https://m.youtube.com/*` - Access to YouTube pages
- **`tabs`, `scripting`**: Messaging between popup and content script, page reload functionality
- **`storage`**: Persist toggle state across browser sessions
- **`declarativeNetRequest`**: Block navigation to Shorts/Playables URLs at network level

## Troubleshooting

- **Extension not working?** Make sure it's enabled in `chrome://extensions` and refresh YouTube
- **Toggle not responding?** Try clicking "Reload Page" in the popup for a clean reset
- **Elements still showing?** YouTube changes markup frequently - toggle off and on again, or reload the page
- **Popup not opening?** Check that the extension icon is visible in your Chrome toolbar
- **Want to see comments/recommendations temporarily?** Just toggle the extension off and reload the page

## Privacy

No analytics, no tracking, no data collection. All logic runs locally in the browser.

## Changelog

### v1.3.0 ✨ **Current Version**

- **🎛️ Toggle Control**: Easy on/off switch with visual status indicators
- **💾 Persistent Settings**: Toggle state saved across browser sessions
- **🔄 Page Reload**: "Reload Page" button for complete state reset
- **📱 Enhanced UI**: Professional popup interface with real-time feedback
- **🎯 Smart Guidance**: Helpful tips when switching between modes
- **⚡ Instant Response**: Toggle changes apply immediately (CSS class system)
- **🛡️ Improved Stability**: Refined selectors to prevent loading issues

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
- Declarative net request rules for network-layer blocking

### v1.0.0

- Initial MV3 release: CSS + MutationObserver to remove Shorts and Playables across feeds, sections, chips, and search results

## License

MIT
