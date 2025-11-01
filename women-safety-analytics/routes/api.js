const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Utility to read/write JSON files
function readJson(file) {
  return new Promise((resolve, reject) =>
    fs.readFile(file, 'utf-8', (err, data) => err ? reject(err) : resolve(JSON.parse(data)))
  );
}
function writeJson(file, obj) {
  return new Promise((resolve, reject) =>
    fs.writeFile(file, JSON.stringify(obj, null, 2), err => err ? reject(err) : resolve())
  );
}

const alertsFile = path.join(__dirname, '..', 'alerts.json');
const usersFile = path.join(__dirname, '..', 'users.json');
const newsFile = path.join(__dirname, '..', 'newsfeed.json');

// Alerts API
router.get('/alerts', async (req, res) => {
  try { const alerts = await readJson(alertsFile); res.json(alerts); }
  catch { res.status(500).json({ error: "Failed to read alerts." }); }
});

router.post('/alerts', async (req, res) => {
  try {
    const alert = req.body;
    const alerts = await readJson(alertsFile);
    alerts.unshift({ id: Date.now(), ...alert });
    await writeJson(alertsFile, alerts);
    res.status(201).json({ message: "Alert added.", alert: alerts[0] });
  } catch {
    res.status(500).json({ error: "Failed to save alert." });
  }
});

router.post('/alerts/resolve', async (req, res) => {
  try {
    const { id } = req.body;
    let alerts = await readJson(alertsFile);
    alerts = alerts.map(a => a.id === id ? { ...a, resolved: true } : a);
    await writeJson(alertsFile, alerts);
    res.json({ message: "Alert resolved." });
  } catch {
    res.status(500).json({ error: "Failed to resolve alert." });
  }
});

// User registration
router.post('/register', async (req, res) => {
  try {
    const user = req.body;
    const users = await readJson(usersFile);
    if (users.some(u => u.email === user.email))
      return res.status(400).json({ error: "Email already registered." });
    users.push({ id: Date.now(), ...user });
    await writeJson(usersFile, users);
    res.status(201).json({ message: "Registered.", user });
  } catch {
    res.status(500).json({ error: "Registration error." });
  }
});

// User login (demo, no hashing/session)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = await readJson(usersFile);
    const user = users.find(u => u.email === email && u.password === password);
    if (user) return res.json({ success: true, user });
    res.status(401).json({ error: "Invalid credentials." });
  } catch {
    res.status(500).json({ error: "Login error." });
  }
});

// Newsfeed
router.get('/news', async (req, res) => {
  try { const news = await readJson(newsFile); res.json(news); }
  catch { res.status(500).json({ error: "Failed to get news." }); }
});

router.post('/news', async (req, res) => {
  try {
    const post = req.body;
    const news = await readJson(newsFile);
    news.unshift({ id: Date.now(), ...post });
    await writeJson(newsFile, news);
    res.status(201).json({ message: "Posted.", post: news[0] });
  } catch {
    res.status(500).json({ error: "Failed to post news." });
  }
});

// Live location for SOS (latest request)
router.get('/user-location', async (req, res) => {
  // For demo: Return a static user, update as needed
  res.json({
    name: "Priya Singh",
    age: "21",
    contact: "+91-12345-67890",
    status: "Danger",
    lat: 28.6139,
    lng: 77.2090,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;

// GET: Returns the latest SOS/live user location
router.get('/user-location', async (req, res) => {
  // For demo: return static; replace with DB lookup for real-time
  res.json({
    name: "Priya Singh",
    age: "21",
    contact: "+91-12345-67890",
    status: "Danger",
    lat: 28.6139,
    lng: 77.2090,
    timestamp: new Date().toISOString(),
    route: [
      [28.6139, 77.2090],     // Start
      [28.6159, 77.2191],     // Via-point
      [28.6200, 77.2300]      // Safe destination
    ]
  });
});

// POST: Update user location (call this from mobile/user app for live tracking)
router.post('/user-location', async (req, res) => {
  // In real app: Save to a file/DB; here, just acknowledge
  const { lat, lng } = req.body;
  res.json({ success: true, lat, lng, timestamp: new Date().toISOString() });
});
