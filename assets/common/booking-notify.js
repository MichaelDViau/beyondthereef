/* ============================================================
   Beyond the Reef — Owner Booking Notifications
   Sends WhatsApp + Email automatically when a guest books.

   ── SETUP INSTRUCTIONS ──────────────────────────────────────

   1. WHATSAPP (CallMeBot — free):
      a. Add "+34 644 59 77 51" to your WhatsApp contacts (name it "CallMeBot")
      b. Send this exact message to that number:
         "I allow callmebot to send me messages"
      c. You will receive your API key via WhatsApp in seconds
      d. Replace 'YOUR_CALLMEBOT_API_KEY' below with that key

   2. EMAIL (EmailJS — free up to 200 emails/month):
      a. Go to https://www.emailjs.com and create a free account
      b. Add a service: click "Add New Service" → choose Gmail (or any)
      c. Create a template: click "Email Templates" → "Create New Template"
         Set "To Email" to your email address in the template settings
         Use these variables in the template body:
           {{tour}} {{name}} {{email}} {{phone}} {{date}} {{hotel}} {{pricing}} {{notes}}
      d. Go to "Account" → copy your Public Key
      e. Fill in the three values below

   ============================================================ */

(function (window) {

  // ── OWNER CONFIGURATION — edit these values ──────────────────
  var CFG = {
    // Your WhatsApp number (digits only, include country code, no + or spaces)
    wa_phone: '52984167067',

    // Your CallMeBot API key (get it via step 1 above)
    wa_apikey: 'YOUR_CALLMEBOT_API_KEY',

    // EmailJS settings (get them via step 2 above)
    ejs_public:   'YOUR_EMAILJS_PUBLIC_KEY',
    ejs_service:  'YOUR_EMAILJS_SERVICE_ID',
    ejs_template: 'YOUR_EMAILJS_TEMPLATE_ID'
  };
  // ─────────────────────────────────────────────────────────────

  /* Send WhatsApp message via CallMeBot API
     Uses an Image request to avoid any CORS issues */
  function sendWhatsApp(data) {
    if (!CFG.wa_apikey || CFG.wa_apikey === 'YOUR_CALLMEBOT_API_KEY') {
      console.info('[BTR] WhatsApp: add your CallMeBot API key to booking-notify.js');
      return;
    }
    var msg =
      'NEW BOOKING REQUEST\n' +
      'Tour: '    + data.tour    + '\n' +
      'Name: '    + data.name    + '\n' +
      'Email: '   + data.email   + '\n' +
      'Phone: '   + data.phone   + '\n' +
      'Date: '    + data.date    + '\n' +
      'Hotel: '   + data.hotel   + '\n' +
      'Guests: '  + data.pricing + '\n' +
      'Notes: '   + data.notes;

    var url =
      'https://api.callmebot.com/whatsapp.php' +
      '?phone='  + encodeURIComponent(CFG.wa_phone) +
      '&text='   + encodeURIComponent(msg) +
      '&apikey=' + encodeURIComponent(CFG.wa_apikey);

    /* Image trick: avoids CORS, fires a GET request silently */
    new Image().src = url;
  }

  /* Send email via EmailJS (direct browser-to-email, no server needed) */
  function sendEmailJS(data) {
    if (!CFG.ejs_public || CFG.ejs_public === 'YOUR_EMAILJS_PUBLIC_KEY') {
      console.info('[BTR] Email: add your EmailJS keys to booking-notify.js');
      return;
    }

    /* Load EmailJS SDK on demand (only once) */
    if (typeof emailjs === 'undefined') {
      var s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
      s.onload = function () {
        emailjs.init({ publicKey: CFG.ejs_public });
        emailjs.send(CFG.ejs_service, CFG.ejs_template, data).catch(function (err) {
          console.warn('[BTR] EmailJS error:', err);
        });
      };
      document.head.appendChild(s);
    } else {
      emailjs.send(CFG.ejs_service, CFG.ejs_template, data).catch(function (err) {
        console.warn('[BTR] EmailJS error:', err);
      });
    }
  }

  /* Main notify function — call this after a successful booking submission */
  window.btrNotify = function (data) {
    sendWhatsApp(data);
    sendEmailJS(data);
  };

}(window));
