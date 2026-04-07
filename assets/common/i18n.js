/* =========================================================
   BTR i18n – Zero-flash multilingual engine
   Loaded synchronously (no defer/async) so translations
   apply before the browser gets a chance to paint.
   ========================================================= */
(function (win, doc) {
  'use strict';

  /* ── Detect & persist language ─────────────────────────── */
  var LANG = win._btrLang ||
    (function () {
      try { return localStorage.getItem('btrPreferredLanguage') || 'en'; }
      catch (e) { return 'en'; }
    })();
  win._btrLang = LANG;

  /* ── Helpers ──────────────────────────────────────────── */
  function $(sel) { return doc.querySelectorAll(sel); }
  function setText(sel, txt) {
    if (!txt) return;
    var els = $(sel);
    for (var i = 0; i < els.length; i++) els[i].textContent = txt;
  }
  function setHTML(sel, html) {
    if (!html) return;
    var els = $(sel);
    for (var i = 0; i < els.length; i++) els[i].innerHTML = html;
  }
  function setAttr(sel, attr, val) {
    if (!val) return;
    var els = $(sel);
    for (var i = 0; i < els.length; i++) els[i].setAttribute(attr, val);
  }
  function setPlaceholder(sel, val) { setAttr(sel, 'placeholder', val); }

  /* Apply data-i18n textContent translations */
  function applyDataAttrs(T) {
    var els = $('[data-i18n]');
    for (var i = 0; i < els.length; i++) {
      var key = els[i].getAttribute('data-i18n');
      if (T[key] !== undefined) els[i].textContent = T[key];
    }
    var hels = $('[data-i18n-html]');
    for (var j = 0; j < hels.length; j++) {
      var hkey = hels[j].getAttribute('data-i18n-html');
      if (T[hkey] !== undefined) hels[j].innerHTML = T[hkey];
    }
    var pels = $('[data-i18n-ph]');
    for (var k = 0; k < pels.length; k++) {
      var pkey = pels[k].getAttribute('data-i18n-ph');
      if (T[pkey] !== undefined) pels[k].setAttribute('placeholder', T[pkey]);
    }
  }

  /* ── Language switcher ────────────────────────────────── */
  function setupSwitcher() {
    var btns = $('.ls-btn');
    for (var i = 0; i < btns.length; i++) {
      (function (btn) {
        var bl = btn.getAttribute('data-lang');
        if (bl === LANG) btn.classList.add('active');
        btn.addEventListener('click', function () {
          try { localStorage.setItem('btrPreferredLanguage', bl); } catch (e) {}
          win.location.reload();
        });
      })(btns[i]);
    }
  }

  /* ── All translations ─────────────────────────────────── */
  var T = {

    /* ==================================================
       FRENCH
    ================================================== */
    fr: {

      /* ── Common: Navigation ── */
      'c.nav.private':  'Expériences Privées',
      'c.nav.shared':   'Expériences Partagées',
      'c.nav.reviews':  'Avis',
      'c.nav.story':    'Notre Histoire',
      'c.nav.contact':  'Contact',
      'c.nav.book':     'Réserver',
      'c.mob.private':  'Expériences Privées',
      'c.mob.shared':   'Expériences Partagées',
      'c.mob.reviews':  'Avis',
      'c.mob.story':    'Notre Histoire',
      'c.mob.contact':  'Contact',
      'c.mob.wa':       'Réserver sur WhatsApp',

      /* ── Common: Footer ── */
      'c.ft.tagline':   'Expériences privées et partagées à Cancun, Tulum, Playa del Carmen et la Riviera Maya. Plus de 14 ans d\'expériences inoubliables.',
      'c.ft.explore':   'Explorer',
      'c.ft.contact':   'Contact',
      'c.ft.dest':      'Destinations',
      'c.ft.private':   'Expériences Privées',
      'c.ft.shared':    'Expériences Partagées',
      'c.ft.reviews':   'Avis des Clients',
      'c.ft.story':     'Notre Histoire',
      'c.ft.cancun':    'Visites à Cancun',
      'c.ft.tulum':     'Visites à Tulum',
      'c.ft.playa':     'Visites à Playa del Carmen',
      'c.ft.riviera':   'Riviera Maya',
      'c.ft.copy':      '© 2025 Beyond the Reef Mexico. Tous droits réservés.',

      /* ── Common: Buttons ── */
      'c.btn.details':  'Détails',
      'c.btn.book':     'Réserver →',
      'c.btn.wa':       'Ouvrir WhatsApp →',
      'c.btn.email':    'Envoyer un Email →',
      'c.btn.allrev':   'Lire tous les 13 avis →',
      'c.btn.moretours':'← Voir plus d\'excursions',
      'c.btn.explore':  'Explorer les Expériences',
      'c.per.person':   '/personne',

      /* ── Common: Booking form (shared across all tour pages) ── */
      'c.bk.about':     'À propos de l\'Expérience',
      'c.bk.included':  'Inclus & Non Inclus',
      'c.bk.inc.lbl':   '✓ Inclus',
      'c.bk.notinc.lbl':'✕ Non Inclus',
      'c.bk.from':      'À partir de',
      'c.bk.pricedrop': 'Le prix baisse avec le groupe · Aucun paiement ici',
      'c.bk.guests':    'Nombre de personnes',
      'c.bk.pp':        'Prix par personne',
      'c.bk.total':     'Prix total',
      'c.bk.hint':      '💡 Le prix baisse automatiquement avec le groupe',
      'c.bk.name':      'Nom Complet *',
      'c.bk.email':     'Email *',
      'c.bk.phone':     'Téléphone / WhatsApp',
      'c.bk.date':      'Date Souhaitée',
      'c.bk.hotel':     'Hôtel / Lieu de Prise en Charge',
      'c.bk.notes':     'Demandes Spéciales',
      'c.bk.submit':    'Demander la Réservation →',
      'c.bk.disclaimer':'Aucun paiement ici. Nous confirmons les disponibilités et vous revenons rapidement.',
      'c.bk.success.title': 'Demande Envoyée !',
      'c.bk.success.text':  'Nous confirmons les disponibilités et vous contactons dans les prochaines heures. Vérifiez aussi votre WhatsApp !',
      'c.bk.success.link':  '← Voir plus d\'excursions',
      'c.bk.name.ph':   'Jean et Marie',
      'c.bk.hotel.ph':  'Nom de l\'hôtel ou adresse',
      'c.bk.notes.ph':  'Régimes alimentaires, accessibilité…',
      'c.bk.email.ph':  'vous@email.com',
      'c.bk.phone.ph':  '+33 6 00 00 00 00',

      /* ── Common: section keep-exploring ── */
      'c.sec.keep':     'Continuer à Explorer',
      'c.sec.loved':    'Les clients ont aussi aimé',
      'c.bc.home':      'Accueil',
      'c.bc.tours':     'Excursions',

      /* ── INDEX: Hero ── */
      'i.hero.pill':    'Cancun · Tulum · Playa del Carmen',
      'i.hero.h1.1':    'Allez au-delà',
      'i.hero.h1.2':    'du Tourisme,',
      'i.hero.h1.3':    'Riviera Maya.',
      'i.hero.sub':     'Plongez dans des cénotes cachés. Nagez avec des tortues de mer. Explorez d\'anciennes ruines mayas. Mangez où mangent les locaux. Des expériences privées et partagées pour les voyageurs qui veulent vivre la vraie Riviera Maya.',
      'i.hero.explore': 'Explorer les Expériences',
      'i.hero.wa':      'WhatsApp',
      'i.stats.years':  'Ans d\'Expérience',
      'i.stats.rating': 'Note Clients',
      'i.stats.local':  'Expérience Locale',

      /* ── INDEX: Values ── */
      'i.val.lbl':      'Nos Valeurs sur l\'Expérience Privée',
      'i.val.h2':       'Allez au-delà de l\'ordinaire.',
      'i.val.sub':      'Découvrez la Riviera Maya comme elle se doit d\'être vécue. Vraie gastronomie. Vraie culture. Des endroits inoubliables. Plus de liberté. Plus de profondeur. Sans précipitation.',
      'i.val.photos':   'Photos Incluses',
      'i.val.photos.d': 'Des photos professionnelles sont prises lors de chaque expérience privée, pour que vous restiez dans le moment et repartiez avec des souvenirs impérissables.',
      'i.val.sched':    'Votre Rythme',
      'i.val.sched.d':  'Pas d\'horaire de groupe fixe. Pas d\'arrêts précipités. Juste la liberté de commencer quand vous voulez et de profiter de la journée à votre rythme.',
      'i.val.comfort':  'Confort à Chaque Trajet',
      'i.val.comfort.d':'Des vans modernes propres, climatisation, sièges en cuir et chauffeurs professionnels rendent chaque partie du voyage agréable et confortable.',
      'i.val.food':     'Options Alimentaires Fraîches et Flexibles',
      'i.val.food.d':   'Les repas peuvent être préparés pour végétaliens, sans gluten, allergies et autres demandes spéciales, avec le même soin apporté à chaque aspect de l\'expérience.',
      'i.val.hosts':    'Des Guides en Qui Vous Pouvez Avoir Confiance',
      'i.val.hosts.d':  'Nos guides bilingues certifiés apportent plus de 14 ans d\'expérience, de connaissance locale et une priorité absolue à la sécurité à chaque journée.',
      'i.val.price':    'Tarifs Transparents',
      'i.val.price.d':  'Ce qui est inclus est clair dès le début. Transport, droits d\'entrée et planification sont pris en charge dès le départ, sans frais cachés.',

      /* ── INDEX: Sections ── */
      'i.priv.lbl':     'Expériences Privées',
      'i.priv.h2':      'Nos Meilleures Expériences, Conçues pour Vous',
      'i.priv.sub':     'Seulement vous et votre groupe. Pas de précipitation, pas de groupes partagés, juste une expérience plus personnelle de la Riviera Maya à votre rythme.',
      'i.shar.lbl':     'Expériences Partagées',
      'i.shar.h2':      'Vivez Plus, Dépensez Moins',
      'i.shar.sub':     'Des expériences de groupe à prix accessible avec nos guides experts. Idéal pour les voyageurs solos, les couples et les petits groupes.',
      'i.rev.lbl':      'Témoignages',
      'i.rev.h2':       '5 étoiles, à chaque fois.',
      'i.rev.rating':   '5.0 · Visites privées les mieux notées de la Riviera Maya',

      /* ── INDEX: Contact ── */
      'i.ct.lbl':       'Contactez-Nous',
      'i.ct.h2':        'Planifions votre\njournée parfaite.',
      'i.ct.sub':       'Réponse rapide garantie — généralement en moins d\'une heure.',
      'i.ct.wa.t':      'WhatsApp',
      'i.ct.wa.d':      'Discutez directement avec notre équipe et obtenez votre devis personnalisé en quelques minutes.',
      'i.ct.em.t':      'Email',
      'i.ct.em.d':      'Envoyez vos dates, taille du groupe et intérêts et nous répondrons avec un devis personnalisé.',

      /* ── INDEX: Custom form ── */
      'i.frm.lbl':      'Demande Personnalisée',
      'i.frm.h2':       'Créez votre journée parfaite en Riviera Maya',
      'i.frm.p1':       'Vous ne trouvez pas exactement ce que vous cherchez ? Pas de problème. Nous pouvons personnaliser toute expérience privée, adapter le programme à votre groupe, ou créer quelque chose de complètement unique ensemble.',
      'i.frm.p2':       'Partagez simplement vos idées avec nous et nous vous enverrons un devis personnalisé dans les prochaines heures.',
      'i.frm.name':     'Votre Prénom',
      'i.frm.email':    'Email',
      'i.frm.phone':    'Téléphone / WhatsApp',
      'i.frm.msg':      'Votre Journée Idéale',
      'i.frm.submit':   'Envoyer Ma Demande →',
      'i.frm.suc.t':    'Message Reçu !',
      'i.frm.suc.p':    'Nous répondons dans les prochaines heures. Vérifiez aussi votre WhatsApp !',
      'i.frm.name.ph':  'ex. Jean et Marie',
      'i.frm.msg.ph':   'Dates, taille du groupe, activités, régimes alimentaires…',
      'i.frm.phone.ph': '+33 6 00 00 00 00',

      /* ── Tour pages: per-tour content ── */
      'tp.turtle.title': 'Snorkeling Tortues Marines et Cénotes',
      'tp.turtle.sub':   'Tortues Marines · 3 Cénotes · Collation et Boissons',
      'tp.turtle.about': 'Nagez avec des tortues marines sauvages dans leur habitat naturel, puis découvrez trois cénotes cristallins cachés au cœur de la jungle. Cette expérience privée à la demi-journée comprend une collation et des boissons froides pour une journée parfaite.',
      'tp.turtle.chips': ['🐢 Tortues Marines', '💧 3 Cénotes', '🌿 Jungle', '⏱ Demi-journée', '👥 Privé', '📸 Photos Incluses'],
      'tp.turtle.inc':   ['Snorkeling avec tortues marines', 'Visite de 3 cénotes différents', 'Équipement de snorkeling', 'Collation et boissons froides', 'Transport privé A/C', 'Transfert hôtel inclus'],
      'tp.turtle.notinc':['Déjeuner', 'Pourboires', 'Droits d\'entrée éventuels'],

      'tp.tulumund.title': 'Expérience Snorkeling Tulum',
      'tp.tulumund.sub':   'Ruines de Tulum · Snorkeling Tortues · 2 Cénotes · Déjeuner',
      'tp.tulumund.about': 'Explorez les somptueuses ruines de Tulum en surplomb de la mer des Caraïbes, nagez avec des tortues marines sauvages et rafraîchissez-vous dans deux magnifiques cénotes. Déjeuner local inclus pour une journée complète et inoubliable.',
      'tp.tulumund.chips': ['🏛️ Ruines de Tulum', '🐢 Tortues Marines', '💧 2 Cénotes', '🍽️ Déjeuner', '⏱ Journée Complète', '👥 Privé', '📸 Photos Incluses'],
      'tp.tulumund.inc':   ['Visite guidée des ruines de Tulum', 'Snorkeling avec tortues marines', 'Visite de 2 cénotes', 'Déjeuner au restaurant local', 'Équipement de snorkeling', 'Transport privé A/C', 'Guide bilingue certifié'],
      'tp.tulumund.notinc':['Droits d\'entrée de Tulum (~25 USD)', 'Pourboires', 'Boissons supplémentaires'],

      'tp.cenotes.title': 'Cénotes Cachés Express',
      'tp.cenotes.sub':   '4 Cénotes · Rappel dans une Caverne · Collation et Bières',
      'tp.cenotes.about': 'Plongez dans quatre cénotes différents aux eaux cristallines, puis effectuez un rappel spectaculaire dans une chambre caverneuse secrète. Cette expérience à la demi-journée est idéale pour les amateurs d\'aventure.',
      'tp.cenotes.chips': ['💧 4 Cénotes', '🧗 Rappel', '🍺 Collation et Bières', '⏱ Demi-journée', '👥 Privé', '📸 Photos Incluses'],
      'tp.cenotes.inc':   ['Visite de 4 cénotes', 'Rappel dans une caverne', 'Collation et bières froides', 'Équipement de rappel', 'Transport privé A/C', 'Guide expert'],
      'tp.cenotes.notinc':['Déjeuner', 'Pourboires'],

      'tp.tulumexp.title': 'Points Forts de Tulum',
      'tp.tulumexp.sub':   'Ruines de Tulum · Guide Certifié · Boissons Comprises',
      'tp.tulumexp.about': 'Explorez les ruines emblématiques de Tulum perchées au-dessus de la mer des Caraïbes turquoise avec un guide bilingue certifié qui donne vie à chaque pyramide et temple. Vues iconiques, photos professionnelles et boissons fraîches inclus. Temps libre optionnel à Tulum ville.',
      'tp.tulumexp.chips': ['🏛️ Ruines de Tulum', '🌊 Vues sur l\'Océan', '🍺 Boissons Incluses', '⏱ Demi-journée (4h)', '👥 Privé', '📸 Photos Incluses'],
      'tp.tulumexp.inc':   ['Visite guidée des ruines de Tulum', 'Boissons fraîches incluses', 'Photos professionnelles', 'Guide bilingue certifié', 'Van privé avec A/C', 'Transfert hôtel inclus'],
      'tp.tulumexp.notinc':['Droit d\'entrée de Tulum (~25 USD)', 'Déjeuner', 'Pourboires'],

      'tp.tulumcoba.title': 'Tulum et Ruines de Cobá',
      'tp.tulumcoba.sub':   'Ruines de Tulum · Ruines de Cobá · Cénote · Buffet Local',
      'tp.tulumcoba.about': 'Deux sites mayas légendaires en une seule journée épique. Explorez les ruines de Tulum face à la mer, puis grimpez la grande pyramide de Cobá. Un cénote rafraîchissant et un buffet régional complètent cette aventure inoubliable.',
      'tp.tulumcoba.chips': ['🏛️ Ruines de Tulum', '🗿 Ruines de Cobá', '💧 Cénote', '🍽️ Buffet Local', '⏱ Journée Complète', '👥 Privé'],
      'tp.tulumcoba.inc':   ['Visite des ruines de Tulum', 'Visite des ruines de Cobá', 'Baignade dans un cénote', 'Buffet local inclus', 'Transport privé A/C', 'Guide bilingue certifié'],
      'tp.tulumcoba.notinc':['Droits d\'entrée Tulum (~25 USD)', 'Droits d\'entrée Cobá (~10 USD)', 'Pourboires'],

      'tp.coba.title': 'Expérience Cobá',
      'tp.coba.sub':   'Ruines de Cobá · Vélo · Cénote · Buffet Régional',
      'tp.coba.about': 'Pédalez à travers les ruines envahies par la jungle jusqu\'à la base de la grande pyramide avec des guides experts. Baignez-vous dans un magnifique cénote et savourez un buffet régional authentique pour une journée riche en histoire.',
      'tp.coba.chips': ['🗿 Ruines de Cobá', '🚲 Vélo', '💧 Cénote', '🍽️ Buffet Régional', '⏱ Journée Complète', '👥 Privé'],
      'tp.coba.inc':   ['Visite guidée des ruines de Cobá', 'Location de vélo', 'Baignade dans un cénote', 'Buffet régional inclus', 'Transport privé A/C', 'Guide archéologique'],
      'tp.coba.notinc':['Droit d\'entrée Cobá (~10 USD)', 'Pourboires'],

      'tp.chichen.title': 'Expérience Chichén Itzá',
      'tp.chichen.sub':   'Chichén Itzá · Tyrolienne Cénote · Buffet Local',
      'tp.chichen.about': 'Visitez l\'une des Sept Merveilles du Monde avec un guide expert passionné, profitez d\'une tyrolienne au-dessus d\'un magnifique cénote et savourez un buffet local savoureux. Une journée mémorable entre histoire et aventure.',
      'tp.chichen.chips': ['🏰 Chichén Itzá', '🧗 Tyrolienne', '💧 Cénote', '🍽️ Buffet Local', '⏱ Journée Complète', '👥 Privé'],
      'tp.chichen.inc':   ['Visite guidée de Chichén Itzá', 'Tyrolienne au-dessus d\'un cénote', 'Buffet local inclus', 'Transport privé A/C', 'Guide expert certifié'],
      'tp.chichen.notinc':['Droit d\'entrée Chichén Itzá (~30 USD)', 'Pourboires'],

      'tp.holbox.title': 'Expérience Holbox Privée',
      'tp.holbox.sub':   'Bateau Privé · 3 Îles · Golf Cart · Beach Club Open Bar',
      'tp.holbox.about': 'Embarquez sur un bateau privé pour explorer trois îles féeriques, découvrez le charmant village de Holbox en golf cart et détendez-vous à un beach club avec open bar. Une escapade insulaire parfaite loin de l\'agitation touristique.',
      'tp.holbox.chips': ['⛵ Bateau Privé', '🏝️ 3 Îles', '🛺 Golf Cart', '🍹 Open Bar', '⏱ Journée Complète', '👥 Privé'],
      'tp.holbox.inc':   ['Bateau privé avec capitaine', 'Visite de 3 îles', 'Golf cart à Holbox', 'Accès beach club open bar', 'Transport privé A/C', 'Guide local'],
      'tp.holbox.notinc':['Déjeuner à la carte', 'Pourboires'],

      'tp.turtle2.title': 'Tortues Marines et Cénotes',
      'tp.turtle2.sub':   'Tortues Marines · 3 Cénotes · Collation et Boissons',
      'tp.turtle2.about': 'Nagez avec des tortues marines sauvages, puis explorez trois cénotes cristallins cachés au cœur de la jungle yucatèque. Une expérience privée unique et magique.',
      'tp.turtle2.chips': ['🐢 Tortues Marines', '💧 3 Cénotes', '🌿 Jungle', '⏱ Demi-journée', '👥 Privé', '📸 Photos Incluses'],
      'tp.turtle2.inc':   ['Snorkeling avec tortues marines', '3 cénotes cristallins', 'Collation et boissons', 'Équipement inclus', 'Transport privé A/C'],
      'tp.turtle2.notinc':['Déjeuner', 'Pourboires'],

      'tp.fishing.title': 'Expérience de Pêche Privée',
      'tp.fishing.sub':   'Bateau Privé · Pêche en Haute Mer · Ceviche Frais · Boissons',
      'tp.fishing.about': 'Prenez le large avec nos capitaines experts pour une journée de pêche sportive en haute mer. Dégustez un ceviche frais préparé avec votre prise et profitez de boissons fraîches sous le soleil de la Caraïbe.',
      'tp.fishing.chips': ['🎣 Pêche en Haute Mer', '⛵ Bateau Privé', '🍋 Ceviche Frais', '🍺 Boissons', '👥 Privé'],
      'tp.fishing.inc':   ['Bateau privé avec capitaine expérimenté', 'Tout l\'équipement de pêche', 'Ceviche frais préparé à bord', 'Boissons fraîches incluses', 'Licence de pêche'],
      'tp.fishing.notinc':['Transport depuis/vers l\'hôtel', 'Pourboires'],

      'tp.dolphin.title': 'Dauphins à Sian Ka\'an',
      'tp.dolphin.sub':   'Bateau Rapide · Dauphins · Tortues · Observation d\'Oiseaux · Snorkeling',
      'tp.dolphin.about': 'Naviguez dans la Réserve de Biosphère UNESCO de Sian Ka\'an pour observer dauphins sauvages, tortues marines, crocodiles, lamantins, oiseaux tropicaux et la vie récifale. Une expérience naturelle extraordinaire.',
      'tp.dolphin.chips': ['🐬 Dauphins', '🐢 Tortues', '🦜 Oiseaux', '🤿 Snorkeling', '⏱ Journée Complète', '👥 Privé'],
      'tp.dolphin.inc':   ['Bateau rapide privé', 'Observation de dauphins sauvages', 'Snorkeling récifal', 'Observation d\'oiseaux', 'Guide naturaliste expert', 'Transport A/C'],
      'tp.dolphin.notinc':['Déjeuner', 'Pourboires'],

      'tp.tacos.title': 'Soirée Tacos à Playa',
      'tp.tacos.sub':   'Cénote Ouvert · Tacos à Volonté · Playa del Carmen',
      'tp.tacos.about': 'Nagez dans un magnifique cénote ouvert baigné de soleil, puis dégustez des tacos locaux authentiques à volonté dans les meilleurs spots de Playa del Carmen. Une soirée parfaite alliant nature et gastronomie.',
      'tp.tacos.chips': ['💧 Cénote Ouvert', '🌮 Tacos à Volonté', '🌃 Playa del Carmen', '⏱ Soirée', '👥 Privé'],
      'tp.tacos.inc':   ['Baignade dans cénote ouvert', 'Tacos locaux à volonté', 'Guide local passionné', 'Transport A/C'],
      'tp.tacos.notinc':['Boissons', 'Pourboires'],

      /* ── Shared tour pages ── */
      'tp.stulum.title': 'Tulum, Cénote et Village Maya',
      'tp.stulum.sub':   'Ruines de Tulum · Village Maya · Cénote · Expérience Partagée',
      'tp.stulum.about': 'Explorez les ruines de Tulum au bord des falaises avec un guide expert, visitez un village maya traditionnel pour une immersion culturelle authentique et baignez-vous dans un magnifique cénote.',
      'tp.stulum.chips': ['🏛️ Ruines de Tulum', '🌊 Vues sur l\'Océan', '🏘️ Village Maya', '💧 Cénote', '⏱ Journée', '👥 Partagé'],
      'tp.stulum.inc':   ['Ruines de Tulum avec guide', 'Visite d\'un village maya', 'Baignade dans un cénote', 'Transport partagé A/C'],
      'tp.stulum.notinc':['Droits d\'entrée Tulum (~25 USD)', 'Déjeuner', 'Pourboires'],

      'tp.schichen.title': 'Chichen Itza et Aventure Cénote',
      'tp.schichen.sub':   'Chichen Itza · Aventure Cénote · Buffet · Expérience Partagée',
      'tp.schichen.about': 'Explorez Chichen Itza avec un guide archéologique, nagez dans un cénote naturel et savourez un buffet régional avec boissons locales. Une aventure partagée complète et inoubliable.',
      'tp.schichen.chips': ['🏰 Chichén Itzá', '💧 Cénote', '🍽️ Buffet Régional', '⏱ Journée Complète', '👥 Partagé'],
      'tp.schichen.inc':   ['Visite guidée de Chichén Itzá', 'Baignade dans un cénote', 'Buffet régional + boissons locales', 'Transport partagé A/C'],
      'tp.schichen.notinc':['Droits d\'entrée Chichén Itzá (~30 USD)', 'Pourboires'],

      'tp.scoba.title': 'Cobá et Aventure Cénote',
      'tp.scoba.sub':   'Ruines de Cobá · Cénote · Buffet · Expérience Partagée',
      'tp.scoba.about': 'Découvrez l\'antique cité maya de Cobá avec un guide archéologique passionné, baignez-vous dans un cénote naturel et savourez un délicieux buffet régional. Une aventure partagée riche en histoire et en émotions.',
      'tp.scoba.chips': ['🗿 Ruines de Cobá', '🚲 Vélo', '💧 Cénote', '🍽️ Buffet', '⏱ Journée Complète', '👥 Partagé'],
      'tp.scoba.inc':   ['Visite guidée des ruines de Cobá', 'Vélo dans le site', 'Baignade dans un cénote', 'Buffet régional', 'Transport partagé A/C'],
      'tp.scoba.notinc':['Droits d\'entrée Cobá (~10 USD)', 'Pourboires'],

      'tp.sturtles.title': 'Snorkeling avec Tortues et Cénote',
      'tp.sturtles.sub':   'Tortues Marines · Équipement Snorkeling · Petit Groupe Partagé',
      'tp.sturtles.about': 'Vivez une expérience de snorkeling magique en nageant avec des tortues marines sauvages dans leur habitat naturel, suivie d\'une baignade rafraîchissante dans un magnifique cénote.',
      'tp.sturtles.chips': ['🐢 Tortues Marines', '🤿 Snorkeling', '💧 Cénote', '⏱ Demi-journée', '👥 Petit Groupe'],
      'tp.sturtles.inc':   ['Snorkeling avec tortues marines', 'Baignade dans un cénote', 'Équipement de snorkeling', 'Guide expert', 'Transport partagé A/C'],
      'tp.sturtles.notinc':['Pourboires', 'Boissons supplémentaires'],

      'tp.sholbox.title': 'Aventure d\'une Journée à Holbox',
      'tp.sholbox.sub':   'Bateau · 2 Îles · Centre de Holbox · Beach Club · Partagé',
      'tp.sholbox.about': 'Naviguez vers deux îles féeriques, explorez le charmant centre coloré de Holbox et détendez-vous au beach club. Une journée partagée épique à prix accessible.',
      'tp.sholbox.chips': ['⛵ Bateau', '🏝️ 2 Îles', '🌴 Holbox', '🏖️ Beach Club', '⏱ Journée Complète', '👥 Partagé'],
      'tp.sholbox.inc':   ['Bateau vers 2 îles', 'Visite de Holbox', 'Accès beach club', 'Transport partagé A/C'],
      'tp.sholbox.notinc':['Déjeuner', 'Boissons au beach club', 'Pourboires'],

      /* ── Tours page ── */
      'tours.lbl':        'Toutes Nos Expériences',
      'tours.h1':         'Explorez Nos Excursions',
      'tours.sub':        'Choisissez l\'aventure qui vous correspond. Expériences privées sur mesure ou aventures partagées à prix accessible.',
      'tours.priv.lbl':   'Expériences Privées',
      'tours.priv.h2':    'Uniquement Pour Vous et Votre Groupe',
      'tours.shar.lbl':   'Expériences Partagées',
      'tours.shar.h2':    'Vivez l\'Aventure à Petit Prix',

      /* ── Reviews page ── */
      'rev.lbl':   'Avis des Clients',
      'rev.h1':    'Ce Que Disent Nos Clients',
      'rev.sub':   '100% d\'avis authentiques de nos voyageurs du monde entier.',
      'rev.rating':'5.0 · Visites privées les mieux notées de la Riviera Maya',

      /* ── Our Story page ── */
      'story.lbl': 'Notre Histoire',
      'story.h1':  'Une Passion Née Sous l\'Eau',
      'story.cta': 'Planifier Mon Expérience'
    },

    /* ==================================================
       SPANISH
    ================================================== */
    es: {

      /* ── Common: Navigation ── */
      'c.nav.private':  'Experiencias Privadas',
      'c.nav.shared':   'Experiencias Compartidas',
      'c.nav.reviews':  'Reseñas',
      'c.nav.story':    'Nuestra Historia',
      'c.nav.contact':  'Contacto',
      'c.nav.book':     'Reservar',
      'c.mob.private':  'Experiencias Privadas',
      'c.mob.shared':   'Experiencias Compartidas',
      'c.mob.reviews':  'Reseñas',
      'c.mob.story':    'Nuestra Historia',
      'c.mob.contact':  'Contacto',
      'c.mob.wa':       'Reservar por WhatsApp',

      /* ── Common: Footer ── */
      'c.ft.tagline':   'Experiencias privadas y compartidas en Cancún, Tulum, Playa del Carmen y la Riviera Maya. Más de 14 años de experiencias inolvidables.',
      'c.ft.explore':   'Explorar',
      'c.ft.contact':   'Contacto',
      'c.ft.dest':      'Destinos',
      'c.ft.private':   'Experiencias Privadas',
      'c.ft.shared':    'Experiencias Compartidas',
      'c.ft.reviews':   'Reseñas de Clientes',
      'c.ft.story':     'Nuestra Historia',
      'c.ft.cancun':    'Tours en Cancún',
      'c.ft.tulum':     'Tours en Tulum',
      'c.ft.playa':     'Tours en Playa del Carmen',
      'c.ft.riviera':   'Riviera Maya',
      'c.ft.copy':      '© 2025 Beyond the Reef Mexico. Todos los derechos reservados.',

      /* ── Common: Buttons ── */
      'c.btn.details':  'Detalles',
      'c.btn.book':     'Reservar →',
      'c.btn.wa':       'Abrir WhatsApp →',
      'c.btn.email':    'Enviar Email →',
      'c.btn.allrev':   'Leer todas las 13 reseñas →',
      'c.btn.moretours':'← Ver más tours',
      'c.btn.explore':  'Explorar Experiencias',
      'c.per.person':   '/persona',

      /* ── Common: Booking form ── */
      'c.bk.about':     'Sobre Esta Experiencia',
      'c.bk.included':  'Qué Incluye y No Incluye',
      'c.bk.inc.lbl':   '✓ Incluido',
      'c.bk.notinc.lbl':'✕ No Incluido',
      'c.bk.from':      'Desde',
      'c.bk.pricedrop': 'El precio baja con más personas · Sin pago aquí',
      'c.bk.guests':    'Número de personas',
      'c.bk.pp':        'Precio por persona',
      'c.bk.total':     'Precio total',
      'c.bk.hint':      '💡 El precio baja automáticamente con el grupo',
      'c.bk.name':      'Nombre Completo *',
      'c.bk.email':     'Email *',
      'c.bk.phone':     'Teléfono / WhatsApp',
      'c.bk.date':      'Fecha Preferida',
      'c.bk.hotel':     'Hotel / Lugar de Recogida',
      'c.bk.notes':     'Peticiones Especiales',
      'c.bk.submit':    'Solicitar Reserva →',
      'c.bk.disclaimer':'Sin pago aquí. Confirmamos disponibilidad y te contactamos rápidamente.',
      'c.bk.success.title': '¡Solicitud Enviada!',
      'c.bk.success.text':  'Confirmaremos disponibilidad y te contactaremos en las próximas horas. ¡Revisa también tu WhatsApp!',
      'c.bk.success.link':  '← Ver más tours',
      'c.bk.name.ph':   'Juan y María',
      'c.bk.hotel.ph':  'Nombre del hotel o dirección',
      'c.bk.notes.ph':  'Dieta especial, accesibilidad…',
      'c.bk.email.ph':  'tu@email.com',
      'c.bk.phone.ph':  '+52 1 000 000 0000',

      /* ── Common: section keep-exploring ── */
      'c.sec.keep':     'Seguir Explorando',
      'c.sec.loved':    'A los clientes también les encantó',
      'c.bc.home':      'Inicio',
      'c.bc.tours':     'Tours',

      /* ── INDEX: Hero ── */
      'i.hero.pill':    'Cancún · Tulum · Playa del Carmen',
      'i.hero.h1.1':    'Ve Más Allá',
      'i.hero.h1.2':    'del Turismo,',
      'i.hero.h1.3':    'Riviera Maya.',
      'i.hero.sub':     'Sumérgete en cenotes ocultos. Nada con tortugas marinas. Explora antiguas ruinas mayas. Come donde comen los locales. Experiencias privadas y compartidas para viajeros que quieren sentir la verdadera Riviera Maya.',
      'i.hero.explore': 'Explorar Experiencias',
      'i.hero.wa':      'WhatsApp',
      'i.stats.years':  'Años de Experiencia',
      'i.stats.rating': 'Calificación',
      'i.stats.local':  'Experiencia Local',

      /* ── INDEX: Values ── */
      'i.val.lbl':      'Nuestros Valores en Experiencias Privadas',
      'i.val.h2':       'Ve más allá de lo ordinario.',
      'i.val.sub':      'Descubre la Riviera Maya como debe ser. Comida real. Cultura real. Lugares inolvidables. Más libertad. Más profundidad. Sin prisas.',
      'i.val.photos':   'Fotos Incluidas',
      'i.val.photos.d': 'Se toman fotos profesionales durante cada experiencia privada, para que puedas estar presente y llevarte recuerdos que duran toda la vida.',
      'i.val.sched':    'Tu Horario',
      'i.val.sched.d':  'Sin horarios fijos de grupo. Sin paradas apresuradas. Solo la libertad de empezar cuando quieras y disfrutar el día a tu propio ritmo.',
      'i.val.comfort':  'Comodidad en Cada Trayecto',
      'i.val.comfort.d':'Vans modernos limpios, A/C frío, asientos de cuero y conductores profesionales hacen que cada parte del viaje sea cómoda y agradable.',
      'i.val.food':     'Opciones de Comida Fresca y Flexible',
      'i.val.food.d':   'Las comidas pueden prepararse para veganos, sin gluten, alergias y otras peticiones especiales, con el mismo cuidado que ponemos en cada parte de la experiencia.',
      'i.val.hosts':    'Guías en Quienes Puedes Confiar',
      'i.val.hosts.d':  'Nuestros guías bilingües certificados traen más de 14 años de experiencia, conocimiento local y una mentalidad de seguridad primero a cada día.',
      'i.val.price':    'Precios Transparentes',
      'i.val.price.d':  'Lo que está incluido es claro desde el principio. Transporte, entradas y planificación se manejan por adelantado, sin costos ocultos.',

      /* ── INDEX: Sections ── */
      'i.priv.lbl':     'Experiencias Privadas',
      'i.priv.h2':      'Nuestras Mejores Experiencias, Hechas Para Ti',
      'i.priv.sub':     'Solo tú y tu grupo. Sin prisas, sin grupos compartidos, solo una experiencia más personal de la Riviera Maya a tu propio ritmo.',
      'i.shar.lbl':     'Experiencias Compartidas',
      'i.shar.h2':      'Vive Más, Gasta Menos',
      'i.shar.sub':     'Experiencias grupales a precio accesible con nuestros guías expertos. Ideal para viajeros solos, parejas y grupos pequeños.',
      'i.rev.lbl':      'Testimonios',
      'i.rev.h2':       '5 estrellas, siempre.',
      'i.rev.rating':   '5.0 · Tours privados mejor valorados de la Riviera Maya',

      /* ── INDEX: Contact ── */
      'i.ct.lbl':       'Contáctanos',
      'i.ct.h2':        'Planifiquemos tu\ndía perfecto.',
      'i.ct.sub':       'Respuesta rápida garantizada — generalmente en menos de una hora.',
      'i.ct.wa.t':      'WhatsApp',
      'i.ct.wa.d':      'Chatea directamente con nuestro equipo y obtén tu cotización personalizada en minutos.',
      'i.ct.em.t':      'Email',
      'i.ct.em.d':      'Envía tus fechas, tamaño del grupo e intereses y te responderemos con una cotización personalizada.',

      /* ── INDEX: Custom form ── */
      'i.frm.lbl':      'Solicitud Personalizada',
      'i.frm.h2':       'Crea tu día perfecto en la Riviera Maya',
      'i.frm.p1':       '¿No encuentras exactamente lo que buscas? No hay problema. Podemos personalizar cualquier experiencia privada, adaptar el plan a tu grupo o crear algo completamente único juntos.',
      'i.frm.p2':       'Comparte tus ideas con nosotros y te enviaremos una cotización personalizada en pocas horas.',
      'i.frm.name':     'Tu Nombre',
      'i.frm.email':    'Email',
      'i.frm.phone':    'Teléfono / WhatsApp',
      'i.frm.msg':      'Tu Día Ideal',
      'i.frm.submit':   'Enviar Mi Solicitud →',
      'i.frm.suc.t':    '¡Mensaje Recibido!',
      'i.frm.suc.p':    'Respondemos en las próximas horas. ¡Revisa también tu WhatsApp!',
      'i.frm.name.ph':  'ej. Juan y María',
      'i.frm.msg.ph':   'Fechas, tamaño del grupo, actividades, dietas…',
      'i.frm.phone.ph': '+52 1 000 000 0000',

      /* ── Tour pages: per-tour ES ── */
      'tp.turtle.title': 'Snorkel con Tortugas Marinas y Cenotes',
      'tp.turtle.sub':   'Tortugas Marinas · 3 Cenotes · Snack y Bebidas',
      'tp.turtle.about': 'Nada con tortugas marinas salvajes en su hábitat natural, luego descubre tres cenotes cristalinos escondidos en la selva yucateca. Esta experiencia privada de medio día incluye snacks y bebidas frías para un día perfecto.',
      'tp.turtle.chips': ['🐢 Tortugas Marinas', '💧 3 Cenotes', '🌿 Selva', '⏱ Medio Día', '👥 Privado', '📸 Fotos Incluidas'],
      'tp.turtle.inc':   ['Snorkel con tortugas marinas', 'Visita a 3 cenotes', 'Equipo de snorkel', 'Snack y bebidas frías', 'Transporte privado A/C', 'Traslado hotel incluido'],
      'tp.turtle.notinc':['Almuerzo', 'Propinas', 'Entradas adicionales'],

      'tp.tulumund.title': 'Experiencia Snorkel en Tulum',
      'tp.tulumund.sub':   'Ruinas de Tulum · Snorkel con Tortugas · 2 Cenotes · Almuerzo',
      'tp.tulumund.about': 'Explora las impresionantes ruinas de Tulum sobre el mar Caribe, nada con tortugas marinas salvajes y refréscate en dos hermosos cenotes. Almuerzo local incluido para un día completo e inolvidable.',
      'tp.tulumund.chips': ['🏛️ Ruinas de Tulum', '🐢 Tortugas Marinas', '💧 2 Cenotes', '🍽️ Almuerzo', '⏱ Día Completo', '👥 Privado', '📸 Fotos Incluidas'],
      'tp.tulumund.inc':   ['Visita guiada a ruinas de Tulum', 'Snorkel con tortugas marinas', 'Visita a 2 cenotes', 'Almuerzo en restaurante local', 'Equipo de snorkel', 'Transporte privado A/C', 'Guía bilingüe certificado'],
      'tp.tulumund.notinc':['Entrada a Tulum (~$25 USD)', 'Propinas', 'Bebidas adicionales'],

      'tp.cenotes.title': 'Cenotes Ocultos Express',
      'tp.cenotes.sub':   '4 Cenotes · Rapel en Caverna · Snack y Cervezas',
      'tp.cenotes.about': 'Sumérgete en cuatro cenotes diferentes de aguas cristalinas, luego haz rapel espectacular dentro de una cámara cavernosa secreta. Esta experiencia de medio día es ideal para los amantes de la aventura.',
      'tp.cenotes.chips': ['💧 4 Cenotes', '🧗 Rapel', '🍺 Snack y Cervezas', '⏱ Medio Día', '👥 Privado', '📸 Fotos Incluidas'],
      'tp.cenotes.inc':   ['Visita a 4 cenotes', 'Rapel en caverna', 'Snack y cervezas frías', 'Equipo de rapel', 'Transporte privado A/C', 'Guía experto'],
      'tp.cenotes.notinc':['Almuerzo', 'Propinas'],

      'tp.tulumexp.title': 'Puntos Destacados de Tulum',
      'tp.tulumexp.sub':   'Ruinas de Tulum · Guía Certificado · Bebidas Incluidas',
      'tp.tulumexp.about': 'Explora las emblemáticas ruinas de Tulum sobre el turquesa mar Caribe con un guía bilingüe certificado que da vida a cada pirámide y templo. Vistas únicas, fotos profesionales y bebidas frías incluidas. Tiempo libre opcional en el pueblo de Tulum.',
      'tp.tulumexp.chips': ['🏛️ Ruinas de Tulum', '🌊 Vistas al Océano', '🍺 Bebidas Incluidas', '⏱ Medio Día (4h)', '👥 Privado', '📸 Fotos Incluidas'],
      'tp.tulumexp.inc':   ['Visita guiada a ruinas de Tulum', 'Bebidas frías incluidas', 'Fotos profesionales', 'Guía bilingüe certificado', 'Van privado con A/C', 'Traslado hotel incluido'],
      'tp.tulumexp.notinc':['Entrada a Tulum (~$25 USD)', 'Almuerzo', 'Propinas'],

      'tp.tulumcoba.title': 'Tulum y Ruinas de Cobá',
      'tp.tulumcoba.sub':   'Ruinas de Tulum · Ruinas de Cobá · Cenote · Buffet Local',
      'tp.tulumcoba.about': 'Dos sitios mayas legendarios en un solo día épico. Explora las ruinas de Tulum frente al mar, luego escala la gran pirámide de Cobá. Un cenote refrescante y un buffet regional completan esta aventura inolvidable.',
      'tp.tulumcoba.chips': ['🏛️ Ruinas de Tulum', '🗿 Ruinas de Cobá', '💧 Cenote', '🍽️ Buffet Local', '⏱ Día Completo', '👥 Privado'],
      'tp.tulumcoba.inc':   ['Visita a ruinas de Tulum', 'Visita a ruinas de Cobá', 'Baño en cenote', 'Buffet local incluido', 'Transporte privado A/C', 'Guía bilingüe certificado'],
      'tp.tulumcoba.notinc':['Entrada Tulum (~$25 USD)', 'Entrada Cobá (~$10 USD)', 'Propinas'],

      'tp.coba.title': 'Experiencia Cobá',
      'tp.coba.sub':   'Ruinas de Cobá · Bicicleta · Cenote · Buffet Regional',
      'tp.coba.about': 'Pedalea por las ruinas cubiertas de selva hasta la base de la gran pirámide con guías expertos. Báñate en un hermoso cenote y disfruta de un auténtico buffet regional para un día lleno de historia.',
      'tp.coba.chips': ['🗿 Ruinas de Cobá', '🚲 Bicicleta', '💧 Cenote', '🍽️ Buffet Regional', '⏱ Día Completo', '👥 Privado'],
      'tp.coba.inc':   ['Visita guiada a ruinas de Cobá', 'Renta de bicicleta', 'Baño en cenote', 'Buffet regional incluido', 'Transporte privado A/C', 'Guía arqueológico'],
      'tp.coba.notinc':['Entrada Cobá (~$10 USD)', 'Propinas'],

      'tp.chichen.title': 'Experiencia Chichén Itzá',
      'tp.chichen.sub':   'Chichén Itzá · Tirolesa en Cenote · Buffet Local',
      'tp.chichen.about': 'Visita una de las Siete Maravillas del Mundo con un guía experto apasionado, lánzate en tirolesa sobre un hermoso cenote y disfruta de un delicioso buffet local. Un día memorable entre historia y aventura.',
      'tp.chichen.chips': ['🏰 Chichén Itzá', '🎢 Tirolesa', '💧 Cenote', '🍽️ Buffet Local', '⏱ Día Completo', '👥 Privado'],
      'tp.chichen.inc':   ['Visita guiada a Chichén Itzá', 'Tirolesa en cenote', 'Buffet local incluido', 'Transporte privado A/C', 'Guía experto certificado'],
      'tp.chichen.notinc':['Entrada Chichén Itzá (~$30 USD)', 'Propinas'],

      'tp.holbox.title': 'Experiencia Holbox Privada',
      'tp.holbox.sub':   'Lancha Privada · 3 Islas · Golf Cart · Beach Club Barra Libre',
      'tp.holbox.about': 'Embarca en una lancha privada para explorar tres islas paradisíacas, descubre el encantador pueblo de Holbox en golf cart y relájate en un beach club con barra libre. Una escapada isleña perfecta.',
      'tp.holbox.chips': ['⛵ Lancha Privada', '🏝️ 3 Islas', '🛺 Golf Cart', '🍹 Barra Libre', '⏱ Día Completo', '👥 Privado'],
      'tp.holbox.inc':   ['Lancha privada con capitán', 'Visita a 3 islas', 'Golf cart en Holbox', 'Acceso beach club barra libre', 'Transporte privado A/C', 'Guía local'],
      'tp.holbox.notinc':['Almuerzo a la carta', 'Propinas'],

      'tp.turtle2.title': 'Tortugas Marinas y Cenotes',
      'tp.turtle2.sub':   'Tortugas Marinas · 3 Cenotes · Snack y Bebidas',
      'tp.turtle2.about': 'Nada con tortugas marinas salvajes, luego explora tres cenotes cristalinos escondidos en la selva yucateca. Una experiencia privada única y mágica.',
      'tp.turtle2.chips': ['🐢 Tortugas Marinas', '💧 3 Cenotes', '🌿 Selva', '⏱ Medio Día', '👥 Privado', '📸 Fotos Incluidas'],
      'tp.turtle2.inc':   ['Snorkel con tortugas marinas', '3 cenotes cristalinos', 'Snack y bebidas', 'Equipo incluido', 'Transporte privado A/C'],
      'tp.turtle2.notinc':['Almuerzo', 'Propinas'],

      'tp.fishing.title': 'Experiencia de Pesca Privada',
      'tp.fishing.sub':   'Lancha Privada · Pesca en Alta Mar · Ceviche Fresco · Bebidas',
      'tp.fishing.about': 'Sal a alta mar con nuestros capitanes expertos para un día de pesca deportiva. Disfruta de un ceviche fresco preparado con tu pesca y bebidas frías bajo el sol del Caribe.',
      'tp.fishing.chips': ['🎣 Pesca en Alta Mar', '⛵ Lancha Privada', '🍋 Ceviche Fresco', '🍺 Bebidas', '👥 Privado'],
      'tp.fishing.inc':   ['Lancha privada con capitán experimentado', 'Todo el equipo de pesca', 'Ceviche fresco preparado a bordo', 'Bebidas frías incluidas', 'Licencia de pesca'],
      'tp.fishing.notinc':['Traslado hotel', 'Propinas'],

      'tp.dolphin.title': 'Delfines en Sian Ka\'an',
      'tp.dolphin.sub':   'Lancha Rápida · Delfines · Tortugas · Observación de Aves · Snorkel',
      'tp.dolphin.about': 'Navega por la Reserva de la Biosfera UNESCO de Sian Ka\'an para avistar delfines salvajes, tortugas marinas, cocodrilos, manatíes, aves tropicales y vida arrecifal. Una experiencia natural extraordinaria.',
      'tp.dolphin.chips': ['🐬 Delfines', '🐢 Tortugas', '🦜 Aves', '🤿 Snorkel', '⏱ Día Completo', '👥 Privado'],
      'tp.dolphin.inc':   ['Lancha rápida privada', 'Avistamiento de delfines', 'Snorkel en arrecife', 'Observación de aves', 'Guía naturalista experto', 'Transporte A/C'],
      'tp.dolphin.notinc':['Almuerzo', 'Propinas'],

      'tp.tacos.title': 'Noche de Tacos en Playa',
      'tp.tacos.sub':   'Cenote Abierto · Tacos Ilimitados · Playa del Carmen',
      'tp.tacos.about': 'Nada en un hermoso cenote abierto bañado por el sol, luego disfruta de tacos locales auténticos al gusto en los mejores spots de Playa del Carmen. Una noche perfecta combinando naturaleza y gastronomía.',
      'tp.tacos.chips': ['💧 Cenote Abierto', '🌮 Tacos Ilimitados', '🌃 Playa del Carmen', '⏱ Noche', '👥 Privado'],
      'tp.tacos.inc':   ['Baño en cenote abierto', 'Tacos locales ilimitados', 'Guía local apasionado', 'Transporte A/C'],
      'tp.tacos.notinc':['Bebidas', 'Propinas'],

      /* ── Shared tour pages ES ── */
      'tp.stulum.title': 'Tulum, Cenote y Pueblo Maya',
      'tp.stulum.sub':   'Ruinas de Tulum · Pueblo Maya · Cenote · Compartido',
      'tp.stulum.about': 'Explora las ruinas de Tulum en el acantilado con un guía experto, visita un pueblo maya tradicional para una inmersión cultural auténtica y báñate en un hermoso cenote.',
      'tp.stulum.chips': ['🏛️ Ruinas de Tulum', '🌊 Vistas al Océano', '🏘️ Pueblo Maya', '💧 Cenote', '⏱ Día', '👥 Compartido'],
      'tp.stulum.inc':   ['Ruinas de Tulum con guía', 'Visita a pueblo maya', 'Baño en cenote', 'Transporte compartido A/C'],
      'tp.stulum.notinc':['Entrada Tulum (~$25 USD)', 'Almuerzo', 'Propinas'],

      'tp.schichen.title': 'Chichén Itzá y Aventura en Cenote',
      'tp.schichen.sub':   'Chichén Itzá · Aventura Cenote · Buffet · Compartido',
      'tp.schichen.about': 'Explora Chichén Itzá con un guía arqueológico, nada en un cenote natural y disfruta de un buffet regional con bebidas locales. Una aventura compartida completa e inolvidable.',
      'tp.schichen.chips': ['🏰 Chichén Itzá', '💧 Cenote', '🍽️ Buffet Regional', '⏱ Día Completo', '👥 Compartido'],
      'tp.schichen.inc':   ['Visita guiada Chichén Itzá', 'Baño en cenote', 'Buffet regional + bebidas locales', 'Transporte compartido A/C'],
      'tp.schichen.notinc':['Entrada Chichén Itzá (~$30 USD)', 'Propinas'],

      'tp.scoba.title': 'Cobá y Aventura en Cenote',
      'tp.scoba.sub':   'Ruinas de Cobá · Cenote · Buffet · Compartido',
      'tp.scoba.about': 'Descubre la antigua ciudad maya de Cobá con un guía arqueológico apasionado, báñate en un cenote natural y disfruta de un delicioso buffet regional. Una aventura compartida llena de historia.',
      'tp.scoba.chips': ['🗿 Ruinas de Cobá', '🚲 Bicicleta', '💧 Cenote', '🍽️ Buffet', '⏱ Día Completo', '👥 Compartido'],
      'tp.scoba.inc':   ['Visita guiada a Cobá', 'Bicicleta en el sitio', 'Baño en cenote', 'Buffet regional', 'Transporte compartido A/C'],
      'tp.scoba.notinc':['Entrada Cobá (~$10 USD)', 'Propinas'],

      'tp.sturtles.title': 'Snorkel con Tortugas y Cenote',
      'tp.sturtles.sub':   'Tortugas Marinas · Equipo de Snorkel · Grupo Pequeño Compartido',
      'tp.sturtles.about': 'Vive una experiencia de snorkel mágica nadando con tortugas marinas salvajes en su hábitat natural, seguida de un refrescante baño en un hermoso cenote.',
      'tp.sturtles.chips': ['🐢 Tortugas Marinas', '🤿 Snorkel', '💧 Cenote', '⏱ Medio Día', '👥 Grupo Pequeño'],
      'tp.sturtles.inc':   ['Snorkel con tortugas marinas', 'Baño en cenote', 'Equipo de snorkel', 'Guía experto', 'Transporte compartido A/C'],
      'tp.sturtles.notinc':['Propinas', 'Bebidas adicionales'],

      'tp.sholbox.title': 'Aventura de un Día en Holbox',
      'tp.sholbox.sub':   'Lancha · 2 Islas · Centro de Holbox · Beach Club · Compartido',
      'tp.sholbox.about': 'Navega hacia dos islas paradisíacas, explora el colorido centro de Holbox y relájate en el beach club. Un día épico compartido a precio accesible.',
      'tp.sholbox.chips': ['⛵ Lancha', '🏝️ 2 Islas', '🌴 Holbox', '🏖️ Beach Club', '⏱ Día Completo', '👥 Compartido'],
      'tp.sholbox.inc':   ['Lancha a 2 islas', 'Visita a Holbox', 'Acceso beach club', 'Transporte compartido A/C'],
      'tp.sholbox.notinc':['Almuerzo', 'Bebidas en beach club', 'Propinas'],

      /* ── Tours page ── */
      'tours.lbl':        'Todas Nuestras Experiencias',
      'tours.h1':         'Explora Nuestros Tours',
      'tours.sub':        'Elige la aventura que se adapte a ti. Experiencias privadas a tu medida o aventuras compartidas a precio accesible.',
      'tours.priv.lbl':   'Experiencias Privadas',
      'tours.priv.h2':    'Solo Para Ti y Tu Grupo',
      'tours.shar.lbl':   'Experiencias Compartidas',
      'tours.shar.h2':    'Vive la Aventura a Buen Precio',

      /* ── Reviews page ── */
      'rev.lbl':   'Reseñas de Clientes',
      'rev.h1':    'Lo Que Dicen Nuestros Clientes',
      'rev.sub':   '100% de reseñas auténticas de nuestros viajeros de todo el mundo.',
      'rev.rating':'5.0 · Tours privados mejor valorados de la Riviera Maya',

      /* ── Our Story page ── */
      'story.lbl': 'Nuestra Historia',
      'story.h1':  'Una Pasión Nacida Bajo el Agua',
      'story.cta': 'Planificar Mi Experiencia'
    }
  }; /* end T */

  /* ── Page-specific apply functions ─────────────────────── */

  /* Map URL filename → translation key prefix for tour pages */
  var TOUR_MAP = {
    'tour-turtles-cenotes':  { pre: 'tp.turtle',    kind: 'private' },
    'tour-tulum-underwater': { pre: 'tp.tulumund',  kind: 'private' },
    'tour-cenotes-express':  { pre: 'tp.cenotes',   kind: 'private' },
    'tour-tulum-express':    { pre: 'tp.tulumexp',  kind: 'private' },
    'tour-tulum-coba':       { pre: 'tp.tulumcoba', kind: 'private' },
    'tour-coba':             { pre: 'tp.coba',      kind: 'private' },
    'tour-chichen-itza':     { pre: 'tp.chichen',   kind: 'private' },
    'tour-holbox-express':   { pre: 'tp.holbox',    kind: 'private' },
    'tour-turtles-cenotes2': { pre: 'tp.turtle2',   kind: 'private' },
    'tour-fishing':          { pre: 'tp.fishing',   kind: 'private' },
    'tour-dolphin-turtle':   { pre: 'tp.dolphin',   kind: 'private' },
    'tour-tacos-tour':       { pre: 'tp.tacos',     kind: 'private' },
    'tour-shared-tulum':     { pre: 'tp.stulum',    kind: 'shared'  },
    'tour-shared-chichen':   { pre: 'tp.schichen',  kind: 'shared'  },
    'tour-shared-coba':      { pre: 'tp.scoba',     kind: 'shared'  },
    'tour-shared-turtles':   { pre: 'tp.sturtles',  kind: 'shared'  },
    'tour-shared-holbox':    { pre: 'tp.sholbox',   kind: 'shared'  }
  };

  function applyTourPage(lang, D) {
    var pageId = win.location.pathname.split('/').pop().replace('.html','');
    var info = TOUR_MAP[pageId];
    if (!info) return;
    var pre = info.pre;

    /* Title */
    setText('.ti h1', D[pre + '.title']);
    setText('.ti-tag', D[pre + '.sub']);

    /* Chips */
    var chips = D[pre + '.chips'];
    if (chips) {
      var chipEls = doc.querySelectorAll('.chip');
      for (var i = 0; i < chipEls.length && i < chips.length; i++) {
        chipEls[i].textContent = chips[i];
      }
    }

    /* About text */
    setText('.about-t', D[pre + '.about']);

    /* Included items (the text spans inside ic-y) */
    var incItems = doc.querySelectorAll('.ic-y .ic-item span:last-child');
    var incArr = D[pre + '.inc'];
    if (incArr) {
      for (var ii = 0; ii < incItems.length && ii < incArr.length; ii++) {
        incItems[ii].textContent = incArr[ii];
      }
    }

    /* Not included items */
    var notIncItems = doc.querySelectorAll('.ic-n .ic-item span:last-child');
    var notIncArr = D[pre + '.notinc'];
    if (notIncArr) {
      for (var ni = 0; ni < notIncItems.length && ni < notIncArr.length; ni++) {
        notIncItems[ni].textContent = notIncArr[ni];
      }
    }
  }

  function applyIndexPage(lang, D) {
    /* Hero */
    setText('.hero-pill span', D['i.hero.pill']);
    setText('.hero-body h1 .c-gold', D['i.hero.h1.1']);
    setText('.hero-body h1 .c-teal', D['i.hero.h1.2']);
    /* 3rd line of h1 is a text node – wrap was added in HTML */
    setText('.hero-body h1 .h1-line3', D['i.hero.h1.3']);
    setText('.hero-sub', D['i.hero.sub']);
    setText('#heroExplore', D['i.hero.explore']);
    setText('#heroWa', D['i.hero.wa']);
    setText('.stat-years .stat-l', D['i.stats.years']);
    setText('.stat-rating .stat-l', D['i.stats.rating']);
    setText('.stat-local .stat-l', D['i.stats.local']);
    /* Values */
    setText('#valLbl', D['i.val.lbl']);
    setText('#valH2', D['i.val.h2']);
    setText('#valSub', D['i.val.sub']);
    setText('#valPhotosT', D['i.val.photos']);
    setText('#valPhotosD', D['i.val.photos.d']);
    setText('#valSchedT', D['i.val.sched']);
    setText('#valSchedD', D['i.val.sched.d']);
    setText('#valComfortT', D['i.val.comfort']);
    setText('#valComfortD', D['i.val.comfort.d']);
    setText('#valFoodT', D['i.val.food']);
    setText('#valFoodD', D['i.val.food.d']);
    setText('#valHostsT', D['i.val.hosts']);
    setText('#valHostsD', D['i.val.hosts.d']);
    setText('#valPriceT', D['i.val.price']);
    setText('#valPriceD', D['i.val.price.d']);
    /* Section headers */
    setText('#privLbl', D['i.priv.lbl']);
    setText('#privH2', D['i.priv.h2']);
    setText('#privSub', D['i.priv.sub']);
    setText('#sharLbl', D['i.shar.lbl']);
    setText('#sharH2', D['i.shar.h2']);
    setText('#sharSub', D['i.shar.sub']);
    setText('#revLbl', D['i.rev.lbl']);
    setText('#revH2', D['i.rev.h2']);
    setText('#revRating', D['i.rev.rating']);
    /* Contact */
    setText('#ctLbl', D['i.ct.lbl']);
    setText('#ctH2', D['i.ct.h2']);
    setText('#ctSub', D['i.ct.sub']);
    setText('#ctWaTitle', D['i.ct.wa.t']);
    setText('#ctWaDesc', D['i.ct.wa.d']);
    setText('#ctWaBtn', D['c.btn.wa']);
    setText('#ctEmTitle', D['i.ct.em.t']);
    setText('#ctEmDesc', D['i.ct.em.d']);
    setText('#ctEmBtn', D['c.btn.email']);
    /* Custom form */
    setText('#frmLbl', D['i.frm.lbl']);
    setText('#frmH2', D['i.frm.h2']);
    setText('#frmP1', D['i.frm.p1']);
    setText('#frmP2', D['i.frm.p2']);
    setText('#frmNameLbl', D['i.frm.name']);
    setText('#frmEmailLbl', D['i.frm.email']);
    setText('#frmPhoneLbl', D['i.frm.phone']);
    setText('#frmMsgLbl', D['i.frm.msg']);
    setText('#frmSubmit', D['i.frm.submit']);
    setText('#frmSucTitle', D['i.frm.suc.t']);
    setText('#frmSucText', D['i.frm.suc.p']);
    setPlaceholder('#f-name',  D['i.frm.name.ph']);
    setPlaceholder('#f-msg',   D['i.frm.msg.ph']);
    setPlaceholder('#f-phone', D['i.frm.phone.ph']);
  }

  /* ── Master apply function ──────────────────────────────── */
  function apply(lang) {
    if (lang === 'en' || !T[lang]) return;
    var D = T[lang];

    /* 1. data-i18n attributes (nav, footer, booking form labels) */
    applyDataAttrs(D);

    /* 2. Page-specific content by URL */
    var page = win.location.pathname.split('/').pop().replace('.html','') || 'index';

    if (page === 'index' || page === '') {
      applyIndexPage(lang, D);
    } else if (TOUR_MAP[page]) {
      applyTourPage(lang, D);
    }
    /* tours.html, reviews.html, our-story.html are covered by data-i18n attrs */

    /* 3. Update html lang attribute */
    doc.documentElement.setAttribute('lang', lang);
  }

  /* ── Public API ─────────────────────────────────────────── */
  win.BTR_I18N = {
    lang: LANG,
    apply: apply,
    setup: setupSwitcher
  };

  /* Auto-apply if language is already known at script-load time
     (when i18n.js is loaded synchronously in <head> before body) */
  if (LANG !== 'en') {
    /* Body not yet parsed – defer to DOMContentLoaded.
       The CSS .btr-i18n-loading rule keeps body invisible until we call
       apply() and remove the class in the end-of-body inline script. */
  }

}(window, document));
