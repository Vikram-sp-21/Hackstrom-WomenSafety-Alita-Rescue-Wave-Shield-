// Simple demo admin login (replace with backend API for production)
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.onsubmit = function(e) {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const loginMsg = document.getElementById('loginMsg');
      // Demo: accept any "admin@example.com"/"securepass" for hackathon demo
      if (email === "admin@example.com" && password === "securepass") {
        loginMsg.style.color = "#27ae60";
        loginMsg.textContent = "Login successful! Redirecting...";
        setTimeout(() => window.location = "alerts.html", 1000);
      } else {
        loginMsg.style.color = "#de2e43";
        loginMsg.textContent = "Invalid email or password.";
      }
    };
  }
});

// Demo client-side registration (for hackathon demo; extend for backend integration)
document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.onsubmit = function(e) {
      e.preventDefault();
      const name = document.getElementById('regName').value;
      const email = document.getElementById('regEmail').value;
      const role = document.getElementById('regRole').value;
      const password = document.getElementById('regPassword').value;
      const registerMsg = document.getElementById('registerMsg');
      // Demo: Accept any non-empty values, show success
      if (name && email && role && password) {
        registerMsg.style.color = "#27ae60";
        registerMsg.textContent = "Registration successful! You can now log in.";
        setTimeout(() => window.location = "login.html", 1500);
      } else {
        registerMsg.style.color = "#de2e43";
        registerMsg.textContent = "Please fill all fields correctly.";
      }
    };
  }
});

// Animated stat card updater
function animateStatNum(domId, target, duration = 1500) {
  const dom = document.getElementById(domId);
  if (!dom) return;
  let curr = 0, increment = Math.ceil(target / (duration / 20));
  const step = () => {
    curr += increment;
    if (curr >= target) {
      dom.textContent = target;
    } else {
      dom.textContent = curr;
      setTimeout(step, 20);
    }
  };
  step();
}

// Chart.js setup
function renderCaseCharts() {
  // Weekly trend data (mock example)
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dangerData = [7, 5, 8, 6, 9, 4, 4];
  const rapeData = [1, 0, 2, 1, 1, 1, 0];
  const safeData = [32, 30, 34, 36, 38, 33, 34];

  // Line chart: per day trends
  const ctxTrend = document.getElementById('caseTrendChart').getContext('2d');
  new Chart(ctxTrend, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: "Danger Cases",
          data: dangerData,
          borderColor: "#de2e43",
          backgroundColor: "rgba(222,46,67,0.22)",
          fill: true,
          tension: 0.4
        },
        {
          label: "Rape Cases",
          data: rapeData,
          borderColor: "#ffb100",
          backgroundColor: "rgba(255,177,0,0.16)",
          fill: true,
          tension: 0.4
        },
        {
          label: "Safe Cases",
          data: safeData,
          borderColor: "#27ae60",
          backgroundColor: "rgba(39,174,96,0.14)",
          fill: true,
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: "#fff" } } },
      scales: {
        x: { ticks: { color: "#fff" }, grid: { color: "#20335a" } },
        y: { ticks: { color: "#fff" }, grid: { color: "#20335a" } }
      }
    }
  });

  // Pie/Doughnut chart: overall cases
  const ctxPie = document.getElementById('casePieChart').getContext('2d');
  new Chart(ctxPie, {
    type: 'doughnut',
    data: {
      labels: ["Danger Cases", "Rape Cases", "Safe Cases"],
      datasets: [{
        data: [43, 75, 237],
        backgroundColor: ["#de2e43", "#ffb100", "#27ae60"],
        borderWidth: 2,
        borderColor: "#172347"
      }]
    },
    options: {
      plugins: {
        legend: { labels: { color: "#fff" } }
      },
      cutout: '63%'
    }
  });
}

// Only run if on analytics.html
if (window.location.pathname.endsWith('analytics.html')) {
  animateStatNum("dangerCount", 43);
  animateStatNum("rapeCount", 75);
  animateStatNum("safeCount", 217);
  setTimeout(renderCaseCharts, 400);
}


function showProfileModal() {
  document.getElementById('profileModal').style.display = 'flex';
}
function hideProfileModal() {
  document.getElementById('profileModal').style.display = 'none';
}
function logoutProfile() {
  alert('Logged out for demo!'); // Replace with real logic if needed
  window.location = "login.html"; // Redirect to login
}


// Dark/Light mode toggle
const modeToggle = document.getElementById('modeToggle');
if (modeToggle) {
  modeToggle.onclick = () => {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
    modeToggle.textContent = isDark ? '🌙' : '☀️';
  };
}



// Example: fetch and display alerts in `alerts.html`
async function fetchAlerts() {
  const table = document.getElementById('alertsTableBody');
  if (!table) return;
  let resp = await fetch('/api/alerts');
  let alerts = await resp.json();
  table.innerHTML = alerts.map(alert => `
    <tr>
      <td>${alert.timestamp}</td>
      <td>${alert.location}</td>
      <td>${alert.type}</td>
      <td class="severity ${alert.severity.toLowerCase()}">${alert.severity}</td>
      <td><button class="resolve-btn" onclick="resolveAlert(${alert.id})">Resolve</button></td>
    </tr>
  `).join('');
}

// Call this as needed
if (window.location.pathname.endsWith('alerts.html')) fetchAlerts();


// Demo: Simulate men/women presence every few seconds
function updateInsideZone(zoneId, men, women, anomaly = "") {
  document.getElementById(`men${zoneId}`).textContent = men;
  document.getElementById(`women${zoneId}`).textContent = women;
  
  const alertBox = document.getElementById(`alert${zoneId}`);
  const statusElem = document.querySelector(`#zone${zoneId} .status`);
  if (anomaly) {
    alertBox.style.display = 'block';
    alertBox.textContent = anomaly;
    statusElem.textContent = "UNSAFE";
    statusElem.className = "status unsafe";
  } else {
    alertBox.style.display = 'none';
    statusElem.textContent = "SAFE";
    statusElem.className = "status safe";
  }
}

// Example periodic simulation:
setInterval(() => {
  const men = Math.floor(Math.random()*6), women = Math.floor(Math.random()*3);
  let anomaly = "";
  if (women === 1 && men >= 3) anomaly = "Woman Surrounded by Men!";
  else if (women === 1 && men === 0) anomaly = "Lone Woman Detected";
  updateInsideZone('Park', men, women, anomaly);
}, 5000);
// Mock news data for demo (replace with fetch from backend/API for production)
const newsDatas = [
  {
    title: "Delhi Police Launches New Safety App for Women",
    date: "2025-10-30",
    summary: "The app offers SOS alerts, live tracking, and direct police contact for rapid response in emergencies.",
    url: "https://news.example.com/delhi-police-women-app"
  },
  {
    title: "Mumbai: Lone Woman Aided by Crowd After Alert Raised",
    date: "2025-10-28",
    summary: "Quick action by surrounding people and public surveillance helped avert a potential threat at CST station.",
    url: "https://news.example.com/mumbai-women-safety-crowd"
  },
  {
    title: "AI-powered Cameras Reduce Incidents in Bengaluru Parks",
    date: "2025-10-26",
    summary: "Smart monitoring analytics in key parks led to a 30% drop in women's harassment cases this quarter.",
    url: "https://news.example.com/bangalore-ai-cameras"
  }
];

// Load news on Live Feed page
function loadLiveNews() {
  const grid = document.getElementById('newsGrid');
  if (!grid) return;
  grid.innerHTML = newsData.map(news => `
    <div class="news-card">
      <div class="news-title">${news.title}</div>
      <div class="news-date">${news.date}</div>
      <div class="news-summary">${news.summary}</div>
      <a class="news-link" href="${news.url}" target="_blank">Read More</a>
    </div>
  `).join('');
}

// Call loadLiveNews on page load if needed
if (window.location.pathname.endsWith('live.html')) loadLiveNews();

// Show 3 "You are in Danger Zone" critical alerts at the top
const dangerAlerts = [
  {
    message: "You are in Danger Zone!",
    location: "Sector 17, Chandigarh",
    time: "2025-11-01 03:01"
  },
  {
    message: "You are in Danger Zone!",
    location: "MG Road, Bengaluru",
    time: "2025-11-01 02:54"
  },
  {
    message: "You are in Danger Zone!",
    location: "Connaught Place, Delhi",
    time: "2025-11-01 02:45"
  }
];

function showCriticalAlerts() {
  const container = document.getElementById('criticalAlerts');
  if (!container) return;
  container.innerHTML = dangerAlerts.map(alert => `
    <div class="critical-alert">
      <span class="alert-icon">⚠️</span>
      <span>${alert.message}</span>
      <span style="font-size:0.98rem;opacity:0.69;padding-left:8px">${alert.location}, ${alert.time}</span>
    </div>
  `).join('');
}

// Demo alert data for table – can also fetch via backend/api
const alertsDemo = [
  {
    id: 1,
    timestamp: "2025-11-01 03:01",
    location: "Sector 17, Chandigarh",
    type: "Danger Zone Entry",
    severity: "High"
  },
  {
    id: 2,
    timestamp: "2025-11-01 02:54",
    location: "MG Road, Bengaluru",
    type: "Suspicious Crowd Detected",
    severity: "Medium"
  },
  {
    id: 3,
    timestamp: "2025-11-01 02:45",
    location: "Connaught Place, Delhi",
    type: "SOS Raised by User",
    severity: "High"
  }
];

function loadAlertsList() {
  const tbody = document.getElementById('alertsTableBody');
  if (!tbody) return;
  tbody.innerHTML = alertsDemo.map(a => `
    <tr>
      <td>${a.timestamp}</td>
      <td>${a.location}</td>
      <td>${a.type}</td>
      <td class="severity ${a.severity.toLowerCase()}">${a.severity}</td>
      <td><button class="resolve-btn" onclick="resolveAlert(${a.id})">Resolve</button></td>
    </tr>
  `).join('');
}

// Alert resolving demo logic
function resolveAlert(id) {
  alert('Alert ' + id + ' marked as resolved for demo!');
}

// Auto run if on alerts page
if (window.location.pathname.endsWith('alerts.html')) {
  showCriticalAlerts();
  loadAlertsList();
}

// Panel logic
// Demo: user location
const userLatLng = [28.6139, 77.2090]; // Connaught Place, Delhi

// For sharing
const mapUrl = `https://www.google.com/maps?q=${userLatLng[0]},${userLatLng[1]}`;
const shareMsg = `SOS from Priya Singh. Last location: ${userLatLng[0]},${userLatLng[1]} (${mapUrl})`;

// Show location-sharing buttons
function shareLocation() {
  document.getElementById('sharePlatforms').style.display = 'block';
}

// Demo: Send default response message
function sendDefaultMsg() {
  alert("Default reply sent: 'Team is nearby, follow the location we send.'");
}

// Map initialisation and safe route demo
let map, marker, routePolyline;
function initMap() {
  map = L.map('map').setView(userLatLng, 15);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: "Map data & contributors"
  }).addTo(map);

  marker = L.marker(userLatLng).addTo(map)
    .bindPopup("<strong>Pirya Singh (Last Location)</strong>").openPopup();

  // Initial route (mock)
  const safeRoute = [
    userLatLng,
    [28.6155, 77.2191],   // Example point (safe node)
    [28.6200, 77.2300]    // Safe destination
  ];
  routePolyline = L.polyline(safeRoute, { color: '#27ae60', weight: 5 }).addTo(map);
  map.fitBounds(routePolyline.getBounds());
}

// Set new safe route (mock - updates map with new green route)
function setSafeRoute() {
  const newSafeRoute = [
    userLatLng,
    [28.6225, 77.2231], // Example new safe node
    [28.6260, 77.2380]  // New safe destination
  ];
  if (routePolyline) { routePolyline.remove(); }
  routePolyline = L.polyline(newSafeRoute, { color: '#27ae60', weight: 5, dashArray: "12,8" }).addTo(map);
  map.fitBounds(routePolyline.getBounds());
  alert('New safe route set! Map updated and user notified.');
}

// Live location tracking demo (updates marker)
function updateUserLocation(lat, lng) {
  marker.setLatLng([lat, lng]);
  map.setView([lat, lng], 15);
  document.getElementById('userLocation').textContent = `${lat}, ${lng}`;
}

// Simulate user movement (demo only)
setTimeout(() => updateUserLocation(28.6240, 77.2135), 7000); // Moves marker after 7s

// Initialise map only on admin-panel.html
if (window.location.pathname.endsWith('admin-panel.html')) {
  window.onload = initMap;
}

// new section 
const newsData = [
  {
    title: "Delhi Police Launches New Safety App for Women",
    date: "2025-10-30",
    summary: "The app offers SOS alerts, live tracking, and direct police contact for rapid response in emergencies.",
    url: "https://news.example.com/delhi-police-women-app"
  },
  {
    title: "Mumbai Crowd Helps Woman in Danger at CST Station",
    date: "2025-10-28",
    summary: "Public vigilance and swift group action prevented a possible safety incident, setting a positive example.",
    url: "https://news.example.com/mumbai-women-safety-crowd"
  },
  {
    title: "AI Surveillance Reduces Park Incidents in Bengaluru",
    date: "2025-10-26",
    summary: "Smart monitoring analytics led to a 30% drop in harassment cases at public parks this quarter.",
    url: "https://news.example.com/bangalore-ai-cameras"
  }
];

function loadLiveNews() {
  const grid = document.getElementById('newsGrid');
  if (!grid) return;
  grid.innerHTML = newsData.map(news => `
    <div class="news-card">
      <div class="news-title">${news.title}</div>
      <div class="news-date">${news.date}</div>
      <div class="news-summary">${news.summary}</div>
      <a class="news-link" href="${news.url}" target="_blank">Read More</a>
    </div>
  `).join('');
}

if (window.location.pathname.endsWith('live.html')) loadLiveNews();

const moreSOS = [
  {
    name: "Aditi Kumar",
    location: "Sector 27, Gurgaon",
    time: "2025-11-01 07:44:33",
    msg: "I am feeling unsafe near Akash Mall, please help!"
  },
  {
    name: "Pooja Jain",
    location: "Laxmi Nagar, Delhi",
    time: "2025-11-01 07:39:51",
    msg: "Crowd harassment reported near Metro Gate 2."
  },
  {
    name: "Farha Shaikh",
    location: "Powai Lake, Mumbai",
    time: "2025-11-01 07:29:14",
    msg: "Lost and surrounded, requesting urgent help!"
  }
];

function loadSOSRequests() {
  const grid = document.getElementById('sosGrid');
  if (!grid) return;
  grid.innerHTML = moreSOS.map(r => `
    <div class="sos-card">
      <div><strong>${r.name}</strong> <span class="sos-info">@ ${r.location}</span></div>
      <div class="sos-time">${r.time}</div>
      <div class="sos-msg">"${r.msg}"</div>
      <button class="sos-respond-btn" onclick="respondSOS('${r.name}', '${r.location}')">Respond</button>
    </div>
  `).join('');
}

function respondSOS(name, location) {
  alert(`Response sent to ${name} at ${location}.`);
}

// Auto-load requests if on admin panel
if (window.location.pathname.endsWith('admin-panel.html')) loadSOSRequests();

function fetchLiveLocation() {
  fetch('/api/user-location')
    .then(res => res.json())
    .then(data => {
      // Update person info card
      showPersonInfo({
        name: data.name,
        age: data.age || "21",
        contact: data.contact || "+91-12345-67890",
        status: data.status || "Danger",
        timestamp: data.timestamp || "2025-11-01T07:34:00Z",
        lat: data.lat,
        lng: data.lng
      });
      document.getElementById('userLocation').textContent =
        `${data.lat}, ${data.lng} (${data.timestamp})`;
      // ...rest of map update code as before...
    });
}

function showPersonInfo(info) {
  const card = document.getElementById('personInfoCard');
  if (!card) return;
  const statusClass = info.status.toLowerCase() === "safe" ? "safe" : "danger";
  card.innerHTML = `
    <strong>${info.name}</strong> 
    <span class="person-info-status ${statusClass}">${info.status}</span><br>
    <span class="person-info-label">Age:</span> ${info.age}<br>
    <span class="person-info-label">Contact:</span> <a href="tel:${info.contact}">${info.contact}</a><br>
    <span class="person-info-label">Last Seen:</span> ${info.timestamp}<br>
    <span class="person-info-label">Location:</span> ${info.lat}, ${info.lng}
  `;
}

// Map/Panel init as before
const upcomingRequests = [
  {
    name: "Trisha Bose",
    location: "Vashi, Navi Mumbai",
    time: "2025-11-01 08:33:19",
    msg: "Received threatening call, feeling unsafe at bus stop."
  },
  {
    name: "Maya Yadav",
    location: "Anna Salai, Chennai",
    time: "2025-11-01 08:28:02",
    msg: "Strangers following, need immediate help near metro."
  },
  {
    name: "Ritika Patil",
    location: "Salt Lake, Kolkata",
    time: "2025-11-01 08:19:54",
    msg: "Cornered in parking lot, please send assistance!"
  }
];

function loadUpcomingRequests() {
  const grid = document.getElementById('upcomingRequestsGrid');
  if (!grid) return;
  grid.innerHTML = upcomingRequests.map(r => `
    <div class="upcoming-card">
      <div><strong>${r.name}</strong> <span class="upcoming-info">@ ${r.location}</span></div>
      <div class="upcoming-time">${r.time}</div>
      <div class="upcoming-msg">"${r.msg}"</div>
      <button class="upcoming-btn" onclick="respondUpcomingRequest('${r.name}')">Respond</button>
      <button class="upcoming-btn" onclick="viewLocation('${r.location}')">View Location</button>
    </div>
  `).join('');
}

function respondUpcomingRequest(name) {
  alert(`Response sent to ${name}.`);
}

function viewLocation(location) {
  alert(`Opening map for location: ${location}`); // Replace with real map linking as needed
}

// Auto-load requests if on admin panel
if (window.location.pathname.endsWith('admin-panel.html')) loadUpcomingRequests();

// Assumes 'map' and 'marker' are global Leaflet objects already initialized

function locateMap(lat, lng, label = "Target Location") {
  if (map && marker) {
    marker.setLatLng([lat, lng]).bindPopup(`<strong>${label}</strong>`).openPopup();
    map.setView([lat, lng], 16, { animate: true });
  } else if (map) {
    marker = L.marker([lat, lng]).addTo(map).bindPopup(`<strong>${label}</strong>`).openPopup();
    map.setView([lat, lng], 16, { animate: true });
  }
}

// Demo "Twitter-like" posts (reverse chron)
let newsPosts = [
  {
    user: "System Bot",
    msg: "Women rights walk today at Connaught Place – be vigilant and safe.",
    time: "2025-11-01 08:47"
  },
  {
    user: "Admin",
    msg: "AI cameras detected crowding at MG Road park, team dispatched.",
    time: "2025-11-01 08:40"
  },
  {
    user: "Aditi Kumar",
    msg: "Received speedy help at Laxmi Nagar Metro, thanks safety patrol!",
    time: "2025-11-01 08:28"
  }
];

function loadTwitterFeed() {
  const feed = document.getElementById('twitterFeedList');
  if (!feed) return;
  feed.innerHTML = newsPosts.map(post => `
    <div class="twitter-feed-card">
      <div class="twitter-card-meta">${post.user} &middot; ${post.time}</div>
      <div class="twitter-card-msg">${post.msg}</div>
    </div>
  `).join('');
}

// News posting logic for demo
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('newsForm');
  if (form) {
    form.onsubmit = function(e) {
      e.preventDefault();
      const input = document.getElementById('newsInput');
      const now = new Date();
      const time = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) + " " +
                   now.toLocaleDateString([], {day: '2-digit', month: '2-digit', year: 'numeric'});
      newsPosts.unshift({
        user: "Admin",
        msg: input.value,
        time: time
      });
      input.value = "";
      loadTwitterFeed();
    };
  }
  if (window.location.pathname.endsWith('live.html')) loadTwitterFeed();
});
