const tours = [
  {
    id: "reef-escape",
    title: "Snorkel & Reef Escape",
    time: "Half Day",
    duration: "4 Hours",
    price: 59,
    location: "Cancun Reef Zone",
    category: "Water",
    badge: "Most Popular",
    color: "linear-gradient(180deg, #1EA0E6 0%, #0E84C2 55%, #003C68 100%)",
    text: "Crystal-clear water, reef views, and a smooth private experience.",
    longDescription:
      "Perfect for travelers who want a simple, beautiful ocean experience with private attention, easy logistics, and unforgettable reef views.",
    highlights: ["Private guide", "Snorkeling gear included", "Photo stops", "Easy pickup"],
    includes: ["Private transportation", "Water and soft drinks", "Guide assistance", "Snorkel equipment"],
    itinerary: ["Hotel pickup", "Arrival and briefing", "Snorkel session", "Relax and photo time"],
  },
  {
    id: "sunset-coastal",
    title: "Sunset Coastal Ride",
    time: "Evening",
    duration: "3 Hours",
    price: 79,
    location: "Riviera Maya Coast",
    category: "Scenic",
    badge: "Golden Hour",
    color: "linear-gradient(180deg, #FFD54A 0%, #FFA25E 52%, #FF7F40 100%)",
    text: "Golden sky, ocean breeze, and unforgettable photo spots.",
    longDescription:
      "A warm, romantic experience built for couples, friends, and guests who want the perfect sunset feeling with premium service.",
    highlights: ["Sunset views", "Private ride", "Great for photos", "Easy evening plan"],
    includes: ["Guide", "Scenic route", "Bottled water", "Photo assistance"],
    itinerary: ["Meet and depart", "Coastal route", "Sunset stop", "Return transfer"],
  },
  {
    id: "adventure-day",
    title: "Adventure Day Tour",
    time: "Full Day",
    duration: "8 Hours",
    price: 99,
    location: "Jungle and Coast",
    category: "Adventure",
    badge: "Full Experience",
    color: "linear-gradient(180deg, #F7C515 0%, #0E84C2 52%, #003C68 100%)",
    text: "Nature, action, and local highlights in one premium tour.",
    longDescription:
      "For guests who want the full Beyond The Reef Mexico experience with more action, more variety, and more memorable moments in one day.",
    highlights: ["Multi-stop experience", "Private service", "Flexible pace", "Premium value"],
    includes: ["Transportation", "Guide", "Refreshments", "Custom pace support"],
    itinerary: ["Morning pickup", "Adventure stop", "Scenic break", "Final experience and return"],
  },
];

let page = "home";
let selectedTourId = tours[0].id;

const app = document.getElementById("app");

const getSelectedTour = () => tours.find((tour) => tour.id === selectedTourId) || tours[0];

function setPage(next) {
  page = next;
  render();
}

function setSelectedTour(id) {
  selectedTourId = id;
  render();
}

function tourCard(tour) {
  return `
    <article class="card">
      <div class="card-top" style="background:${tour.color}">
        <span class="badge" style="background:rgba(255,255,255,.2);color:#fff">${tour.badge}</span>
        <h3>${tour.title}</h3>
        <strong>From $${tour.price}</strong>
      </div>
      <div class="card-body">
        <p><strong>${tour.time}</strong> · ${tour.duration}</p>
        <p class="muted">${tour.text}</p>
        <div class="card-pills">${tour.highlights.slice(0, 3).map((item) => `<span>${item}</span>`).join("")}</div>
        <div class="actions">
          <button class="btn primary" data-book="${tour.id}">Book Now</button>
          <button class="btn outline" data-view="${tour.id}">View Tour</button>
        </div>
      </div>
    </article>
  `;
}

function renderHome() {
  return `
    <section class="section hero">
      <div class="panel">
        <span class="badge">Cancun & Riviera Maya</span>
        <h1>Beyond The Reef Mexico</h1>
        <p class="muted">A complete branded website with homepage, tours page, tour details, and a booking page so visitors can browse and book in one clean flow.</p>
        <div class="actions">
          <button class="btn primary" data-go="booking">Book Your Tour</button>
          <button class="btn outline" data-go="tours">View Packages</button>
        </div>
      </div>
      <div class="panel dark">
        <span class="badge" style="background:rgba(255,255,255,.14);color:#fff">Private Experiences</span>
        <h3>Featured Escape</h3>
        <h2>Snorkel & Reef Escape</h2>
        <p>Strong homepage presentation, premium layout, and clear actions that move guests from curiosity to booking.</p>
      </div>
    </section>
    <section class="section">
      <h2>Popular Tours</h2>
      <div class="grid-3">${tours.map(tourCard).join("")}</div>
    </section>
  `;
}

function renderTours() {
  return `
    <section class="section">
      <span class="badge">Tours Page</span>
      <h2>Explore all tours</h2>
      <p class="muted">This page displays all the tours with strong Book Now buttons, detail pages, and easy navigation to the reservation form.</p>
      <div class="grid-3">${tours.map(tourCard).join("")}</div>
    </section>
  `;
}

function renderTourDetail() {
  const tour = getSelectedTour();
  return `
    <section class="section">
      <button class="btn outline" data-go="tours">Back to Tours</button>
      <div class="panel" style="margin-top:1rem">
        <div class="card-top" style="background:${tour.color}; border-radius:20px;">
          <span class="badge" style="background:rgba(255,255,255,.2);color:#fff">${tour.category}</span>
          <h2>${tour.title}</h2>
          <p>${tour.longDescription}</p>
        </div>
        <div class="actions">
          <button class="btn primary" data-book="${tour.id}">Book Now</button>
        </div>
        <h3>Highlights</h3>
        <p class="muted">${tour.highlights.join(" • ")}</p>
        <h3>Included</h3>
        <p class="muted">${tour.includes.join(" • ")}</p>
        <h3>Sample itinerary</h3>
        <p class="muted">${tour.itinerary.join(" → ")}</p>
      </div>
    </section>
  `;
}

function renderBooking() {
  const tour = getSelectedTour();
  return `
    <section class="section">
      <div class="hero">
        <div class="panel dark">
          <span class="badge" style="background:rgba(255,255,255,.12);color:#fff">Booking Page</span>
          <h2>Reserve your tour</h2>
          <p>Choose a tour, preferred date, and guest details then send your booking request.</p>
          <label class="field">
            <span>Switch Tour</span>
            <select id="tour-switch">
              ${tours.map((t) => `<option value="${t.id}" ${t.id === tour.id ? "selected" : ""}>${t.title} - $${t.price}</option>`).join("")}
            </select>
          </label>
        </div>
        <div class="panel">
          <div class="field"><label>Full Name</label><input placeholder="Your name" /></div>
          <div class="field"><label>Email</label><input type="email" placeholder="you@example.com" /></div>
          <div class="field"><label>Phone / WhatsApp</label><input placeholder="+52 ..." /></div>
          <div class="field"><label>Preferred Date</label><input type="date" /></div>
          <div class="field"><label>Special Notes</label><textarea rows="4" placeholder="Add requests, preferred time, celebration, or questions"></textarea></div>
          <button class="btn primary">Send Booking Request</button>
        </div>
      </div>
    </section>
  `;
}

function bindEvents() {
  document.querySelectorAll("[data-go]").forEach((el) => {
    el.addEventListener("click", () => setPage(el.dataset.go));
  });
  document.querySelectorAll("[data-view]").forEach((el) => {
    el.addEventListener("click", () => {
      selectedTourId = el.dataset.view;
      setPage("tour");
    });
  });
  document.querySelectorAll("[data-book]").forEach((el) => {
    el.addEventListener("click", () => {
      selectedTourId = el.dataset.book;
      setPage("booking");
    });
  });

  const switchEl = document.getElementById("tour-switch");
  if (switchEl) {
    switchEl.addEventListener("change", (e) => setSelectedTour(e.target.value));
  }

  document.querySelectorAll(".main-nav button").forEach((button) => {
    button.classList.toggle("active", button.dataset.go === page || (page === "tour" && button.dataset.go === "tours"));
  });
}

function render() {
  if (page === "home") app.innerHTML = renderHome();
  if (page === "tours") app.innerHTML = renderTours();
  if (page === "tour") app.innerHTML = renderTourDetail();
  if (page === "booking") app.innerHTML = renderBooking();
  bindEvents();
}

render();
