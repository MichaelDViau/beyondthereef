/* ============================================================
   Beyond the Reef — Owner Booking Notifications
   Sends a notification automatically when a guest books.

   ── CHOOSE YOUR NOTIFICATION METHOD(S) ──────────────────────
   Fill in the keys for whichever services you want to use.
   You can use one or more at the same time.

   ── 1. WHATSAPP via Green API (recommended — free, uses your own WhatsApp)
      a. Go to https://green-api.com and create a free account
      b. Click "Create Instance" — choose the free plan
      c. In your instance dashboard, click "Scan QR Code"
         and scan it with your WhatsApp (like WhatsApp Web)
      d. Copy your "idInstance" (e.g. 1101234567)
         and "apiTokenInstance" (long string of letters/numbers)
      e. Fill in greenapi_instance and greenapi_token below
      Note: keep WhatsApp open on your phone so the instance stays active

   ── 2. EMAIL via EmailJS (free up to 200/month) ──────────────
      a. Go to https://www.emailjs.com — create a free account
      b. "Add New Service" → connect your Gmail
      c. "Email Templates" → "Create New Template"
         Set "To Email" to your address in the template settings
         Use these variables anywhere in the body:
           {{tour}} {{name}} {{email}} {{phone}} {{date}} {{hotel}} {{pricing}} {{notes}}
      d. "Account" → copy your Public Key
      e. Fill in ejs_public, ejs_service, ejs_template below

   ── 3. NTFY (simplest push notification — no account needed) ─
      a. Install the free "ntfy" app on your phone (iOS or Android)
      b. In the app tap "+" and subscribe to a unique topic name
         e.g.  beyondthereef-bookings-2024  (make it hard to guess)
      c. Fill in ntfy_topic below with that same name

   ============================================================ */

(function (window) {

  // ── CONFIGURATION — fill in the values for what you want to use ──
  var CFG = {

    // ── WhatsApp via Green API ────────────────────────────────────
    // Your own WhatsApp number that will RECEIVE the message (with country code, no + or spaces)
    greenapi_to:       '52984167067',
    // From your Green API dashboard:
    greenapi_instance: 'YOUR_GREENAPI_INSTANCE_ID',  // e.g. '1101234567'
    greenapi_token:    'YOUR_GREENAPI_TOKEN',         // long alphanumeric string

    // ── EmailJS ──────────────────────────────────────────────────
    ejs_public:   'YOUR_EMAILJS_PUBLIC_KEY',
    ejs_service:  'YOUR_EMAILJS_SERVICE_ID',
    ejs_template: 'YOUR_EMAILJS_TEMPLATE_ID',

    // ── ntfy push notification ───────────────────────────────────
    ntfy_topic: 'YOUR_NTFY_TOPIC'   // e.g. 'beyondthereef-bookings-2024'
  };
  // ─────────────────────────────────────────────────────────────────

  function buildMessage(data) {
    return (
      'NEW BOOKING - Beyond the Reef\n' +
      'Tour: '   + data.tour    + '\n' +
      'Name: '   + data.name    + '\n' +
      'Email: '  + data.email   + '\n' +
      'Phone: '  + data.phone   + '\n' +
      'Date: '   + data.date    + '\n' +
      'Hotel: '  + data.hotel   + '\n' +
      'Guests: ' + data.pricing + '\n' +
      'Notes: '  + data.notes
    );
  }

  /* ── WhatsApp via Green API ── */
  function sendGreenAPI(data) {
    if (CFG.greenapi_instance === 'YOUR_GREENAPI_INSTANCE_ID') return;
    var url = 'https://api.green-api.com/waInstance' + CFG.greenapi_instance +
              '/sendMessage/' + CFG.greenapi_token;
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chatId: CFG.greenapi_to + '@c.us',
        message: buildMessage(data)
      })
    }).catch(function () {});
  }

  /* ── EmailJS ── */
  function sendEmailJS(data) {
    if (CFG.ejs_public === 'YOUR_EMAILJS_PUBLIC_KEY') return;
    if (typeof emailjs === 'undefined') {
      var s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
      s.onload = function () {
        emailjs.init({ publicKey: CFG.ejs_public });
        emailjs.send(CFG.ejs_service, CFG.ejs_template, data)
          .catch(function (err) { console.warn('[BTR] EmailJS:', err); });
      };
      document.head.appendChild(s);
    } else {
      emailjs.send(CFG.ejs_service, CFG.ejs_template, data)
        .catch(function (err) { console.warn('[BTR] EmailJS:', err); });
    }
  }

  /* ── ntfy push notification ── */
  function sendNtfy(data) {
    if (CFG.ntfy_topic === 'YOUR_NTFY_TOPIC') return;
    fetch('https://ntfy.sh/' + CFG.ntfy_topic, {
      method: 'POST',
      body: buildMessage(data),
      headers: { 'Title': 'New Booking: ' + data.tour }
    }).catch(function () {});
  }

  /* Main notify — fires all configured channels simultaneously */
  window.btrNotify = function (data) {
    sendGreenAPI(data);
    sendEmailJS(data);
    sendNtfy(data);
  };

}(window));
