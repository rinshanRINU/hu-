/**
 * ==============================================================================
 * Happy User (HU) - Brand Website Main Engine
 * High Performance & Responsive Desert-Tech Architecture
 *
 * Modules:
 * 1. Accessibility & Motion Preferences
 * 2. Data Store (Categories, Channels, Retailers, Videos, Markets)
 * 3. DOM Population & Interactive Grid Markup
 * 4. Native 0ms Scroll Engine & Smooth Anchor Click Routing
 * 5. Lottie Background Animation (Canvas renderer, DPR <= 1.5, frame diff >= 0.5)
 * 6. Floating Parallax Shapes (8 shapes, translate3d only, 0.08 - 0.35 speed)
 * 7. Smooth Multi-Stop Background Canvas Color Shift
 * 8. Dynamic Background Luminance & Tone Adaptation (Hysteresis 0.42 / 0.48)
 * 9. Top Scroll-Progress Bar & Shifting Circuit Grid
 * 10. IntersectionObserver Scroll Reveals (CSS Transitions, Zero Layout Thrashing)
 * 11. Animated Stat Counters (Triggered once on viewport entry)
 * 12. Local HTML5 Video Lightbox (Local MP4s, Metadata Duration, 2s Frame Fallback)
 * 13. Channel Modal Dialog
 * 14. Smooth 3D Pointer Tilt Interaction in rAF (Lerp 0.12, Max 4deg, No CSS conflict)
 * 15. Nav Scroll Tracking & Active Section Highlighting
 * 16. Single Master RAF Loop (No Double Smoothing, Tab-Visibility Aware)
 * ==============================================================================
 */

(function () {
  'use strict';

  // --- Accessibility Check: Respect prefers-reduced-motion ---
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- DOM References ---
  const $ = selector => document.querySelector(selector);
  const $$ = selector => Array.from(document.querySelectorAll(selector));

  const progressBar = $('#scroll-progress-bar');
  const bgCanvas = $('#bg-canvas-layer');
  const lottieContainer = $('#lottie-bg');
  const circuitGrid = $('#circuit-grid-pattern');
  const shapesContainer = $('#floating-shapes-container');
  const modalOverlay = $('#app-modal');
  const modalBoxContent = $('#modal-content-container');
  const modalCloseBtn = $('#modal-close-btn');
  const mobileToggle = $('#mobile-toggle');
  const navLinksMenu = $('#nav-links-menu');
  const navElement = $('#main-nav');

  // Video Lightbox DOM References
  const videoLightbox = $('#video-lightbox');
  const lightboxVideo = $('#lightbox-video-player');
  const videoCloseBtn = $('#video-lightbox-close-btn');
  const videoPrevBtn = $('#video-lightbox-prev-btn');
  const videoNextBtn = $('#video-lightbox-next-btn');
  const videoMissingBox = $('#video-missing-box');
  const videoMissingInstruction = $('#video-missing-instruction');
  const videoLightboxTitle = $('#video-lightbox-title');
  const videoLightboxDesc = $('#video-lightbox-desc');

  // ============================================================================
  // 1. DATA DEFINITIONS
  // ============================================================================

  const CATEGORIES = [
    { id: 'smart', name: 'HU Smart', desc: 'Smart gadgets & wearables', icon: '⌚', img: 'assets/cat-smart.jpg' },
    { id: 'home', name: 'HU Home', desc: 'Home essentials & living', icon: '🏠', img: 'assets/cat-home.jpg' },
    { id: 'access', name: 'HU Access', desc: 'Mobile and everyday accessories', icon: '🎧', img: 'assets/cat-access.jpg' },
    { id: 'power', name: 'HU Power', desc: 'High-speed power and charging', icon: '🔋', img: 'assets/cat-power.jpg' },
    { id: 'style', name: 'HU Style', desc: 'Style and personal grooming', icon: '💇', img: 'assets/cat-style.jpg' },
    { id: 'tour', name: 'HU Tour', desc: 'Travel and outdoor equipment', icon: '⛺', img: 'assets/cat-tour.jpg' },
    { id: 'drive', name: 'HU Drive', desc: 'Smart in-car accessories', icon: '🚗', img: 'assets/cat-drive.jpg' },
    { id: 'kitchen', name: 'HU Kitchen', desc: 'Kitchen and dining essentials', icon: '🍳', img: 'assets/cat-kitchen.jpg' },
    { id: 'volt', name: 'HU Volt', desc: 'Performance electronics', icon: '⚡', img: 'assets/cat-volt.jpg' },
    { id: 'baby', name: 'HU Baby', desc: 'Comfort and baby care products', icon: '🍼', img: 'assets/cat-baby.jpg' }
  ];

  const CHANNELS = [
    { code: 'RD', title: 'Regional Distribution', desc: 'B2B distribution through authorized regional partner networks across GCC and Africa.' },
    { code: 'ET', title: 'Export Trade', desc: 'Direct container export taking HU quality-controlled products to international high-growth markets.' },
    { code: 'GT', title: 'General Trade', desc: 'High-density retail shop penetration across regional traditional markets and phone outlets.' },
    { code: 'MT', title: 'Modern Trade', desc: 'Tier-1 hypermarket and organized mall supermarket shelf presence, including Nesto Hypermarkets.' },
    { code: 'OT', title: 'Online Trade', desc: 'Direct-to-consumer e-commerce sales and digital marketing via our flagship portal myhustore.com.' },
    { code: 'ST', title: 'Special Trade', desc: 'Targeted institutional sectors and specialized pharmaceutical / health gadget channels.' }
  ];

  const NESTO_BRANCHES = [
    'AJD', 'BNM', 'Butina', 'Mia Mall', 'Muwailah', 'Fujairah',
    'Al Nadha DXB', 'Al Thalla', 'Madina Mall', 'RAK Mall', 'JVC',
    'Nad Al Hamar', 'Al Ain', 'Al Warsan', 'Hor Al Anz', 'UAQ'
  ];

  const RETAILERS = [
    { name: 'Ainas Al Madina & Mubarak, Ajman', img: 'assets/retailer-ainas.png' },
    { name: 'Kenz Hyper Market, Ajman', img: 'assets/retailer-kenz.png' },
    { name: 'CM Hyper Market', img: 'assets/retailer-cm.png' },
    { name: 'Hashim Hyper Market', img: 'assets/retailer-hashim.png' },
    { name: 'Ajman Coop (4 branches)', img: 'assets/retailer-ajmancoop.png' }
  ];

  const OTHER_RETAILERS_LIST = ['Rahaf & Ali Trading, Ajman'];

  // Single data-driven video array: adding a video is as simple as adding an entry here
  const VIDEOS = [
    {
      title: 'Warehouse Tour',
      desc: 'Inside the HU logistics warehouse in the UAE, managing nationwide fulfillment and stock.',
      video: 'assets/videos/warehouse-tour.mp4',
      poster: 'assets/posters/warehouse-tour.jpg',
      defaultDuration: '2:15'
    },
    {
      title: 'A Vision for Better Living',
      desc: 'Driven by the belief that technology should make everyday life better, HU brings together innovation and purpose to create meaningful experiences',
      video: 'assets/videos/meet-the-team.mp4',
      poster: 'assets/posters/meet-the-team.jpg',
      defaultDuration: '1:48'
    },
    {
      title: 'Shaping What’s Next',
      desc: 'Driven by innovation and a forward-looking vision, HU is shaping what comes next in everyday electronics, exploring new possibilities and creating solutions for tomorrow.',
      video: 'assets/videos/quality-testing.mp4',
      poster: 'assets/posters/quality-testing.jpg',
      defaultDuration: '2:04'
    },
    {
      title: 'Retail & Distribution',
      desc: 'Inside our high-density retail presence across leading hypermarkets and distribution networks in the UAE.',
      video: 'assets/videos/retail-showcase.mp4',
      poster: 'assets/posters/retail-showcase.jpg',
      defaultDuration: '1:35'
    }
  ];

  function getVideoSrc(vid) {
    const v = vid.video || vid.file || '';
    return v.startsWith('assets/') ? v : `assets/videos/${v}`;
  }

  function getVideoPoster(vid) {
    const p = vid.poster || vid.thumbnail || '';
    return p.startsWith('assets/') ? p : `assets/posters/${p}`;
  }

  function getVideoFilename(vid) {
    const v = vid.video || vid.file || '';
    return v.split('/').pop() || v;
  }
 
  const GCC_MARKETS = {
    high: ['Saudi Arabia', 'UAE (Home Market)', 'Kuwait'],
    medium: ['Oman', 'Bahrain']
  };

  const AFRICA_MARKETS = ['Nigeria', 'Kenya', 'Tanzania', 'Egypt', 'South Africa'];

  // ============================================================================
  // 2. DOM POPULATION & RENDERING
  // ============================================================================

  function populateContent() {
    // A. Product Categories Grid: Each card links to https://myhustore.com/ in a new tab with "View More"
    const catContainer = $('#category-grid-container');
    if (catContainer) {
      catContainer.innerHTML = CATEGORIES.map((cat, index) => `
        <a href="https://myhustore.com/collections/hu-${cat.id}" target="_blank" rel="noopener noreferrer" class="category-card scroll-reveal" data-stagger="${index}" aria-label="Explore ${cat.name} on myhustore.com">
          <div class="category-img-wrap">
            <img src="${cat.img}" alt="${cat.name}" class="category-img" width="220" height="220" loading="lazy" decoding="async">
            <span class="category-icon-chip" aria-hidden="true">${cat.icon}</span>
          </div>
          <h3 class="category-name">${cat.name}</h3>
          <p class="category-desc">${cat.desc}</p>
          <div class="category-link-hint">
            <span>View More</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>
        </a>
      `).join('');
    }

    // B. Sales Channels Grid
    const chContainer = $('#channel-grid-container');
    if (chContainer) {
      chContainer.innerHTML = CHANNELS.map((ch, index) => `
        <article class="channel-card scroll-reveal" data-stagger="${index}" data-ch-index="${index}" tabindex="0" role="button" aria-label="Learn about ${ch.title}">
          <div>
            <span class="channel-badge">${ch.code}</span>
            <h3 class="channel-title">${ch.title}</h3>
            <p class="channel-desc">${ch.desc}</p>
          </div>
        </article>
      `).join('');
    }

    // C. Nesto Branches Chips
    const nestoContainer = $('#nesto-chips-container');
    if (nestoContainer) {
      nestoContainer.innerHTML = NESTO_BRANCHES.map((branch, index) => `
        <span class="chip-tag scroll-reveal" data-stagger="${index % 8}">${branch}</span>
      `).join('');
    }

    // D. Retailer Logos Grid
    const retContainer = $('#retailers-grid-container');
    if (retContainer) {
      retContainer.innerHTML = RETAILERS.map((ret, index) => `
        <div class="retailer-card scroll-reveal" data-stagger="${index}">
          <div class="retailer-img-wrap">
            <img src="${ret.img}" alt="${ret.name}" width="130" height="72" loading="lazy" decoding="async">
          </div>
          <span class="retailer-name">${ret.name}</span>
        </div>
      `).join('');
    }

    // Other Retailers Chips
    const othContainer = $('#other-retailers-chips');
    if (othContainer) {
      othContainer.innerHTML = OTHER_RETAILERS_LIST.map((name, index) => `
        <span class="chip-tag scroll-reveal" data-stagger="${index}">${name}</span>
      `).join('');
    }

    // E. Local HTML5 Videos Grid with 16:9 thumbnails & duration badges
    const vidContainer = $('#video-grid-container');
    if (vidContainer) {
      vidContainer.innerHTML = VIDEOS.map((vid, index) => `
        <div class="video-card scroll-reveal" data-stagger="${index}" data-vid-index="${index}" tabindex="0" role="button" aria-label="Watch ${vid.title}">
          <div class="video-preview-window">
            <img src="${getVideoPoster(vid)}" alt="${vid.title} Preview" class="video-thumbnail-img" id="vid-thumb-${index}" loading="lazy" decoding="async">
            <div class="video-gradient-overlay" aria-hidden="true"></div>
            <div class="video-play-btn" aria-hidden="true"></div>
            <span class="video-duration-badge" id="vid-dur-${index}">${vid.defaultDuration}</span>
          </div>
          <div class="video-card-body">
            <h3 class="video-card-title">${vid.title}</h3>
            <p class="video-card-desc">${vid.desc}</p>
          </div>
        </div>
      `).join('');

      initVideoMetadataLoaders();
    }

    // F. GCC & Africa Expansion Chips
    const gccContainer = $('#gcc-chips-container');
    if (gccContainer) {
      const highChips = GCC_MARKETS.high.map((m, i) => `<span class="chip-tag chip-high scroll-reveal" data-stagger="${i}">${m}</span>`).join('');
      const medChips = GCC_MARKETS.medium.map((m, i) => `<span class="chip-tag chip-medium scroll-reveal" data-stagger="${i + 3}">${m}</span>`).join('');
      gccContainer.innerHTML = highChips + medChips;
    }

    const afrContainer = $('#africa-chips-container');
    if (afrContainer) {
      afrContainer.innerHTML = AFRICA_MARKETS.map((m, i) => `
        <span class="chip-tag chip-high scroll-reveal" data-stagger="${i}">${m}</span>
      `).join('');
    }
  }

  // ============================================================================
  // 3. VIDEO METADATA & BROWSER CANVAS FALLBACK
  // ============================================================================

  function initVideoMetadataLoaders() {
    VIDEOS.forEach((vid, index) => {
      const thumbEl = $(`#vid-thumb-${index}`);
      const badgeEl = $(`#vid-dur-${index}`);
      const videoSrc = getVideoSrc(vid);

      // 1. Try loading video metadata for exact duration
      const tempVideo = document.createElement('video');
      tempVideo.preload = 'metadata';
      tempVideo.src = videoSrc;

      tempVideo.addEventListener('loadedmetadata', () => {
        if (tempVideo.duration && !isNaN(tempVideo.duration)) {
          const totalSec = Math.round(tempVideo.duration);
          const mins = Math.floor(totalSec / 60);
          const secs = String(totalSec % 60).padStart(2, '0');
          if (badgeEl) {
            badgeEl.textContent = `${mins}:${secs}`;
          }
        }
      }, { once: true, passive: true });

      // 2. If poster image is missing or fails, extract frame at 2s via HTML5 Canvas
      if (thumbEl) {
        thumbEl.addEventListener('error', () => {
          extractVideoPosterFrame(videoSrc, 2, frameDataUrl => {
            if (frameDataUrl && thumbEl) {
              thumbEl.src = frameDataUrl;
            }
          });
        }, { once: true });
      }
    });
  }

  function extractVideoPosterFrame(videoSrc, seekTimeSec, callback) {
    try {
      const v = document.createElement('video');
      v.preload = 'auto';
      v.muted = true;
      v.playsInline = true;
      v.src = videoSrc;

      v.addEventListener('loadeddata', () => {
        v.currentTime = seekTimeSec;
      }, { once: true });

      v.addEventListener('seeked', () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = v.videoWidth || 640;
          canvas.height = v.videoHeight || 360;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          callback(dataUrl);
        } catch (_) {
          // Canvas cross-origin or local security limit
        }
      }, { once: true });

      v.addEventListener('error', () => {
        // Video file missing; fallback poster remains
      }, { once: true });
    } catch (_) {}
  }

  // ============================================================================
  // 4. NATIVE SCROLL ENGINE & SMOOTH ANCHOR CLICK ROUTING
  // Native 0ms instant scroll; smooth scrolling only on click
  // ============================================================================

  function initAnchorNavigation() {
    const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'), 10) || 76;

    // Intercept in-page hash links and hero buttons to smoothly scroll on click only
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId && targetId !== '#') {
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            e.preventDefault();
            window.scrollTo({
              top: targetEl.offsetTop - navHeight,
              behavior: 'smooth'
            });
            try {
              history.pushState(null, '', targetId);
            } catch (_) {}
          }
        }
      });
    });
  }

  // ============================================================================
  // 5. LOTTIE BACKGROUND ANIMATION (CANVAS RENDERER, DPR <= 1.5)
  // ============================================================================

  let lottieAnimation = null;
  let lottieTotalFrames = 180;
  let lastLottieFrame = -1;
  let easedLottieFrame = 0;

  function initLottieBackground() {
    if (prefersReducedMotion || typeof bodymovin === 'undefined' || !lottieContainer) {
      return;
    }

    const loadOptions = {
      container: lottieContainer,
      renderer: 'canvas',
      loop: false,
      autoplay: false,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
        clearCanvas: true
      }
    };

    if (window.HU_LOTTIE_DATA) {
      loadOptions.animationData = window.HU_LOTTIE_DATA;
      setupLottieInstance(loadOptions);
    } else {
      fetch('assets/hu-background.json')
        .then(res => res.json())
        .then(data => {
          loadOptions.animationData = data;
          setupLottieInstance(loadOptions);
        })
        .catch(err => {
          console.warn('Lottie fetch fallback: using path reference', err);
          loadOptions.path = 'assets/hu-background.json';
          setupLottieInstance(loadOptions);
        });
    }
  }

  function setupLottieInstance(options) {
    try {
      lottieAnimation = bodymovin.loadAnimation(options);
      lottieAnimation.addEventListener('DOMLoaded', () => {
        lottieTotalFrames = lottieAnimation.totalFrames || 180;
        lottieAnimation.goToAndStop(0, true);
        lastLottieFrame = 0;
        easedLottieFrame = 0;
      });
    } catch (e) {
      console.warn('Could not initialize Lottie animation:', e);
    }
  }

  function updateLottieProgress(scrollProgress) {
    if (!lottieAnimation || prefersReducedMotion) return;
    const targetFrame = scrollProgress * (lottieTotalFrames - 1);
    easedLottieFrame += (targetFrame - easedLottieFrame) * 0.2;
    // Only call goToAndStop when frame changed
    if (Math.abs(easedLottieFrame - lastLottieFrame) >= 0.25) {
      lottieAnimation.goToAndStop(easedLottieFrame, true);
      lastLottieFrame = easedLottieFrame;
    }
  }

  // ============================================================================
  // 6. FLOATING PARALLAX LIME & MINT SHAPES (Limited to 8 Elements)
  // ============================================================================

  const floatingShapesData = [];

  function initFloatingShapes() {
    if (!shapesContainer) return;

    shapesContainer.innerHTML = '';
    floatingShapesData.length = 0;

    const types = ['shape-circle', 'shape-round-sq', 'shape-plus', 'shape-circle'];
    const colors = [
      'rgba(140, 199, 79, 0.22)',   // Vibrant Lime
      'rgba(207, 232, 181, 0.28)',  // Mint
      'rgba(0, 50, 35, 0.08)',      // Subtle Green
      'rgba(140, 199, 79, 0.16)'    // Soft Lime
    ];

    // Capped to 8 carefully positioned floating shapes
    const config = [
      { x: 8,  y: 12, size: 70,  type: 0, color: 0, speed: 0.12, rotSpeed: 0.08 },
      { x: 88, y: 18, size: 105, type: 1, color: 1, speed: 0.22, rotSpeed: -0.06 },
      { x: 78, y: 38, size: 55,  type: 2, color: 0, speed: 0.18, rotSpeed: 0.14 },
      { x: 14, y: 48, size: 85,  type: 1, color: 2, speed: 0.26, rotSpeed: -0.08 },
      { x: 92, y: 64, size: 65,  type: 0, color: 1, speed: 0.32, rotSpeed: 0.11 },
      { x: 6,  y: 75, size: 80,  type: 2, color: 0, speed: 0.15, rotSpeed: -0.12 },
      { x: 82, y: 86, size: 110, type: 0, color: 3, speed: 0.20, rotSpeed: 0.07 },
      { x: 22, y: 89, size: 60,  type: 1, color: 1, speed: 0.35, rotSpeed: -0.15 }
    ];

    config.forEach(cfg => {
      const el = document.createElement('div');
      el.className = `float-shape ${types[cfg.type]}`;
      el.style.width = `${cfg.size}px`;
      el.style.height = `${cfg.size}px`;
      el.style.left = `${cfg.x}vw`;
      el.style.top = `${cfg.y}vh`;
      el.style.backgroundColor = colors[cfg.color];

      shapesContainer.appendChild(el);

      floatingShapesData.push({
        element: el,
        speed: cfg.speed,
        rotSpeed: cfg.rotSpeed,
        currentY: 0
      });
    });
  }

  function updateFloatingShapes(scrollY) {
    if (prefersReducedMotion) return;

    for (let i = 0; i < floatingShapesData.length; i++) {
      const shape = floatingShapesData[i];
      const targetY = -scrollY * shape.speed;
      shape.currentY = (shape.currentY !== undefined)
        ? shape.currentY + (targetY - shape.currentY) * 0.2
        : targetY;
      const rotateDeg = (scrollY * shape.rotSpeed) % 360;
      shape.element.style.transform = `translate3d(0, ${shape.currentY.toFixed(1)}px, 0) rotate(${rotateDeg.toFixed(1)}deg)`;
    }
  }

  // ============================================================================
  // 7. SMOOTH MULTI-STOP BACKGROUND COLOR SHIFT
  // ============================================================================

  const COLOR_STOPS = [
    { progress: 0.00, r: 246, g: 243, b: 236 }, // Cream
    { progress: 0.28, r: 232, g: 243, b: 222 }, // Light Mint
    { progress: 0.65, r: 201, g: 228, b: 204 }, // Soft Green
    { progress: 1.00, r: 0,   g: 50,  b: 35  }  // Deep Green (Footer)
  ];

  function getBgColorAtProgress(p) {
    const clamped = Math.min(Math.max(p, 0), 1);
    let startStop = COLOR_STOPS[0];
    let endStop = COLOR_STOPS[COLOR_STOPS.length - 1];

    for (let i = 0; i < COLOR_STOPS.length - 1; i++) {
      if (clamped >= COLOR_STOPS[i].progress && clamped <= COLOR_STOPS[i + 1].progress) {
        startStop = COLOR_STOPS[i];
        endStop = COLOR_STOPS[i + 1];
        break;
      }
    }

    const range = endStop.progress - startStop.progress;
    const localRatio = range > 0 ? (clamped - startStop.progress) / range : 0;
    const r = Math.round(startStop.r + (endStop.r - startStop.r) * localRatio);
    const g = Math.round(startStop.g + (endStop.g - startStop.g) * localRatio);
    const b = Math.round(startStop.b + (endStop.b - startStop.b) * localRatio);
    return { r, g, b };
  }

  let easedColorProgress = 0;

  function updateBackgroundColor(scrollProgress) {
    if (!bgCanvas) return;
    easedColorProgress += (scrollProgress - easedColorProgress) * 0.2;
    const col = getBgColorAtProgress(easedColorProgress);
    bgCanvas.style.backgroundColor = `rgb(${col.r}, ${col.g}, ${col.b})`;
  }

  // ============================================================================
  // 8. ADAPTIVE CONTRAST WITH HYSTERESIS (0.42 / 0.48)
  // Toggles data-tone attribute, CSS 0.6s transition performs smooth blend
  // ============================================================================

  let cachedSectionPositions = [];

  function cacheSectionMetrics() {
    cachedSectionPositions = $$('.section-block, .site-footer, .hero-section').map(sec => ({
      el: sec,
      top: sec.offsetTop,
      height: sec.offsetHeight
    }));
  }

  function getLuminance(r, g, b) {
    return 0.2126 * (r / 255) + 0.7152 * (g / 255) + 0.0722 * (b / 255);
  }

  function updateSectionContrastHysteresis(docHeight) {
    for (let i = 0; i < cachedSectionPositions.length; i++) {
      const secItem = cachedSectionPositions[i];
      let lum = 1.0;

      if (secItem.el.id === 'hero' || secItem.el.classList.contains('site-footer') || secItem.el.id === 'contact') {
        lum = 0.03;
      } else {
        const secProgress = Math.min(Math.max(secItem.top / docHeight, 0), 1);
        const col = getBgColorAtProgress(secProgress);
        lum = getLuminance(col.r, col.g, col.b);
      }

      const currentTone = secItem.el.dataset.tone || 'light';
      // Hysteresis band: switch to dark below 0.42, switch to light above 0.48
      if (currentTone === 'light' && lum < 0.42) {
        secItem.el.dataset.tone = 'dark';
      } else if (currentTone === 'dark' && lum > 0.48) {
        secItem.el.dataset.tone = 'light';
      }
    }
  }

  // ============================================================================
  // 9. SCROLL PROGRESS BAR & CIRCUIT GRID
  // ============================================================================

  function updateScrollIndicator(scrollProgress, scrollY) {
    if (progressBar) {
      progressBar.style.width = `${(scrollProgress * 100).toFixed(2)}%`;
    }
    if (circuitGrid && !prefersReducedMotion) {
      circuitGrid.style.backgroundPosition = `0px ${(scrollY * 0.16).toFixed(1)}px`;
    }
  }

  // ============================================================================
  // 10. INTERSECTION OBSERVER SCROLL REVEALS (0.9s CSS Transition)
  // Unobserves once revealed - completely avoids per-frame getBoundingClientRect()
  // ============================================================================

  let revealObserver = null;

  function initScrollReveals() {
    if (prefersReducedMotion) {
      $$('.scroll-reveal').forEach(el => el.classList.add('is-revealed'));
      return;
    }

    if ('IntersectionObserver' in window) {
      revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      }, {
        root: null,
        rootMargin: '0px 0px -6% 0px',
        threshold: 0.05
      });

      $$('.scroll-reveal').forEach(el => revealObserver.observe(el));
    } else {
      // Fallback
      $$('.scroll-reveal').forEach(el => el.classList.add('is-revealed'));
    }
  }

  // ============================================================================
  // 11. STAT COUNTERS (IntersectionObserver Driven)
  // ============================================================================

  function initStatCountersObserver() {
    const counters = $$('.stat-counter');
    if (counters.length === 0) return;

    if ('IntersectionObserver' in window) {
      const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.dataset.target, 10) || 0;
            const suffix = el.dataset.suffix || '';
            animateNumberCount(el, target, suffix);
            observer.unobserve(el);
          }
        });
      }, {
        root: null,
        threshold: 0.3
      });

      counters.forEach(c => counterObserver.observe(c));
    } else {
      counters.forEach(el => {
        el.textContent = (el.dataset.target || '0') + (el.dataset.suffix || '');
      });
    }
  }

  function animateNumberCount(el, target, suffix) {
    const duration = 1200;
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeVal = 1 - Math.pow(1 - progress, 3);
      const currentNumber = Math.round(target * easeVal);

      el.textContent = currentNumber + (progress === 1 ? suffix : '');

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  // ============================================================================
  // 12. LOCAL HTML5 VIDEO LIGHTBOX PLAYER
  // ============================================================================

  let currentVideoIndex = 0;

  function openVideoLightbox(videoRef) {
    if (!videoLightbox || !lightboxVideo) return;

    let index = 0;
    let vid = null;
    if (typeof videoRef === 'number') {
      index = videoRef;
      vid = VIDEOS[index];
    } else if (videoRef && typeof videoRef === 'object') {
      index = VIDEOS.indexOf(videoRef);
      if (index === -1) index = 0;
      vid = videoRef;
    } else {
      vid = VIDEOS[0];
    }

    if (!vid) return;
    currentVideoIndex = index;

    // Reset current playback before switching
    lightboxVideo.pause();
    lightboxVideo.currentTime = 0;

    videoLightboxTitle.textContent = vid.title;
    videoLightboxDesc.textContent = vid.desc;

    videoMissingBox.style.display = 'none';
    lightboxVideo.style.display = 'block';

    const videoSrc = getVideoSrc(vid);
    const posterSrc = getVideoPoster(vid);

    lightboxVideo.src = videoSrc;
    if (posterSrc) {
      lightboxVideo.poster = posterSrc;
    }

    lightboxVideo.onerror = function () {
      lightboxVideo.style.display = 'none';
      videoMissingBox.style.display = 'flex';
      videoMissingInstruction.textContent = `Add ${getVideoFilename(vid)} to /assets/videos/`;
    };

    videoLightbox.classList.add('active');
    videoLightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    const playPromise = lightboxVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }
  }

  function navigateVideoLightbox(direction) {
    if (!videoLightbox || !videoLightbox.classList.contains('active')) return;
    const total = VIDEOS.length;
    if (total <= 1) return;
    const nextIndex = (currentVideoIndex + direction + total) % total;
    openVideoLightbox(nextIndex);
  }

  function closeVideoLightbox() {
    if (!videoLightbox || !lightboxVideo) return;

    lightboxVideo.pause();
    lightboxVideo.currentTime = 0;
    lightboxVideo.removeAttribute('src');
    lightboxVideo.load();

    videoLightbox.classList.remove('active');
    videoLightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (videoCloseBtn) {
    videoCloseBtn.addEventListener('click', closeVideoLightbox);
  }

  if (videoPrevBtn) {
    videoPrevBtn.addEventListener('click', () => navigateVideoLightbox(-1));
  }

  if (videoNextBtn) {
    videoNextBtn.addEventListener('click', () => navigateVideoLightbox(1));
  }

  if (videoLightbox) {
    videoLightbox.addEventListener('click', e => {
      if (e.target === videoLightbox) closeVideoLightbox();
    });
  }

  // ============================================================================
  // 13. CHANNEL INTERACTIVE MODAL DIALOG
  // ============================================================================

  function openModal(htmlContent) {
    if (!modalOverlay || !modalBoxContent) return;
    modalBoxContent.innerHTML = htmlContent;
    modalOverlay.classList.add('active');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modalOverlay || !modalBoxContent) return;
    modalOverlay.classList.remove('active');
    modalOverlay.setAttribute('aria-hidden', 'true');
    modalBoxContent.innerHTML = '';
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', e => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  document.addEventListener('keydown', e => {
    if (videoLightbox && videoLightbox.classList.contains('active')) {
      if (e.key === 'Escape') {
        closeVideoLightbox();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigateVideoLightbox(-1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigateVideoLightbox(1);
      }
      return;
    }

    if (e.key === 'Escape') {
      if (modalOverlay && modalOverlay.classList.contains('active')) {
        closeModal();
      }
    }
  });

  document.addEventListener('click', e => {
    const chCard = e.target.closest('[data-ch-index]');
    if (chCard) {
      const idx = parseInt(chCard.dataset.chIndex, 10);
      const ch = CHANNELS[idx];
      if (ch) {
        openModal(`
          <span style="background:var(--primary-green);color:var(--secondary-lime);font-weight:800;padding:6px 14px;border-radius:8px;display:inline-block;margin-bottom:14px">${ch.code} Channel</span>
          <h3>${ch.title}</h3>
          <p style="text-align:left;margin-top:10px">${ch.desc}</p>
          <div style="background:var(--cream-accent);padding:18px;border-radius:var(--radius-md);margin-top:16px;text-align:left">
            <strong style="color:var(--primary-green);display:block;margin-bottom:6px">Fulfillment Guarantee</strong>
            <small style="color:var(--text-muted)">Warehoused locally in Dubai with full GCC transit compliance, barcode registration, and manufacturer backing.</small>
          </div>
        `);
      }
      return;
    }

    const vidCard = e.target.closest('[data-vid-index]');
    if (vidCard) {
      const idx = parseInt(vidCard.dataset.vidIndex, 10);
      if (!isNaN(idx) && VIDEOS[idx]) {
        openVideoLightbox(idx);
      }
      return;
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      const card = e.target.closest('[data-ch-index], [data-vid-index]');
      if (card) {
        e.preventDefault();
        card.click();
      }
    }
  });

  if (mobileToggle && navLinksMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navLinksMenu.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinksMenu.addEventListener('click', e => {
      if (e.target.tagName === 'A') {
        navLinksMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ============================================================================
  // 14. SMOOTH 3D POINTER TILT IN rAF (Lerp 0.12, Max 4deg, No CSS Conflict)
  // ============================================================================

  const tiltCardsList = [];

  function init3DTilt() {
    if (prefersReducedMotion || !window.matchMedia('(hover: hover)').matches) return;

    const cards = $$('#hero-portfolio-card, .category-card');
    cards.forEach(card => {
      const cardState = {
        el: card,
        targetRx: 0,
        targetRy: 0,
        currentRx: 0,
        currentRy: 0,
        targetMouseX: 50,
        targetMouseY: 50,
        currentMouseX: 50,
        currentMouseY: 50,
        isActive: false
      };

      card.addEventListener('pointerenter', e => {
        cardState.isActive = true;
        const rect = card.getBoundingClientRect();
        const px = ((e.clientX - rect.left) / rect.width) * 100;
        const py = ((e.clientY - rect.top) / rect.height) * 100;
        cardState.targetMouseX = px;
        cardState.targetMouseY = py;
        cardState.currentMouseX = px;
        cardState.currentMouseY = py;
      }, { passive: true });

      card.addEventListener('pointermove', e => {
        if (!cardState.isActive) return;
        const rect = card.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const normX = ((x / width) - 0.5) * 2;
        const normY = ((y / height) - 0.5) * 2;

        const maxTilt = 4; // degrees
        cardState.targetRx = -normY * maxTilt;
        cardState.targetRy = normX * maxTilt;

        cardState.targetMouseX = (x / width) * 100;
        cardState.targetMouseY = (y / height) * 100;
      }, { passive: true });

      card.addEventListener('pointerleave', () => {
        cardState.targetRx = 0;
        cardState.targetRy = 0;
        cardState.isActive = false;
      }, { passive: true });

      tiltCardsList.push(cardState);
    });
  }

  function update3DTiltStep() {
    for (let i = 0; i < tiltCardsList.length; i++) {
      const c = tiltCardsList[i];
      c.currentRx += (c.targetRx - c.currentRx) * 0.12;
      c.currentRy += (c.targetRy - c.currentRy) * 0.12;
      c.currentMouseX += (c.targetMouseX - c.currentMouseX) * 0.12;
      c.currentMouseY += (c.targetMouseY - c.currentMouseY) * 0.12;

      if (!c.isActive && Math.abs(c.currentRx) < 0.01 && Math.abs(c.currentRy) < 0.01) {
        c.currentRx = 0;
        c.currentRy = 0;
        c.el.style.removeProperty('--tilt-rx');
        c.el.style.removeProperty('--tilt-ry');
      } else {
        c.el.style.setProperty('--tilt-rx', `${c.currentRx.toFixed(2)}deg`);
        c.el.style.setProperty('--tilt-ry', `${c.currentRy.toFixed(2)}deg`);
      }

      if (c.isActive || Math.abs(c.currentRx) > 0.01) {
        c.el.style.setProperty('--mouse-x', `${c.currentMouseX.toFixed(1)}%`);
        c.el.style.setProperty('--mouse-y', `${c.currentMouseY.toFixed(1)}%`);
      }
    }
  }

  // ============================================================================
  // 15. ACTIVE NAVIGATION LINK TRACKING
  // ============================================================================

  const navSectionIds = ['hero', 'about', 'cats', 'channels', 'stores', 'videos', 'markets', 'contact'];
  const navAnchorMap = {};

  function initNavTracking() {
    navSectionIds.forEach(id => {
      const link = $(`#nav-links-menu a[href="#${id}"]`);
      if (link) {
        navAnchorMap[id] = link;
      }
    });
  }

  function updateActiveNavLink(scrollY) {
    const scrollPosition = scrollY + 120;
    let currentActiveId = '';

    for (let i = 0; i < cachedSectionPositions.length; i++) {
      const item = cachedSectionPositions[i];
      const id = item.el.id;
      if (id && scrollPosition >= item.top && scrollPosition < item.top + item.height) {
        currentActiveId = id;
        break;
      }
    }

    Object.keys(navAnchorMap).forEach(id => {
      if (id === currentActiveId) {
        navAnchorMap[id].classList.add('active');
      } else {
        navAnchorMap[id].classList.remove('active');
      }
    });
  }

  // ============================================================================
  // 16. SINGLE MASTER REQUEST ANIMATION FRAME LOOP
  // Native 0ms scroll with direct window.scrollY reading
  // ============================================================================

  let isTabVisible = !document.hidden;

  function masterLoop(time) {
    if (isTabVisible) {
      // 1. Native Direct Scroll Read (Zero Scroll Delay)
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = Math.max(document.documentElement.scrollHeight - windowHeight, 1);
      const scrollProgress = Math.min(Math.max(scrollY / docHeight, 0), 1);

      // 2. Lottie frame update (light 0.2 easing on frame value)
      updateLottieProgress(scrollProgress);

      // 3. Floating shapes parallax (8 shapes, light 0.2 easing on Y offset)
      updateFloatingShapes(scrollY);

      // 4. Background canvas color shift (light 0.2 easing on color progress)
      updateBackgroundColor(scrollProgress);

      // 5. Section tone adaptation (hysteresis 0.42 / 0.48)
      updateSectionContrastHysteresis(docHeight);

      // 6. Progress bar & circuit grid
      updateScrollIndicator(scrollProgress, scrollY);

      // 7. Smooth 3D tilt lerp (lerp 0.12, CSS variables)
      update3DTiltStep();

      // 8. Navbar styling on scroll
      if (navElement) {
        if (scrollY > 50) {
          navElement.classList.add('scrolled');
        } else {
          navElement.classList.remove('scrolled');
        }
      }

      // 9. Active Nav Link Highlighting
      updateActiveNavLink(scrollY);
    }

    requestAnimationFrame(masterLoop);
  }

  // Pause rendering when tab is hidden
  document.addEventListener('visibilitychange', () => {
    isTabVisible = !document.hidden;
  });

  // Debounced resize handler
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      cacheSectionMetrics();
      initFloatingShapes();
    }, 150);
  }, { passive: true });

  // ============================================================================
  // 17. INITIALIZATION LIFECYCLE
  // ============================================================================

  function initApp() {
    populateContent();
    cacheSectionMetrics();
    initAnchorNavigation();
    initFloatingShapes();
    initNavTracking();
    initScrollReveals();
    initStatCountersObserver();
    init3DTilt();
    initLottieBackground();

    // Defer hero entrance animations until fonts are loaded
    const fontReadyPromise = document.fonts ? document.fonts.ready : Promise.resolve();
    fontReadyPromise.then(() => {
      document.body.classList.add('hero-ready');
    }).catch(() => {
      document.body.classList.add('hero-ready');
    });

    // Start single master animation loop
    requestAnimationFrame(masterLoop);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();
