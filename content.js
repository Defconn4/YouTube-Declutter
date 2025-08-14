(() => {
  'use strict';

  const MARK = 'data-ytd-decluttered';
  const BLOCK_PATTERNS = [/\/shorts\b/i, /\/playables\b/i];

  // Extension toggle state
  let isExtensionEnabled = true;

  /** Load extension toggle state from storage */
  async function loadToggleState() {
    try {
      const result = await chrome.storage.sync.get(['ytDeclutterEnabled']);
      isExtensionEnabled = result.ytDeclutterEnabled !== false; // Default to true
      updatePageVisibility();
    } catch (e) {
      console.log('Could not load toggle state:', e);
    }
  }

  /** Show or hide decluttered elements based on toggle state */
  function updatePageVisibility() {
    const body = document.body;
    if (!body) return;

    if (isExtensionEnabled) {
      body.classList.remove('ytd-declutter-disabled');
      body.classList.add('ytd-declutter-enabled');
    } else {
      body.classList.remove('ytd-declutter-enabled');
      body.classList.add('ytd-declutter-disabled');
    }
  }

  /** Hard block if user lands on /shorts or /playables */
  function redirectIfBannedLocation() {
    const href = location.href;
    if (BLOCK_PATTERNS.some((rx) => rx.test(href))) {
      // Redirect ASAP at document_start to avoid flashes
      location.replace('https://www.youtube.com/');
    }
  }

  const SELECTORS_TO_REMOVE = [
    'ytd-reel-shelf-renderer',
    'ytd-rich-shelf-renderer:has(a[href*="/shorts"])',
    'ytd-rich-section-renderer:has(a[href*="/shorts"])',
    'ytd-rich-item-renderer:has(a[href*="/shorts"])',
    'ytd-video-renderer:has(a[href*="/shorts/"])',
    'ytd-compact-video-renderer:has(a[href*="/shorts/"])',
    'ytd-rich-section-renderer:has(a[href^="/playables"])',
    'ytd-rich-shelf-renderer:has(a[href^="/playables"])',
    'ytd-compact-link-renderer:has(a[href^="/playables"])',
    'a[href^="/playables"]',
    // Search results Shorts sections
    'ytd-item-section-renderer:has(ytd-reel-shelf-renderer)',
    'ytd-horizontal-card-list-renderer:has(a[href*="/shorts"])',
    // Sidebar by attribute
    'ytd-guide-entry-renderer:has(a[href*="/shorts"])',
    'ytd-mini-guide-entry-renderer:has(a[href*="/shorts"])',
    'ytd-guide-entry-renderer:has(a[title*="Shorts"])',
    'ytd-mini-guide-entry-renderer:has(a[title*="Shorts"])',
    'ytd-guide-entry-renderer:has(a[aria-label*="Shorts"])',
    'ytd-mini-guide-entry-renderer:has(a[aria-label*="Shorts"])',
    'a[href*="youtube.com/shorts"]',
    'a[href*="/shorts"]',
  ];

  // Video watch page sidebar elements for distraction-free viewing
  // These selectors are scoped to watch pages only in the hideVideoSidebar function
  const VIDEO_SIDEBAR_SELECTORS = [
    'ytd-watch-flexy #secondary',
    'ytd-watch-flexy #related',
    'ytd-watch-flexy #secondary-inner',
    'ytd-watch-flexy ytd-watch-next-secondary-results-renderer',
    'ytd-watch-flexy #chip-bar',
    'ytd-watch-flexy #chips',
    'ytd-watch-flexy yt-chip-cloud-renderer',
    'ytd-watch-flexy #continuity',
    'ytd-watch-flexy #watch-next-continuation',
    'ytd-watch-flexy ytd-compact-autoplay-renderer',
    'ytd-watch-flexy #comments',
    'ytd-watch-flexy ytd-comments',
    'ytd-watch-flexy ytd-comments-header-renderer',
  ];

  function hideMatches(root = document) {
    for (const sel of SELECTORS_TO_REMOVE) {
      root.querySelectorAll(sel).forEach((el) => {
        if (!el.hasAttribute(MARK)) {
          el.setAttribute(MARK, '1');
          el.style.display = 'none';
        }
      });
    }
  }

  /** Hide any sidebar entries whose visible text includes a target word */
  function hideSidebarByText(word, root = document) {
    const rx = new RegExp(`\\b${word}\\b`, 'i');
    const CONTAINERS = [
      'ytd-guide-entry-renderer',
      'ytd-mini-guide-entry-renderer',
      'ytd-compact-link-renderer',
    ].join(', ');
    root.querySelectorAll(CONTAINERS).forEach((node) => {
      if (node.hasAttribute(MARK)) return;
      const txt = (node.textContent || '').trim();
      if (rx.test(txt)) {
        node.setAttribute(MARK, '1');
        node.style.display = 'none';
      }
    });
  }

  /** Remove the 'Explore' section (and its children like Shopping/Music/etc.) */
  function hideExploreSection(root = document) {
    // Section containers
    root
      .querySelectorAll(
        'ytd-guide-section-renderer, ytd-guide-collapsible-section-entry-renderer'
      )
      .forEach((sec) => {
        if (sec.hasAttribute(MARK)) return;
        const header = sec.querySelector(
          '#header, #title, yt-formatted-string'
        );
        const title = (header?.textContent || sec.textContent || '').trim();
        if (
          /^Explore$/i.test(title) ||
          /\bExplore\b/i.test(title.slice(0, 60))
        ) {
          sec.setAttribute(MARK, '1');
          sec.style.display = 'none';
        }
      });
  }

  function hideMoreFromYouTube(root = document) {
    root
      .querySelectorAll(
        'ytd-guide-section-renderer, ytd-guide-collapsible-section-entry-renderer'
      )
      .forEach((sec) => {
        if (sec.hasAttribute(MARK)) return;
        const header = sec.querySelector(
          '#header, #title, yt-formatted-string'
        );
        const title = (header?.textContent || sec.textContent || '').trim();
        if (
          /^More from YouTube$/i.test(title) ||
          /\bMore from YouTube\b/i.test(title.slice(0, 60))
        ) {
          sec.setAttribute(MARK, '1');
          sec.style.display = 'none';
        }
      });
  }

  /** Prevent clicks that try to open Shorts/Playables */
  function blockBannedClicks() {
    document.addEventListener(
      'click',
      (e) => {
        const a = e.target && (e.target.closest ? e.target.closest('a') : null);
        if (!a || !a.href) return;
        const href = a.href;
        if (BLOCK_PATTERNS.some((rx) => rx.test(href))) {
          e.preventDefault();
          e.stopPropagation();
          // Nudge user back to a safe place
          location.href = 'https://www.youtube.com/';
        }
      },
      true
    );
  }

  /** Hide video watch page sidebar for distraction-free viewing */
  function hideVideoSidebar(root = document) {
    // Only hide sidebar on video watch pages
    if (!location.pathname.includes('/watch')) return;

    for (const sel of VIDEO_SIDEBAR_SELECTORS) {
      root.querySelectorAll(sel).forEach((el) => {
        if (!el.hasAttribute(MARK)) {
          el.setAttribute(MARK, '1');
          el.style.display = 'none';
        }
      });
    }
  }

  function clean(root = document) {
    // Only clean if extension is enabled
    if (!isExtensionEnabled) return;

    hideMatches(root);
    hideSidebarByText('Shorts', root);
    hideExploreSection(root);
    hideMoreFromYouTube(root);
    hideVideoSidebar(root);

    // Update page visibility classes
    updatePageVisibility();
  }

  // TODO: Future improvement needed for empty content gaps in search results
  // LESSON LEARNED: ytd-item-section-renderer containers are fundamental to YouTube's
  // search result loading architecture. Any attempts to hide these containers
  // (even conditionally or with delays) cause infinite loading loops and break
  // YouTube's dynamic content mechanism. Alternative approaches needed:
  // 1. Accept visual gaps as trade-off for stability
  // 2. Explore CSS-only solutions that don't interfere with containers
  // 3. Research YouTube's internal APIs for cleaner integration
  // Current status: Stable but may show empty spaces where Shorts were hidden

  // --- Init ASAP ---
  redirectIfBannedLocation();
  blockBannedClicks();

  const init = async () => {
    // Load toggle state first
    await loadToggleState();

    clean(document);

    // Mutation observer for SPA updates
    let pending = false;
    const observer = new MutationObserver((mutations) => {
      if (pending) return;
      pending = true;
      queueMicrotask(() => {
        pending = false;
        const roots = new Set(
          mutations
            .map(
              (m) =>
                m.target &&
                (m.target.nodeType === 1 ? m.target : m.target.parentElement)
            )
            .filter(Boolean)
        );
        (roots.size ? roots : [document]).forEach((r) => clean(r));
      });
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
    window.addEventListener('yt-navigate-finish', () => clean(document));

    // Allow popup to control extension and force refresh
    chrome.runtime?.onMessage?.addListener((msg) => {
      if (msg?.type === 'forceClean') {
        clean(document);
      } else if (msg?.type === 'toggleChanged') {
        isExtensionEnabled = msg.enabled;
        updatePageVisibility();
        // Force a clean to apply/remove changes immediately
        clean(document);
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
