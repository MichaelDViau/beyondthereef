/*  ═══════════════════════════════════════════════════════════════
    Beyond the Reef Mexico — i18n runtime
    ─────────────────────────────────────────────────────────────
    • English lives in the HTML (source of truth).
    • FR / ES translations below — edit only these dictionaries.
    • On page load the script reads localStorage('btrPreferredLanguage'),
      walks the DOM, and swaps every matched string.
    • Runs synchronously before first paint (script is blocking).
    ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ──────────── language detection ──────────── */
  // Skip the welcome/language-picker page
  var page = (location.pathname.split('/').pop() || '').toLowerCase();
  if (page === 'welcome.html') return;

  var lang = localStorage.getItem('btrPreferredLanguage') || 'en';
  if (lang === 'en') return;                 // nothing to translate
  document.documentElement.lang = lang;

  /* ══════════════════════════════════════════════
     SHARED UI — nav, footer, buttons, labels
     Keys = exact English text (trimmed)
     ══════════════════════════════════════════════ */
  var shared = {
    fr: {
      // Nav
      'Private Experiences':       'Expériences privées',
      'Shared Experiences':        'Expériences partagées',
      'Reviews':                   'Avis',
      'Our Story':                 'Notre histoire',
      'Contact':                   'Contact',
      'Book Now':                  'Réserver',
      'Book Now →':                'Réserver →',
      'Book on WhatsApp':          'Réserver sur WhatsApp',
      '💬 Book on WhatsApp':       '💬 Réserver sur WhatsApp',

      // Hero
      'Cancun - Tulum - Playa del Carmen': 'Cancún – Tulum – Playa del Carmen',
      'Go Beyond':                 'Allez au-delà',
      'the Tourist':               'du touriste',
      'Riviera Maya.':             'Riviera Maya.',
      'Dive into cenotes. Swim with turtles. Walk ancient Mayan ruins. Eat where locals eat. Private and shared experiences designed for those who want the real local experience.':
        'Plongez dans les cénotes. Nagez avec les tortues. Explorez les ruines mayas. Mangez là où les locaux mangent. Des expériences privées et partagées pour ceux qui veulent vivre le vrai Mexique.',
      'Explore Experiences':       'Découvrir les expériences',
      'WhatsApp Us':               'Écrivez-nous sur WhatsApp',
      'Years Experience':          'Ans d\'expérience',
      'Guest Rating':              'Évaluation',
      'Local Experience':          'Expérience locale',

      // Values section
      'Our Values':                'Nos valeurs',
      'Go beyond the ordinary.':   'Allez au-delà de l\'ordinaire.',
      'Discover the real Riviera Maya through local flavors, genuine culture, and unforgettable places experienced the way they should be with freedom, depth, and no rush':
        'Découvrez la vraie Riviera Maya à travers les saveurs locales, la culture authentique et des lieux inoubliables vécus comme ils devraient l\'être : en toute liberté, en profondeur et sans se presser',
      'Photos Included':           'Photos incluses',
      'Your guide captures professional photos on every private experience - always free.':
        'Votre guide prend des photos professionnelles à chaque expérience privée — toujours gratuites.',
      'Your Schedule':             'Votre horaire',
      'Pick your start time, move at your pace - no group pickups or rushing on your private experience.':
        'Choisissez votre heure de départ, bougez à votre rythme — pas de ramassage de groupe ni de presse.',
      'Brand New Vans':            'Fourgonnettes neuves',
      'Cold A/C, leather seats, professional drivers. Newest fleet in the Riviera Maya.':
        'Climatisation, sièges en cuir, chauffeurs professionnels. La flotte la plus récente de la Riviera Maya.',
      'Safe Food':                 'Nourriture sécuritaire',
      'Fresh meals adapted for vegan, gluten-free, allergies and special requests.':
        'Repas frais adaptés aux régimes végétalien, sans gluten, aux allergies et aux demandes spéciales.',
      'Certified Guides':          'Guides certifiés',
      'Licensed, bilingual guides with 14+ years of safety-first expertise.':
        'Guides bilingues certifiés avec plus de 14 ans d\'expertise, sécurité avant tout.',
      'Zero Hidden Fees':          'Zéro frais cachés',
      'Transfers, tickets, timing - all included upfront. No surprises, ever.':
        'Transferts, billets, horaires — tout est inclus. Aucune surprise, jamais.',

      // Private tours section
      'Our Top Experiences.':      'Nos meilleures expériences.',
      '100% private. Only you and the people you choose. Certified guides, newest vans, zero shared groups.':
        '100 % privé. Seulement vous et les personnes de votre choix. Guides certifiés, fourgonnettes neuves, aucun groupe partagé.',
      'View All Experiences →':    'Voir toutes les expériences →',

      // Shared tours section
      'Budget-friendly adventures.': 'Aventures à petit budget.',
      'Small group tours at great value. Same certified guides, same incredible destinations.':
        'Tours en petit groupe à prix avantageux. Mêmes guides certifiés, mêmes destinations incroyables.',

      // Reviews section
      'Guest Stories':             'Témoignages',
      '5 stars, every time.':      '5 étoiles, à chaque fois.',
      '5.0 · Riviera Maya\'s top-rated private tours':
        '5.0 · Tours privés les mieux notés de la Riviera Maya',
      'Read All 13 Reviews →':    'Lire les 13 avis →',
      '5 Stars, Every Time':       '5 étoiles, à chaque fois',
      'Real reviews from real travelers.':
        'De vrais avis de vrais voyageurs.',
      '5.0 · 13 reviews · Top-rated in Riviera Maya':
        '5.0 · 13 avis · Les mieux notés de la Riviera Maya',

      // Contact
      'Get In Touch':              'Contactez-nous',
      'Let\'s plan your':          'Planifions votre',
      'perfect day.':              'journée parfaite.',
      'Quick response guaranteed - usually within the hour.':
        'Réponse rapide garantie — habituellement en moins d\'une heure.',
      'WhatsApp':                  'WhatsApp',
      'Chat directly with our team and get your personalized quote in minutes.':
        'Discutez directement avec notre équipe et obtenez votre devis personnalisé en quelques minutes.',
      'Open WhatsApp →':           'Ouvrir WhatsApp →',
      'Email':                     'Courriel',
      'Send your dates, group size & interests and we\'ll reply with a custom quote.':
        'Envoyez vos dates, la taille de votre groupe et vos intérêts, et nous vous répondrons avec un devis personnalisé.',
      'Send Email →':              'Envoyer un courriel →',

      // Custom request form
      'Custom Request':            'Demande personnalisée',
      'Tell us your dream day':    'Décrivez-nous votre journée de rêve',
      'Share your idea and we\'ll send a personalized quote within a few hours.':
        'Partagez votre idée et nous vous enverrons un devis personnalisé en quelques heures.',
      'Your Name':                 'Votre nom',
      'Phone / WhatsApp':          'Téléphone / WhatsApp',
      'Your Dream Day':            'Votre journée de rêve',
      'Send My Request →':         'Envoyer ma demande →',
      'We got your message!':      'Nous avons reçu votre message !',
      'We\'ll reply within hours. Check your WhatsApp too!':
        'Nous répondrons en quelques heures. Vérifiez aussi votre WhatsApp !',

      // Footer
      'Private & shared tours in Cancun, Tulum, Playa del Carmen & the Riviera Maya. 14+ years of unforgettable experiences.':
        'Tours privés et partagés à Cancún, Tulum, Playa del Carmen et la Riviera Maya. Plus de 14 ans d\'expériences inoubliables.',
      'Private & shared experiences in Cancun, Tulum, Playa del Carmen & the Riviera Maya. 14+ years of unforgettable experiences.':
        'Expériences privées et partagées à Cancún, Tulum, Playa del Carmen et la Riviera Maya. Plus de 14 ans d\'expériences inoubliables.',
      'Explore':                   'Explorer',
      'Guest Reviews':             'Avis clients',
      'Destinations':              'Destinations',
      'Cancun Tours':              'Tours à Cancún',
      'Tulum Tours':               'Tours à Tulum',
      'Playa del Carmen Tours':    'Tours à Playa del Carmen',
      'Riviera Maya Tours':        'Tours de la Riviera Maya',

      // Tour detail pages — shared elements
      'About This Experience':     'À propos de cette expérience',
      'What\'s Included & Not Included': 'Ce qui est inclus et non inclus',
      '✓ Included':                '✓ Inclus',
      '✕ Not Included':            '✕ Non inclus',
      'Starting from':             'À partir de',
      'Price drops as you add guests · No payment here':
        'Le prix baisse avec plus d\'invités · Aucun paiement ici',
      'Fixed shared tour price · No payment here':
        'Prix fixe tour partagé · Aucun paiement ici',
      'Number of guests':          'Nombre d\'invités',
      'Price per person':          'Prix par personne',
      'Total price':               'Prix total',
      '💡 Price drops automatically as group grows':
        '💡 Le prix baisse automatiquement avec la taille du groupe',
      'Full Name *':               'Nom complet *',
      'Email *':                   'Courriel *',
      'Preferred Date':            'Date souhaitée',
      'Hotel / Pick-up Location':  'Hôtel / Lieu de prise en charge',
      'Special Requests':          'Demandes spéciales',
      'Request to Book →':         'Demande de réservation →',
      'No payment collected here. We confirm availability and follow up right away.':
        'Aucun paiement ici. Nous confirmons la disponibilité et vous contactons rapidement.',
      'Request Sent!':             'Demande envoyée !',
      'We\'ll confirm availability and reach out within a few hours. Check your WhatsApp too!':
        'Nous confirmons la disponibilité et vous contactons en quelques heures. Vérifiez aussi votre WhatsApp !',
      '← See More Tours':         '← Voir plus de tours',
      'Keep Exploring':            'Continuez à explorer',
      'Guests also loved':         'Les clients ont aussi adoré',
      'Details':                   'Détails',
      'Book Now →':                'Réserver →',
      'Price on request':          'Prix sur demande',
      'Contact us for a custom quote.': 'Contactez-nous pour un devis personnalisé.',
      'Price depends on group size and date. Contact us for a custom quote.':
        'Le prix dépend de la taille du groupe et de la date. Contactez-nous pour un devis.',

      // Tour card labels
      'Top Pick':                  'Coup de cœur',
      'Best Seller':               'Meilleur vendeur',
      'New Route':                 'Nouveau parcours',
      'Quick Escape':              'Escapade rapide',
      'All-Day Epic':              'Épique toute la journée',
      'History Rich':              'Riche en histoire',
      'UNESCO':                    'UNESCO',
      'Epic Circuit':              'Circuit épique',
      'Island Life':               'Vie insulaire',
      'UNESCO Reserve':            'Réserve UNESCO',
      'Foodie Fave':               'Favori gourmand',
      'Private Boat':              'Bateau privé',
      'Budget Friendly':           'À petit budget',
      'Best Value':                'Meilleur rapport qualité-prix',
      'Half day':                  'Demi-journée',
      'Full day':                  'Journée complète',
      'Evening':                   'Soirée',

      // Our Story page
      'Born in the Riviera Maya':  'Née dans la Riviera Maya',
      '14+ years of private experiences, certified guides, and unforgettable moments.':
        'Plus de 14 ans d\'expériences privées, de guides certifiés et de moments inoubliables.',
      'Who We Are':                'Qui nous sommes',
      'More than a tour company.': 'Plus qu\'une compagnie de tours.',
      'What makes us different.':  'Ce qui nous distingue.',
      'Years serving the Riviera Maya': 'Années au service de la Riviera Maya',
      'Private experiences - always just your group': 'Expériences privées — toujours juste votre groupe',
      'Rating across all platforms': 'Évaluation sur toutes les plateformes',
      'Book Your Tour →':          'Réservez votre tour →',

      // Values
      '🐢 Safety First, Always':   '🐢 La sécurité avant tout',
      'Every guide is certified, every vehicle inspected, every activity safe. Your wellbeing is our highest priority.':
        'Chaque guide est certifié, chaque véhicule inspecté, chaque activité sécuritaire. Votre bien-être est notre priorité absolue.',
      '📸 Memories That Last':      '📸 Des souvenirs qui durent',
      'We capture professional photos on every tour at no extra charge. Real memories, not stock photos.':
        'Nous prenons des photos professionnelles à chaque tour sans frais supplémentaires. De vrais souvenirs, pas des photos génériques.',
      '🌿 Responsible Tourism':     '🌿 Tourisme responsable',
      'We respect wildlife, support local businesses, and ensure our tours leave nature exactly as we found it.':
        'Nous respectons la faune, soutenons les entreprises locales et nous assurons que nos tours laissent la nature exactement comme nous l\'avons trouvée.',
      '💬 Always Reachable':        '💬 Toujours joignables',
      'Questions before, during, or after your tour - we\'re on WhatsApp and email, usually within the hour.':
        'Des questions avant, pendant ou après votre tour ? Nous sommes sur WhatsApp et par courriel, habituellement en moins d\'une heure.',

      // Tours page
      'All Experiences':           'Toutes les expériences',
      'Our Experiences':           'Nos expériences',
      'All experiences depart from Cancun, Playa del Carmen or Tulum.':
        'Toutes les expériences partent de Cancún, Playa del Carmen ou Tulum.',
      '100% private - just your group.': '100 % privé — juste votre groupe.',
      'Certified guides, newest vans, zero shared groups. Price drops as your group grows.':
        'Guides certifiés, fourgonnettes neuves, aucun groupe partagé. Le prix baisse avec la taille de votre groupe.',

      // Misc inclusions
      'Tips':                      'Pourboires',
      'Lunch':                     'Déjeuner',
      'Hotel pick-up & drop-off':  'Prise en charge et retour à l\'hôtel',
      'Private van with A/C':      'Fourgonnette privée avec climatisation',
      'Certified guide':           'Guide certifié',
      'Certified bilingual guide': 'Guide bilingue certifié',
      'Professional photos':       'Photos professionnelles',
      'Snorkel gear & life vests': 'Équipement de plongée et gilets de sauvetage',
      'Snorkel gear':              'Équipement de plongée',
      'Home':                      'Accueil',
      'Tours':                     'Tours',
      '/person':                   '/personne',

      // Welcome page
      'Choose your language':      'Choisissez votre langue',
      'Continue in English':       'Continue in English',
      'Continuer en français':     'Continuer en français',
      'Continuar en español':      'Continuar en español',

      // Shared tour labels
      '(Shared experience)':       '(Expérience partagée)',

      // Tour specific descriptions — abbreviated for key tours
      'Gentle sea turtle snorkeling followed by three crystal-clear cenotes hidden in the jungle.':
        'Plongée en apnée avec des tortues de mer suivie de trois cénotes cristallines cachées dans la jungle.',
      'Walk the stunning clifftop ruins of Tulum, snorkel with turtles, cool off in two beautiful cenotes.':
        'Explorez les ruines spectaculaires de Tulum sur la falaise, nagez avec les tortues, rafraîchissez-vous dans deux magnifiques cénotes.',
      'Dive into four different cenotes then rappel into a cavern chamber for a true wow moment.':
        'Plongez dans quatre cénotes différentes, puis descendez en rappel dans une caverne pour un moment époustouflant.',
      'Explore iconic Tulum ruins with a certified guide - ocean views, great photos, relaxed history walk.':
        'Explorez les ruines emblématiques de Tulum avec un guide certifié — vues sur l\'océan, belles photos, promenade historique détendue.',
      'Two Mayan sites in one epic day. Cenote zipline and a local buffet included.':
        'Deux sites mayas en une journée épique. Tyrolienne dans un cénote et buffet local inclus.',
      'Bike through jungle ruins with expert guides, zipline into a cenote, enjoy a regional buffet.':
        'Pédalez à travers les ruines de la jungle avec des guides experts, tyrolienne dans un cénote, savourez un buffet régional.',
      'See the UNESCO Wonder with an expert guide who makes every pyramid come alive.':
        'Voyez la merveille UNESCO avec un guide expert qui fait revivre chaque pyramide.',
      'Two UNESCO wonders in one well-paced day - the ultimate Yucatán experience.':
        'Deux merveilles UNESCO en une journée bien rythmée — l\'expérience ultime du Yucatán.',
      'Private speedboat to dreamy Holbox islands. White sandbars, beach club buffet with open bar.':
        'Bateau rapide privé vers les îles de rêve de Holbox. Bancs de sable blanc, buffet au club de plage avec bar ouvert.',
      'Cruise the Sian Ka\'an UNESCO reserve spotting dolphins, turtles, and reef life.':
        'Naviguez dans la réserve UNESCO de Sian Ka\'an en observant dauphins, tortues et vie marine.',
      'Authentic tacos, mezcal, tequila, and a lively night in Playa del Carmen with a local guide.':
        'Tacos authentiques, mezcal, tequila et une soirée animée à Playa del Carmen avec un guide local.',
      'Private fishing charter with expert captains. Fresh ceviche made on board.':
        'Sortie de pêche privée avec des capitaines experts. Ceviche frais préparé à bord.',
    },

    es: {
      // Nav
      'Private Experiences':       'Experiencias privadas',
      'Shared Experiences':        'Experiencias compartidas',
      'Reviews':                   'Reseñas',
      'Our Story':                 'Nuestra historia',
      'Contact':                   'Contacto',
      'Book Now':                  'Reservar',
      'Book Now →':                'Reservar →',
      'Book on WhatsApp':          'Reservar en WhatsApp',
      '💬 Book on WhatsApp':       '💬 Reservar en WhatsApp',

      // Hero
      'Cancun - Tulum - Playa del Carmen': 'Cancún – Tulum – Playa del Carmen',
      'Go Beyond':                 'Ve más allá',
      'the Tourist':               'del turista',
      'Riviera Maya.':             'Riviera Maya.',
      'Dive into cenotes. Swim with turtles. Walk ancient Mayan ruins. Eat where locals eat. Private and shared experiences designed for those who want the real local experience.':
        'Sumérgete en cenotes. Nada con tortugas. Camina por ruinas mayas. Come donde comen los locales. Experiencias privadas y compartidas diseñadas para quienes quieren la experiencia local real.',
      'Explore Experiences':       'Explorar experiencias',
      'WhatsApp Us':               'Escríbenos por WhatsApp',
      'Years Experience':          'Años de experiencia',
      'Guest Rating':              'Calificación',
      'Local Experience':          'Experiencia local',

      // Values section
      'Our Values':                'Nuestros valores',
      'Go beyond the ordinary.':   'Ve más allá de lo ordinario.',
      'Discover the real Riviera Maya through local flavors, genuine culture, and unforgettable places experienced the way they should be with freedom, depth, and no rush':
        'Descubre la verdadera Riviera Maya a través de sabores locales, cultura auténtica y lugares inolvidables vividos como deben ser: con libertad, profundidad y sin prisas',
      'Photos Included':           'Fotos incluidas',
      'Your guide captures professional photos on every private experience - always free.':
        'Tu guía toma fotos profesionales en cada experiencia privada — siempre gratis.',
      'Your Schedule':             'Tu horario',
      'Pick your start time, move at your pace - no group pickups or rushing on your private experience.':
        'Elige tu hora de salida, muévete a tu ritmo — sin recogidas de grupo ni prisas.',
      'Brand New Vans':            'Camionetas nuevas',
      'Cold A/C, leather seats, professional drivers. Newest fleet in the Riviera Maya.':
        'Aire acondicionado, asientos de piel, conductores profesionales. La flota más nueva de la Riviera Maya.',
      'Safe Food':                 'Comida segura',
      'Fresh meals adapted for vegan, gluten-free, allergies and special requests.':
        'Comidas frescas adaptadas para veganos, sin gluten, alergias y solicitudes especiales.',
      'Certified Guides':          'Guías certificados',
      'Licensed, bilingual guides with 14+ years of safety-first expertise.':
        'Guías bilingües certificados con más de 14 años de experiencia, seguridad ante todo.',
      'Zero Hidden Fees':          'Cero cargos ocultos',
      'Transfers, tickets, timing - all included upfront. No surprises, ever.':
        'Traslados, boletos, horarios — todo incluido desde el principio. Sin sorpresas, nunca.',

      // Private tours
      'Our Top Experiences.':      'Nuestras mejores experiencias.',
      '100% private. Only you and the people you choose. Certified guides, newest vans, zero shared groups.':
        '100% privado. Solo tú y las personas que elijas. Guías certificados, camionetas nuevas, cero grupos compartidos.',
      'View All Experiences →':    'Ver todas las experiencias →',

      // Shared tours
      'Budget-friendly adventures.': 'Aventuras económicas.',
      'Small group tours at great value. Same certified guides, same incredible destinations.':
        'Tours en grupo pequeño a gran precio. Los mismos guías certificados, los mismos destinos increíbles.',

      // Reviews
      'Guest Stories':             'Historias de huéspedes',
      '5 stars, every time.':      '5 estrellas, siempre.',
      '5.0 · Riviera Maya\'s top-rated private tours':
        '5.0 · Los tours privados mejor calificados de la Riviera Maya',
      'Read All 13 Reviews →':    'Leer las 13 reseñas →',
      '5 Stars, Every Time':       '5 estrellas, siempre',
      'Real reviews from real travelers.':
        'Reseñas reales de viajeros reales.',
      '5.0 · 13 reviews · Top-rated in Riviera Maya':
        '5.0 · 13 reseñas · Los mejor calificados en la Riviera Maya',

      // Contact
      'Get In Touch':              'Contáctanos',
      'Let\'s plan your':          'Planifiquemos tu',
      'perfect day.':              'día perfecto.',
      'Quick response guaranteed - usually within the hour.':
        'Respuesta rápida garantizada — generalmente en menos de una hora.',
      'WhatsApp':                  'WhatsApp',
      'Chat directly with our team and get your personalized quote in minutes.':
        'Chatea directamente con nuestro equipo y obtén tu cotización personalizada en minutos.',
      'Open WhatsApp →':           'Abrir WhatsApp →',
      'Email':                     'Correo electrónico',
      'Send your dates, group size & interests and we\'ll reply with a custom quote.':
        'Envía tus fechas, tamaño del grupo e intereses y te responderemos con una cotización personalizada.',
      'Send Email →':              'Enviar correo →',

      // Custom request form
      'Custom Request':            'Solicitud personalizada',
      'Tell us your dream day':    'Cuéntanos tu día soñado',
      'Share your idea and we\'ll send a personalized quote within a few hours.':
        'Comparte tu idea y te enviaremos una cotización personalizada en pocas horas.',
      'Your Name':                 'Tu nombre',
      'Phone / WhatsApp':          'Teléfono / WhatsApp',
      'Your Dream Day':            'Tu día soñado',
      'Send My Request →':         'Enviar mi solicitud →',
      'We got your message!':      '¡Recibimos tu mensaje!',
      'We\'ll reply within hours. Check your WhatsApp too!':
        'Responderemos en pocas horas. ¡Revisa también tu WhatsApp!',

      // Footer
      'Private & shared tours in Cancun, Tulum, Playa del Carmen & the Riviera Maya. 14+ years of unforgettable experiences.':
        'Tours privados y compartidos en Cancún, Tulum, Playa del Carmen y la Riviera Maya. Más de 14 años de experiencias inolvidables.',
      'Private & shared experiences in Cancun, Tulum, Playa del Carmen & the Riviera Maya. 14+ years of unforgettable experiences.':
        'Experiencias privadas y compartidas en Cancún, Tulum, Playa del Carmen y la Riviera Maya. Más de 14 años de experiencias inolvidables.',
      'Explore':                   'Explorar',
      'Guest Reviews':             'Reseñas de huéspedes',
      'Destinations':              'Destinos',
      'Cancun Tours':              'Tours en Cancún',
      'Tulum Tours':               'Tours en Tulum',
      'Playa del Carmen Tours':    'Tours en Playa del Carmen',
      'Riviera Maya Tours':        'Tours en la Riviera Maya',

      // Tour detail shared
      'About This Experience':     'Sobre esta experiencia',
      'What\'s Included & Not Included': 'Qué incluye y qué no',
      '✓ Included':                '✓ Incluido',
      '✕ Not Included':            '✕ No incluido',
      'Starting from':             'Desde',
      'Price drops as you add guests · No payment here':
        'El precio baja al agregar invitados · Sin pago aquí',
      'Fixed shared tour price · No payment here':
        'Precio fijo de tour compartido · Sin pago aquí',
      'Number of guests':          'Número de invitados',
      'Price per person':          'Precio por persona',
      'Total price':               'Precio total',
      '💡 Price drops automatically as group grows':
        '💡 El precio baja automáticamente al crecer el grupo',
      'Full Name *':               'Nombre completo *',
      'Email *':                   'Correo electrónico *',
      'Preferred Date':            'Fecha preferida',
      'Hotel / Pick-up Location':  'Hotel / Lugar de recogida',
      'Special Requests':          'Solicitudes especiales',
      'Request to Book →':         'Solicitar reservación →',
      'No payment collected here. We confirm availability and follow up right away.':
        'No se cobra aquí. Confirmamos disponibilidad y te contactamos de inmediato.',
      'Request Sent!':             '¡Solicitud enviada!',
      'We\'ll confirm availability and reach out within a few hours. Check your WhatsApp too!':
        'Confirmaremos disponibilidad y te contactaremos en pocas horas. ¡Revisa también tu WhatsApp!',
      '← See More Tours':         '← Ver más tours',
      'Keep Exploring':            'Sigue explorando',
      'Guests also loved':         'Los huéspedes también amaron',
      'Details':                   'Detalles',
      'Price on request':          'Precio a consultar',
      'Contact us for a custom quote.': 'Contáctanos para una cotización personalizada.',
      'Price depends on group size and date. Contact us for a custom quote.':
        'El precio depende del tamaño del grupo y la fecha. Contáctanos para una cotización.',

      // Tour card labels
      'Top Pick':                  'Favorito',
      'Best Seller':               'Más vendido',
      'New Route':                 'Nueva ruta',
      'Quick Escape':              'Escapada rápida',
      'All-Day Epic':              'Épico de todo el día',
      'History Rich':              'Rico en historia',
      'UNESCO':                    'UNESCO',
      'Epic Circuit':              'Circuito épico',
      'Island Life':               'Vida isleña',
      'UNESCO Reserve':            'Reserva UNESCO',
      'Foodie Fave':               'Favorito gastronómico',
      'Private Boat':              'Bote privado',
      'Budget Friendly':           'Económico',
      'Best Value':                'Mejor valor',
      'Half day':                  'Medio día',
      'Full day':                  'Día completo',
      'Evening':                   'Noche',

      // Our Story
      'Born in the Riviera Maya':  'Nacida en la Riviera Maya',
      '14+ years of private experiences, certified guides, and unforgettable moments.':
        'Más de 14 años de experiencias privadas, guías certificados y momentos inolvidables.',
      'Who We Are':                'Quiénes somos',
      'More than a tour company.': 'Más que una empresa de tours.',
      'What makes us different.':  'Lo que nos hace diferentes.',
      'Years serving the Riviera Maya': 'Años sirviendo a la Riviera Maya',
      'Private experiences - always just your group': 'Experiencias privadas — siempre solo tu grupo',
      'Rating across all platforms': 'Calificación en todas las plataformas',
      'Book Your Tour →':          'Reserva tu tour →',

      '🐢 Safety First, Always':   '🐢 Seguridad ante todo, siempre',
      'Every guide is certified, every vehicle inspected, every activity safe. Your wellbeing is our highest priority.':
        'Cada guía está certificado, cada vehículo inspeccionado, cada actividad es segura. Tu bienestar es nuestra máxima prioridad.',
      '📸 Memories That Last':      '📸 Recuerdos que perduran',
      'We capture professional photos on every tour at no extra charge. Real memories, not stock photos.':
        'Tomamos fotos profesionales en cada tour sin costo adicional. Recuerdos reales, no fotos de archivo.',
      '🌿 Responsible Tourism':     '🌿 Turismo responsable',
      'We respect wildlife, support local businesses, and ensure our tours leave nature exactly as we found it.':
        'Respetamos la fauna, apoyamos negocios locales y nos aseguramos de que nuestros tours dejen la naturaleza exactamente como la encontramos.',
      '💬 Always Reachable':        '💬 Siempre disponibles',
      'Questions before, during, or after your tour - we\'re on WhatsApp and email, usually within the hour.':
        '¿Preguntas antes, durante o después de tu tour? Estamos en WhatsApp y correo, generalmente en menos de una hora.',

      // Tours page
      'All Experiences':           'Todas las experiencias',
      'Our Experiences':           'Nuestras experiencias',
      'All experiences depart from Cancun, Playa del Carmen or Tulum.':
        'Todas las experiencias salen de Cancún, Playa del Carmen o Tulum.',
      '100% private - just your group.': '100% privado — solo tu grupo.',
      'Certified guides, newest vans, zero shared groups. Price drops as your group grows.':
        'Guías certificados, camionetas nuevas, cero grupos compartidos. El precio baja con el tamaño de tu grupo.',

      // Common inclusions
      'Tips':                      'Propinas',
      'Lunch':                     'Almuerzo',
      'Hotel pick-up & drop-off':  'Recogida y regreso al hotel',
      'Private van with A/C':      'Camioneta privada con A/C',
      'Certified guide':           'Guía certificado',
      'Certified bilingual guide': 'Guía bilingüe certificado',
      'Professional photos':       'Fotos profesionales',
      'Snorkel gear & life vests': 'Equipo de snorkel y chalecos salvavidas',
      'Snorkel gear':              'Equipo de snorkel',
      'Home':                      'Inicio',
      'Tours':                     'Tours',
      '/person':                   '/persona',

      '(Shared experience)':       '(Experiencia compartida)',

      // Tour descriptions
      'Gentle sea turtle snorkeling followed by three crystal-clear cenotes hidden in the jungle.':
        'Snorkel con tortugas marinas seguido de tres cenotes cristalinos escondidos en la selva.',
      'Walk the stunning clifftop ruins of Tulum, snorkel with turtles, cool off in two beautiful cenotes.':
        'Camina por las impresionantes ruinas de Tulum en el acantilado, nada con tortugas, refréscate en dos hermosos cenotes.',
      'Dive into four different cenotes then rappel into a cavern chamber for a true wow moment.':
        'Sumérgete en cuatro cenotes diferentes y luego desciende en rappel a una caverna para un momento impresionante.',
      'Explore iconic Tulum ruins with a certified guide - ocean views, great photos, relaxed history walk.':
        'Explora las icónicas ruinas de Tulum con un guía certificado — vistas al mar, fotos increíbles, paseo histórico relajado.',
      'Two Mayan sites in one epic day. Cenote zipline and a local buffet included.':
        'Dos sitios mayas en un día épico. Tirolesa en cenote y buffet local incluidos.',
      'Bike through jungle ruins with expert guides, zipline into a cenote, enjoy a regional buffet.':
        'Pedalea por ruinas en la selva con guías expertos, tirolesa en cenote, disfruta un buffet regional.',
      'See the UNESCO Wonder with an expert guide who makes every pyramid come alive.':
        'Conoce la maravilla UNESCO con un guía experto que hace que cada pirámide cobre vida.',
      'Two UNESCO wonders in one well-paced day - the ultimate Yucatán experience.':
        'Dos maravillas UNESCO en un día bien organizado — la experiencia definitiva del Yucatán.',
      'Private speedboat to dreamy Holbox islands. White sandbars, beach club buffet with open bar.':
        'Lancha rápida privada a las islas soñadas de Holbox. Bancos de arena blanca, buffet en club de playa con barra libre.',
      'Cruise the Sian Ka\'an UNESCO reserve spotting dolphins, turtles, and reef life.':
        'Navega por la reserva UNESCO de Sian Ka\'an observando delfines, tortugas y vida marina.',
      'Authentic tacos, mezcal, tequila, and a lively night in Playa del Carmen with a local guide.':
        'Tacos auténticos, mezcal, tequila y una noche animada en Playa del Carmen con un guía local.',
      'Private fishing charter with expert captains. Fresh ceviche made on board.':
        'Charter de pesca privado con capitanes expertos. Ceviche fresco preparado a bordo.',

      // Welcome page
      'Choose your language':      'Elige tu idioma',
      'Continue in English':       'Continue in English',
      'Continuer en français':     'Continuer en français',
      'Continuar en español':      'Continuar en español',
    }
  };

  var dict = shared[lang];
  if (!dict) return;

  /* ──────────── DOM walker ──────────── */
  var SKIP = { SCRIPT:1, STYLE:1, NOSCRIPT:1, SVG:1, CANVAS:1, IMG:1, INPUT:1, TEXTAREA:1, SELECT:1 };

  function walk(node) {
    if (!node) return;
    var tag = node.nodeName;

    // text node
    if (node.nodeType === 3) {
      var raw = node.nodeValue;
      var trimmed = raw.trim();
      if (!trimmed) return;

      // exact match
      if (dict[trimmed] !== undefined) {
        node.nodeValue = raw.replace(trimmed, dict[trimmed]);
        return;
      }

      // partial matches for compound strings (e.g. "From $119 /person")
      // translate "/person" suffix
      if (trimmed.indexOf('/person') !== -1 && dict['/person']) {
        node.nodeValue = raw.replace('/person', dict['/person']);
      }

      // translate "⏱ Half day" etc inside badge/duration spans
      for (var key in dict) {
        if (key.length > 3 && trimmed.indexOf(key) !== -1) {
          node.nodeValue = raw.replace(key, dict[key]);
          raw = node.nodeValue;   // chain replacements
        }
      }
      return;
    }

    // element node
    if (node.nodeType !== 1) return;
    if (SKIP[tag]) return;

    // translate placeholder attributes
    if (node.placeholder) {
      var ph = node.placeholder.trim();
      if (dict[ph]) node.placeholder = dict[ph];
    }

    // translate aria-label
    if (node.getAttribute && node.getAttribute('aria-label')) {
      var al = node.getAttribute('aria-label').trim();
      if (dict[al]) node.setAttribute('aria-label', dict[al]);
    }

    // recurse children
    var kids = node.childNodes;
    for (var i = 0; i < kids.length; i++) {
      walk(kids[i]);
    }
  }

  /* ──────────── run translation ──────────── */
  // Run as soon as DOM is available
  function translate() {
    walk(document.body);

    // Also translate <title>
    var titleEl = document.querySelector('title');
    if (titleEl) {
      var t = titleEl.textContent;
      // Replace "Private Tour" / "Shared experience" etc in titles
      if (lang === 'fr') {
        t = t.replace('Private Tour', 'Tour privé')
             .replace('Shared experience', 'Expérience partagée')
             .replace('Guest Reviews', 'Avis clients')
             .replace('Our Story', 'Notre histoire')
             .replace('All Experiences', 'Toutes les expériences')
             .replace('Real Local Experiences', 'Vraies expériences locales');
      } else if (lang === 'es') {
        t = t.replace('Private Tour', 'Tour privado')
             .replace('Shared experience', 'Experiencia compartida')
             .replace('Guest Reviews', 'Reseñas de huéspedes')
             .replace('Our Story', 'Nuestra historia')
             .replace('All Experiences', 'Todas las experiencias')
             .replace('Real Local Experiences', 'Experiencias locales reales');
      }
      titleEl.textContent = t;
    }

    // Translate select option text (guest selectors)
    document.querySelectorAll('option').forEach(function(opt) {
      var txt = opt.textContent.trim();
      if (lang === 'fr') {
        opt.textContent = txt.replace('guests', 'invités').replace('guest', 'invité');
      } else if (lang === 'es') {
        opt.textContent = txt.replace('guests', 'invitados').replace('guest', 'invitado');
      }
    });
  }

  // Run immediately if DOM ready, otherwise on DOMContentLoaded
  if (document.body) {
    translate();
  } else {
    document.addEventListener('DOMContentLoaded', translate);
  }

  // Also re-translate after dynamic content loads (sliders build dots, options, etc.)
  // Use a MutationObserver on a short timer
  var reTransTimer = null;
  var observer = new MutationObserver(function () {
    clearTimeout(reTransTimer);
    reTransTimer = setTimeout(translate, 120);
  });
  function startObserving() {
    observer.observe(document.body, { childList: true, subtree: true });
    // Stop observing after 8 seconds to save perf
    setTimeout(function () { observer.disconnect(); }, 8000);
  }
  if (document.body) startObserving();
  else document.addEventListener('DOMContentLoaded', startObserving);

})();
