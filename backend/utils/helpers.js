// Helper utilities

/**
 * Sleep for specified milliseconds
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get random number in range
 */
function randomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Get random user agent
 */
function randomUserAgent(platform = 'Windows') {
  const windowsAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/120.0.0.0'
  ];

  const androidAgents = [
    'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 12; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 13; SM-S901B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
  ];

  const agents = platform.toLowerCase() === 'android' ? androidAgents : windowsAgents;
  return agents[Math.floor(Math.random() * agents.length)];
}

/**
 * Generate random browser fingerprint
 */
function randomFingerprint(platform = 'Windows') {
  const windowsViewports = [
    { width: 1920, height: 1080 },
    { width: 1366, height: 768 },
    { width: 1536, height: 864 },
    { width: 1440, height: 900 }
  ];

  const androidViewports = [
    { width: 393, height: 851 },
    { width: 412, height: 915 },
    { width: 360, height: 800 }
  ];

  const timezones = [
    'America/New_York',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Australia/Sydney'
  ];

  const locales = ['en-US', 'en-GB', 'fr-FR', 'de-DE', 'es-ES'];

  const viewports = platform.toLowerCase() === 'android' ? androidViewports : windowsViewports;

  return {
    userAgent: randomUserAgent(platform),
    viewport: viewports[Math.floor(Math.random() * viewports.length)],
    locale: locales[Math.floor(Math.random() * locales.length)],
    timezone: timezones[Math.floor(Math.random() * timezones.length)]
  };
}

/**
 * Format timestamp
 */
function formatTimestamp(date = new Date()) {
  return date.toISOString();
}

/**
 * Sanitize filename
 */
function sanitizeFilename(filename) {
  return filename.replace(/[^a-z0-9_\-\.]/gi, '_');
}

module.exports = {
  sleep,
  randomInRange,
  randomUserAgent,
  randomFingerprint,
  formatTimestamp,
  sanitizeFilename
};
