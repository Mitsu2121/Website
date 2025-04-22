const root = document.getElementById("root");

function createCard(icon, title, content) {
  return `
    <div class="card">
      <h2>${icon} ${title}</h2>
      <p>${content}</p>
    </div>
  `;
}

function renderApp() {
  root.innerHTML = `
    <header>
      <h1>FloodSafe</h1>
      <p>Real-time alerts and guides by barangay</p>
    </header>

    <div class="input-group">
      <input id="locationInput" type="text" placeholder="Enter your barangay or district" />
      <button onclick="handleSearch()">Check</button>
    </div>

    <main>
      <div id="cards">
        ${createCard("⚠️", "Flood Alerts", "Real-time flood updates.")}
        ${createCard("📍", "Evacuation Routes", "Safe zones & routes.")}
        ${createCard("📞", "Emergency Contacts", "Barangay & rescue hotlines.")}
        ${createCard("📖", "Survival Guide", "Flood prep essentials.")}
      </div>
      <div id="map"></div>
    </main>

    <footer>
      &copy; ${new Date().getFullYear()} FloodSafe. Powered by community data & LGU reports.
    </footer>
  `;

  initMap();
}

function handleSearch() {
  const location = document.getElementById("locationInput").value.trim();
  if (!location) {
    alert("Please enter a location.");
    return;
  }

  const floodData = {
    "Quezon City": "Moderate flooding near Tandang Sora.",
    "Manila": "High floods in España and Taft.",
    "Marikina": "Alert level 2 at Marikina River.",
    "Pasig": "Localized floods near Pasig River.",
    "Caloocan": "Minimal flooding, roads clear."
  };

  const message = floodData[location] || "No recent flood data available for this area.";

  const card = createCard("🛰️", `Recent Flood Report: ${location}`, message);
  const cardsContainer = document.getElementById("cards");
  cardsContainer.insertAdjacentHTML("afterbegin", card);

  updateMap(location);
}

let map;
function initMap() {
  map = L.map("map", {
    zoomControl: true,         // allow zoom buttons
    dragging: true,            // allow dragging
    scrollWheelZoom: true,     // allow mouse scroll zoom
    doubleClickZoom: true,     // allow double-click zoom
    boxZoom: true,             // allow shift+drag zoom
    keyboard: true,            // allow keyboard nav
    tap: true,                 // allow mobile tap
    touchZoom: true            // allow pinch zoom
  }).setView([14.5995, 120.9842], 11);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
}


function updateMap(locationName) {
  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName + ', Metro Manila, Philippines')}`)
    .then(response => response.json())
    .then(data => {
      if (data && data.length > 0) {
        const loc = data[0];
        const lat = parseFloat(loc.lat);
        const lon = parseFloat(loc.lon);
        map.setView([lat, lon], 14);
        L.marker([lat, lon]).addTo(map);
      }
    });
}

renderApp();