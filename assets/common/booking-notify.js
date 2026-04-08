/* ============================================================
   Beyond the Reef — Owner Booking Notifications
   Sends a notification automatically when a guest books.

   ── CHOOSE YOUR NOTIFICATION METHOD(S) ──────────────────────
   Fill in the keys for whichever services you want to use.
   You can enable one, two, or all three at the same time.

   ── 1. TELEGRAM (recommended — free, instant, reliable) ─────
      a. Open Telegram and search for "@BotFather"
      b. Send:  /newbot
      c. Follow the prompts — give your bot any name
      d. BotFather sends you a TOKEN like:  123456789:ABCdef...
      e. Now open this URL in your browser (replace TOKEN):
            https://api.telegram.org/bot<TOKEN>/getUpdates
         (first send any message to your new bot, then open the URL)
      f. In the response find "chat":{"id": 123456789}  — that is your CHAT_ID
      g. Fill in tg_token and tg_chatid below

   ── 2. NTFY (simplest — no account, push to phone) ──────────
      a. Install the free "ntfy" app on your phone (iOS or Android)
      b. Pick a unique topic name, e.g.  beyondthereef-bookings-2024
         (anyone who knows the name can subscribe, so make it hard to guess)
      c. In the ntfy app tap "+" and subscribe to your topic name
      d. Fill in ntfy_topic below with that same name

   ── 3. EMAIL (EmailJS — free up to 200/month) ───────────────
      a. Go to https://www.emailjs.com — create a free account
      b. "Add New Service" → connect Gmail (or any email)
      c. "Email Templates" → "Create New Template"
         Set the "To Email" field to your address
         Use these variables in the body:
           {{tour}} {{name}} {{email}} {{phone}} {{date}} {{hotel}} {{pricing}} {{notes}}
      d. "Account" → copy your Public Key
      e. Fill in ejs_public, ejs_service, ejs_template below

   ── 4. WHATSAPP via CallMeBot (if you still want to try) ────
      a. Add +34 644 59 77 51 to your WhatsApp contacts
      b. Send the message:  I allow callmebot to send me messages
      c. Wait for their reply with your API key (can take a few minutes)
      d. Fill in wa_apikey below

   ============================================================ */

(function (window) {

  // ── CONFIGURATION — fill in the values for what you want to use ──
  var CFG = {

    // ── Telegram ─────────────────────────────────────────────────
    tg_token:  'YOUR_TELEGRAM_BOT_TOKEN',   // e.g. '123456789:ABCdef...'
    tg_chatid: 'YOUR_TELEGRAM_CHAT_ID',     // e.g. '123456789'

    // ── ntfy (push notification to phone app) ────────────────────
    ntfy_topic: 'YOUR_NTFY_TOPIC',          // e.g. 'beyondthereef-bookings-2024'

    // ── EmailJS ──────────────────────────────────────────────────
    ejs_public:   'YOUR_EMAILJS_PUBLIC_KEY',
    ejs_service:  'YOUR_EMAILJS_SERVICE_ID',
    ejs_template: 'YOUR_EMAILJS_TEMPLATE_ID',

    // ── WhatsApp via CallMeBot (backup option) ────────────────────
    wa_phone:  '52984167067',
    wa_apikey: 'YOUR_CALLMEBOT_API_KEY'
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

  /* ── Telegram ── */
  function sendTelegram(data) {
    if (CFG.tg_token === 'YOUR_TELEGRAM_BOT_TOKEN') return;
    var url = 'https://api.telegram.org/bot' + CFG.tg_token +
              '/sendMessage?chat_id=' + encodeURIComponent(CFG.tg_chatid) +
              '&text=' + encodeURIComponent(buildMessage(data));
    new Image().src = url;
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

  /* ── WhatsApp via CallMeBot ── */
  function sendWhatsApp(data) {
    if (CFG.wa_apikey === 'YOUR_CALLMEBOT_API_KEY') return;
    var url = 'https://api.callmebot.com/whatsapp.php' +
              '?phone='  + encodeURIComponent(CFG.wa_phone) +
              '&text='   + encodeURIComponent(buildMessage(data)) +
              '&apikey=' + encodeURIComponent(CFG.wa_apikey);
    new Image().src = url;
  }

  /* Main notify — fires all configured channels simultaneously */
  window.btrNotify = function (data) {
    sendTelegram(data);
    sendNtfy(data);
    sendEmailJS(data);
    sendWhatsApp(data);
  };

}(window));
