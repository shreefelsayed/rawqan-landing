(function () {
  "use strict";

  var PLAY_BASE = "https://play.google.com/store/apps/details?id=com.rwaqan.customer";
  var IOS_URL = "https://apps.apple.com/eg/app/rwaqan/id6739463193";
  var BASE = "https://rawqan-landing.vercel.app";

  var i18n = {
    en: {
      eyebrow: "Store on Rwaqan",
      defaultTitle: "Open this store in the app",
      subtitle: "Get the Rwaqan customer app to browse products, order, and track delivery.",
      openApp: "Open in Rwaqan",
      getItOn: "Get it on",
      downloadOn: "Download on the",
      aboutLink: "What is Rwaqan?",
      playAria: "Get Rwaqan on Google Play",
      iosAria: "Download Rwaqan on the App Store",
      missingTitle: "Store unavailable",
      missingSub: "This store link is missing or no longer available. You can still download Rwaqan and explore other stores.",
      metaId: "Store ID: {id}",
      pageTitle: "{name} — Rwaqan",
      unnamedTitle: "A Rwaqan storefront",
      unnamedSub: "Install or open the Rwaqan app to browse this store. We’ll remember this link after install when possible.",
      copiedHint: "Store link saved for after install"
    },
    ar: {
      eyebrow: "متجر على رواقان",
      defaultTitle: "افتح هذا المتجر في التطبيق",
      subtitle: "حمّل تطبيق رواقان للمتسوّقين لتصفح المنتجات والطلب وتتبع التوصيل.",
      openApp: "افتح في رواقان",
      getItOn: "احصل عليه من",
      downloadOn: "حمّله من",
      aboutLink: "ما هو رواقان؟",
      playAria: "حمّل رواقان من Google Play",
      iosAria: "حمّل رواقان من App Store",
      missingTitle: "المتجر غير متاح",
      missingSub: "رابط المتجر غير موجود أو لم يعد متاحًا. يمكنك تحميل رواقان واستكشاف متاجر أخرى.",
      metaId: "معرّف المتجر: {id}",
      pageTitle: "{name} — رواقان",
      unnamedTitle: "واجهة متجر على رواقان",
      unnamedSub: "ثبّت أو افتح تطبيق رواقان لتصفح هذا المتجر. سنحاول تذكّر الرابط بعد التثبيت.",
      copiedHint: "تم حفظ رابط المتجر لبعد التثبيت"
    }
  };

  function parseStoreId() {
    var parts = window.location.pathname.replace(/\/+$/, "").split("/");
    var idx = parts.indexOf("b");
    if (idx >= 0 && parts[idx + 1]) {
      return decodeURIComponent(parts[idx + 1]).trim();
    }
    return "";
  }

  function qs(name) {
    try {
      return new URLSearchParams(window.location.search).get(name) || "";
    } catch (e) {
      return "";
    }
  }

  function applyLang(lang) {
    var dict = i18n[lang] || i18n.en;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (dict[key]) el.textContent = dict[key];
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-aria");
      if (dict[key]) el.setAttribute("aria-label", dict[key]);
    });
    var toggle = document.getElementById("langToggle");
    if (toggle) {
      toggle.innerHTML = lang === "ar"
        ? "<b>عربي</b> · <span>EN</span>"
        : "<b>EN</b> · <span>عربي</span>";
    }
    return dict;
  }

  function detectLang() {
    var saved = "";
    try { saved = localStorage.getItem("rwaqan_store_lang") || ""; } catch (e) {}
    if (saved === "ar" || saved === "en") return saved;
    var nav = (navigator.language || "").toLowerCase();
    return nav.indexOf("ar") === 0 ? "ar" : "en";
  }

  function playUrlForStore(id) {
    if (!id) return PLAY_BASE;
    var referrer = "utm_source=qr&utm_medium=store&utm_content=" + encodeURIComponent(id);
    return PLAY_BASE + "&referrer=" + encodeURIComponent(referrer);
  }

  function stashClipboard(url) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).catch(function () {});
      }
    } catch (e) {}
  }

  function showCopiedHint(dict) {
    var hint = document.getElementById("storeCopiedHint");
    if (!hint) return;
    hint.hidden = false;
    hint.textContent = dict.copiedHint;
  }

  var storeId = parseStoreId();
  var previewName = qs("n").trim();
  var previewCover = qs("c").trim();
  var lang = detectLang();
  var dict = applyLang(lang);

  var nameEl = document.getElementById("storeName");
  var subEl = document.getElementById("storeSub");
  var metaEl = document.getElementById("storeMeta");
  var coverEl = document.getElementById("storeCover");
  var cardEl = document.getElementById("storeCard");
  var openBtn = document.getElementById("openAppBtn");

  if (!storeId) {
    cardEl.classList.add("is-missing");
    nameEl.textContent = dict.missingTitle;
    subEl.textContent = dict.missingSub;
    openBtn.href = "../#download";
    openBtn.textContent = dict.openApp;
  } else {
    var deepLink = BASE + "/b/" + encodeURIComponent(storeId);
    var displayName = previewName || dict.unnamedTitle;
    nameEl.textContent = displayName;
    document.title = dict.pageTitle.replace("{name}", previewName || "Rwaqan");
    if (!previewName) {
      subEl.textContent = dict.unnamedSub;
    }
    metaEl.hidden = false;
    metaEl.textContent = dict.metaId.replace("{id}", storeId);

    if (previewCover && /^https?:\/\//i.test(previewCover) && previewCover.length < 2000) {
      // Safe-ish CSS url: strip quotes/parens only; https already required.
      coverEl.classList.add("has-image");
      coverEl.style.backgroundImage = 'url("' + previewCover.replace(/["'()\\]/g, "") + '")';
    }

    openBtn.href = deepLink;

    // M1b: stash store URL so a fresh install can resume after download.
    stashClipboard(deepLink);

    document.querySelectorAll('a[href*="play.google.com"]').forEach(function (a) {
      a.href = playUrlForStore(storeId);
      a.addEventListener("click", function () {
        stashClipboard(deepLink);
        showCopiedHint(dict);
      });
    });
    document.querySelectorAll('a[href*="apps.apple.com"]').forEach(function (a) {
      a.href = IOS_URL;
      a.addEventListener("click", function () {
        stashClipboard(deepLink);
        showCopiedHint(dict);
      });
    });

    openBtn.addEventListener("click", function () {
      stashClipboard(deepLink);
    });

    // Do NOT auto-navigate to the same HTTPS URL — when App Links are unverified
    // that reloads this interstitial in a loop. Rely on the Open CTA + badges.
  }

  document.getElementById("langToggle").addEventListener("click", function () {
    lang = lang === "ar" ? "en" : "ar";
    try { localStorage.setItem("rwaqan_store_lang", lang); } catch (e) {}
    dict = applyLang(lang);
    if (!storeId) {
      nameEl.textContent = dict.missingTitle;
      subEl.textContent = dict.missingSub;
    } else if (previewName) {
      nameEl.textContent = previewName;
      document.title = dict.pageTitle.replace("{name}", previewName);
      subEl.textContent = dict.subtitle;
    } else {
      nameEl.textContent = dict.unnamedTitle;
      subEl.textContent = dict.unnamedSub;
      document.title = dict.pageTitle.replace("{name}", "Rwaqan");
    }
    if (storeId) {
      metaEl.textContent = dict.metaId.replace("{id}", storeId);
    }
  });

  if (!storeId) {
    document.querySelectorAll('a[href*="play.google.com"]').forEach(function (a) {
      a.href = PLAY_BASE;
    });
    document.querySelectorAll('a[href*="apps.apple.com"]').forEach(function (a) {
      a.href = IOS_URL;
    });
  }
})();
