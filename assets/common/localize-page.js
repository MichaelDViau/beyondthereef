(function () {
  const lang = (document.documentElement.lang || '').toLowerCase();
  if (lang !== 'fr' && lang !== 'es') return;

  const PHRASES = {
    fr: {
      "Book now": "Réservez maintenant",
      "Book on WhatsApp": "Réserver sur WhatsApp",
      "Book your tour": "Réservez votre tour",
      "Book your experience": "Réservez votre expérience",
      "Explore experiences": "Explorer les expériences",
      "Private Experiences": "Expériences privées",
      "Shared Experiences": "Expériences en groupe",
      "Guest Reviews": "Avis clients",
      "Our Story": "Notre histoire",
      "Get In Touch": "Contactez-nous",
      "Custom Request": "Demande personnalisée",
      "Tell us your dream day": "Parlez-nous de votre journée rêvée",
      "What is included": "Ce qui est inclus",
      "What's included": "Ce qui est inclus",
      "Not included": "Non inclus",
      "Tour Information": "Informations du tour",
      "About This Experience": "À propos de cette expérience",
      "Request to Book": "Demander une réservation",
      "Request Sent": "Demande envoyée",
      "Price per person": "Prix par personne",
      "Total price": "Prix total",
      "Number of guests": "Nombre de voyageurs",
      "Preferred Date": "Date souhaitée",
      "Special Requests": "Demandes spéciales",
      "Hotel / Pick-up Location": "Hôtel / Lieu de prise en charge",
      "Open menu": "Ouvrir le menu",
      "Close menu": "Fermer le menu",
      "Previous photo": "Photo précédente",
      "Next photo": "Photo suivante",
      "See More Tours": "Voir plus de tours",
      "Keep Exploring": "Continuez à explorer",
      "Guests also loved": "Les voyageurs ont aussi adoré"
    },
    es: {
      "Book now": "Reserva ahora",
      "Book on WhatsApp": "Reservar por WhatsApp",
      "Book your tour": "Reserva tu tour",
      "Book your experience": "Reserva tu experiencia",
      "Explore experiences": "Explorar experiencias",
      "Private Experiences": "Experiencias privadas",
      "Shared Experiences": "Experiencias compartidas",
      "Guest Reviews": "Reseñas de huéspedes",
      "Our Story": "Nuestra historia",
      "Get In Touch": "Ponte en contacto",
      "Custom Request": "Solicitud personalizada",
      "Tell us your dream day": "Cuéntanos tu día soñado",
      "What is included": "Qué incluye",
      "What's included": "Qué incluye",
      "Not included": "No incluye",
      "Tour Information": "Información del tour",
      "About This Experience": "Sobre esta experiencia",
      "Request to Book": "Solicitar reserva",
      "Request Sent": "Solicitud enviada",
      "Price per person": "Precio por persona",
      "Total price": "Precio total",
      "Number of guests": "Número de viajeros",
      "Preferred Date": "Fecha preferida",
      "Special Requests": "Solicitudes especiales",
      "Hotel / Pick-up Location": "Hotel / Lugar de recogida",
      "Open menu": "Abrir menú",
      "Close menu": "Cerrar menú",
      "Previous photo": "Foto anterior",
      "Next photo": "Foto siguiente",
      "See More Tours": "Ver más tours",
      "Keep Exploring": "Sigue explorando",
      "Guests also loved": "A los viajeros también les encantó"
    }
  };

  const WORDS = {
    fr: {
      book: 'réserver', private: 'privé', shared: 'partagé', experience: 'expérience', experiences: 'expériences',
      reviews: 'avis', review: 'avis', story: 'histoire', contact: 'contact', details: 'détails',
      from: 'à partir de', person: 'personne', day: 'journée', days: 'jours', half: 'demi',
      full: 'complète', tours: 'tours', tour: 'tour', included: 'inclus', include: 'inclure',
      guide: 'guide', guides: 'guides', certified: 'certifié', snorkeling: 'snorkeling',
      turtles: 'tortues', turtle: 'tortue', cenote: 'cénote', cenotes: 'cénotes',
      lunch: 'déjeuner', drinks: 'boissons', snack: 'collation', photos: 'photos',
      request: 'demande', sent: 'envoyée', total: 'total', price: 'prix',
      name: 'nom', phone: 'téléphone', email: 'email', message: 'message',
      date: 'date', hotel: 'hôtel', location: 'lieu', whatsapp: 'whatsapp',
      previous: 'précédent', next: 'suivant', menu: 'menu', open: 'ouvrir', close: 'fermer',
      all: 'tous', rights: 'droits', reserved: 'réservés', local: 'local',
      values: 'valeurs', guest: 'voyageur', guests: 'voyageurs', stars: 'étoiles'
    },
    es: {
      book: 'reservar', private: 'privado', shared: 'compartido', experience: 'experiencia', experiences: 'experiencias',
      reviews: 'reseñas', review: 'reseña', story: 'historia', contact: 'contacto', details: 'detalles',
      from: 'desde', person: 'persona', day: 'día', days: 'días', half: 'medio',
      full: 'completo', tours: 'tours', tour: 'tour', included: 'incluye', include: 'incluye',
      guide: 'guía', guides: 'guías', certified: 'certificado', snorkeling: 'snorkel',
      turtles: 'tortugas', turtle: 'tortuga', cenote: 'cenote', cenotes: 'cenotes',
      lunch: 'almuerzo', drinks: 'bebidas', snack: 'snack', photos: 'fotos',
      request: 'solicitud', sent: 'enviada', total: 'total', price: 'precio',
      name: 'nombre', phone: 'teléfono', email: 'correo', message: 'mensaje',
      date: 'fecha', hotel: 'hotel', location: 'ubicación', whatsapp: 'whatsapp',
      previous: 'anterior', next: 'siguiente', menu: 'menú', open: 'abrir', close: 'cerrar',
      all: 'todos', rights: 'derechos', reserved: 'reservados', local: 'local',
      values: 'valores', guest: 'huésped', guests: 'huéspedes', stars: 'estrellas'
    }
  };

  const phraseEntries = Object.entries(PHRASES[lang]).sort((a, b) => b[0].length - a[0].length);
  const wordMap = WORDS[lang];

  const shouldSkip = (node) => {
    if (!node || !node.parentElement) return true;
    const tag = node.parentElement.tagName;
    return tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT';
  };

  function replacePhrases(s) {
    let out = s;
    for (const [en, tr] of phraseEntries) {
      const re = new RegExp(en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      out = out.replace(re, tr);
    }
    return out;
  }

  function replaceWords(s) {
    return s.replace(/\b([A-Za-z][A-Za-z'’-]*)\b/g, (m, w) => {
      const t = wordMap[w.toLowerCase()];
      if (!t) return m;
      if (w[0] === w[0].toUpperCase()) return t.charAt(0).toUpperCase() + t.slice(1);
      return t;
    });
  }

  function translateText(s) {
    const withPhrases = replacePhrases(s);
    return replaceWords(withPhrases);
  }

  function translateNodeText(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const n of nodes) {
      if (shouldSkip(n)) continue;
      const raw = n.nodeValue;
      if (!raw || !raw.trim()) continue;
      const translated = translateText(raw);
      if (translated !== raw) n.nodeValue = translated;
    }
  }

  function translateAttrs(root) {
    const attrs = ['placeholder', 'aria-label', 'title', 'alt'];
    const all = root.querySelectorAll('*');
    for (const el of all) {
      for (const a of attrs) {
        const val = el.getAttribute(a);
        if (val && val.trim()) {
          const t = translateText(val);
          if (t !== val) el.setAttribute(a, t);
        }
      }
    }
  }

  function run() {
    document.title = translateText(document.title);
    const metas = document.querySelectorAll('meta[name="description"], meta[property="og:title"], meta[property="og:description"]');
    metas.forEach(m => {
      const c = m.getAttribute('content');
      if (c) m.setAttribute('content', translateText(c));
    });
    translateNodeText(document.body);
    translateAttrs(document.body);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }

  const obs = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const n of m.addedNodes) {
        if (n.nodeType === 1) {
          translateNodeText(n);
          translateAttrs(n);
        } else if (n.nodeType === 3 && n.nodeValue && n.nodeValue.trim()) {
          if (!shouldSkip(n)) n.nodeValue = translateText(n.nodeValue);
        }
      }
    }
  });
  obs.observe(document.body, { childList: true, subtree: true });
})();
