// AcePack — Counter-Malaysia
// Live map + counter over the YTL × NVIDIA Nemotron-Personas-Malaysia dataset (demo).

const TOTAL_PERSONAS = 1350000;

// 16 states / federal territories of Malaysia (approx. 2026 populations).
const states = [
  { name: "Selangor",        lat: 3.0738,  lng: 101.5183, pop: 7200000, langs: "Malay, English, Chinese, Tamil" },
  { name: "Johor",           lat: 1.4927,  lng: 103.7414, pop: 4100000, langs: "Malay, English, Chinese" },
  { name: "Sabah",           lat: 5.9804,  lng: 116.0735, pop: 3900000, langs: "Malay, Kadazan-Dusun, Bajau" },
  { name: "Sarawak",         lat: 1.5535,  lng: 110.3593, pop: 2900000, langs: "Malay, Iban, Bidayuh" },
  { name: "Perak",           lat: 4.5975,  lng: 101.0901, pop: 2500000, langs: "Malay, Chinese, Tamil" },
  { name: "Kedah",           lat: 6.1248,  lng: 100.3678, pop: 2200000, langs: "Malay" },
  { name: "Kelantan",        lat: 6.1254,  lng: 102.2381, pop: 1900000, langs: "Malay (Kelantan-Pattani)" },
  { name: "Kuala Lumpur",    lat: 3.1390,  lng: 101.6869, pop: 2000000, langs: "Malay, English, Chinese, Tamil" },
  { name: "Penang",          lat: 5.4141,  lng: 100.3288, pop: 1800000, langs: "Malay, Hokkien, English" },
  { name: "Pahang",          lat: 3.7634,  lng: 103.2202, pop: 1700000, langs: "Malay" },
  { name: "Terengganu",      lat: 5.3303,  lng: 103.1407, pop: 1300000, langs: "Malay (Terengganu)" },
  { name: "Negeri Sembilan", lat: 2.7259,  lng: 101.9378, pop: 1200000, langs: "Malay, Chinese" },
  { name: "Melaka",          lat: 2.1896,  lng: 102.2501, pop: 1000000, langs: "Malay, Chinese" },
  { name: "Perlis",          lat: 6.4406,  lng: 100.1986, pop: 260000,  langs: "Malay" },
  { name: "Putrajaya",       lat: 2.9264,  lng: 101.6964, pop: 120000,  langs: "Malay, English" },
  { name: "Labuan",          lat: 5.2831,  lng: 115.2308, pop: 100000,  langs: "Malay, English" },
];

const totalPop = states.reduce((s, x) => s + x.pop, 0);

function personasFor(pop) {
  return Math.round((pop / totalPop) * TOTAL_PERSONAS);
}

function format(n) {
  return n.toLocaleString("en-US");
}

/* ---------- Counter animation ---------- */
function animateCounter(el, target, duration = 1600) {
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = format(Math.round(target * eased));
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ---------- Map ---------- */
const map = L.map("map", { scrollWheelZoom: false }).setView([4.0, 109.0], 6);

L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
  attribution: '&copy; OpenStreetMap &copy; CARTO',
  subdomains: "abcd",
  maxZoom: 19,
}).addTo(map);

states.forEach((s) => {
  const count = personasFor(s.pop);
  const circle = L.circleMarker([s.lat, s.lng], {
    radius: 6 + Math.sqrt(count) / 45,
    color: "#6c7cff",
    weight: 1,
    fillColor: "#22d3ee",
    fillOpacity: 0.75,
  }).addTo(map);

  circle.bindPopup(
    `<strong>${s.name}</strong><br/>` +
    `Personas: <strong>${format(count)}</strong><br/>` +
    `Population: ${format(s.pop)}<br/>` +
    `Languages: ${s.langs}`
  );
});

/* ---------- State list ---------- */
const listEl = document.getElementById("stateList");
const sorted = [...states].sort((a, b) => b.pop - a.pop);

sorted.forEach((s) => {
  const chip = document.createElement("div");
  chip.className = "state-chip";
  const nm = document.createElement("span");
  nm.className = "nm";
  nm.textContent = s.name;
  const ct = document.createElement("span");
  ct.className = "ct";
  ct.textContent = format(personasFor(s.pop));
  chip.appendChild(nm);
  chip.appendChild(ct);
  listEl.appendChild(chip);
});

/* ---------- Init ---------- */
animateCounter(document.getElementById("nationalCounter"), TOTAL_PERSONAS);
document.getElementById("year").textContent = new Date().getFullYear();
