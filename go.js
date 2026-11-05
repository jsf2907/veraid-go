// VeraID affiliate links (go.veraid.org/CODE).
// 1. Records one click per phone, per affiliate, per day (affiliate-click Edge Function).
// 2. Sends the person to the right store: iPhone -> App Store, Android -> Google Play,
//    computer -> veraid.org. The affiliate code rides along as the store campaign.
// No personal data is collected here. No keys or secrets belong in this public repo.
(function () {
  var ENDPOINT = 'https://wmqnmpalslkvzorsihcq.supabase.co/functions/v1/affiliate-click';
  var APP_STORE_ID = '6774799005';
  var APPLE_PROVIDER_TOKEN = ''; // App Store Connect campaign "pt" value; per-affiliate download counts on iPhone need it
  var ANDROID_PACKAGE = 'com.veraid.app';

  function clean(s, re, max) { return String(s || '').replace(re, '').slice(0, max); }

  var fromPath = location.pathname.split('/').filter(Boolean)[0] || '';
  var code = clean((window.VERAID_CODE || fromPath).toUpperCase(), /[^A-Z0-9]/g, 10);
  var params = new URLSearchParams(location.search);
  var source = clean((params.get('s') || '').toLowerCase(), /[^a-z0-9_-]/g, 30);

  var ua = navigator.userAgent || '';
  var isIOS = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  var isAndroid = /Android/i.test(ua);
  var device = isIOS ? 'ios' : isAndroid ? 'android' : 'desktop';

  // Record the click (once per phone, per affiliate, per day).
  if (code) {
    var key = 'vg_' + code + '_' + new Date().toISOString().slice(0, 10);
    var seen = false;
    try { seen = localStorage.getItem(key) === '1'; } catch (e) {}
    if (!seen) {
      var payload = JSON.stringify({ code: code, device: device, source: source || null });
      var sent = false;
      try {
        if (navigator.sendBeacon) sent = navigator.sendBeacon(ENDPOINT, new Blob([payload], { type: 'text/plain' }));
      } catch (e) {}
      if (!sent) {
        try { fetch(ENDPOINT, { method: 'POST', body: payload, keepalive: true, headers: { 'Content-Type': 'text/plain' } }); } catch (e) {}
      }
      try { localStorage.setItem(key, '1'); } catch (e) {}
    }
  }

  // Where to send the person.
  var c = encodeURIComponent(code || 'direct');
  var appStore = 'https://apps.apple.com/app/id' + APP_STORE_ID + '?mt=8&ct=' + c +
    (APPLE_PROVIDER_TOKEN ? '&pt=' + APPLE_PROVIDER_TOKEN : '');
  var googlePlay = 'https://play.google.com/store/apps/details?id=' + ANDROID_PACKAGE +
    '&referrer=' + encodeURIComponent('utm_source=affiliate&utm_medium=link&utm_campaign=' + (code || 'direct'));
  var website = 'https://veraid.org/?utm_source=affiliate&utm_medium=link&utm_campaign=' + c;

  var a1 = document.getElementById('ios'), a2 = document.getElementById('android');
  if (a1) a1.href = appStore;
  if (a2) a2.href = googlePlay;

  var dest = isIOS ? appStore : isAndroid ? googlePlay : website;
  setTimeout(function () { location.replace(dest); }, 250);
})();
