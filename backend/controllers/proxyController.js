// Proxy Controller - Manages proxy configuration and validation

const fs = require('fs').promises;
const path = require('path');

let proxies = [];

/**
 * Upload and parse proxy list
 */
const uploadProxies = async (req, res) => {
  try {
    const { proxies: proxyList } = req.body;

    if (!proxyList || !Array.isArray(proxyList)) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Proxies must be provided as an array'
      });
    }

    // Parse and validate proxies
    const parsed = [];
    const errors = [];

    proxyList.forEach((proxyString, index) => {
      try {
        const proxy = parseProxy(proxyString);
        if (proxy) {
          parsed.push(proxy);
        } else {
          errors.push(`Line ${index + 1}: Invalid proxy format`);
        }
      } catch (error) {
        errors.push(`Line ${index + 1}: ${error.message}`);
      }
    });

    proxies = parsed;

    // Save to file
    const proxyFilePath = path.join(__dirname, '../../proxies.txt');
    await fs.writeFile(proxyFilePath, proxyList.join('\n'), 'utf8');

    global.broadcastLog(`✅ Loaded ${parsed.length} proxies`);

    res.json({
      success: true,
      loaded: parsed.length,
      errors,
      proxies: parsed
    });

  } catch (error) {
    console.error('Error uploading proxies:', error);
    res.status(500).json({
      error: 'Failed to upload proxies',
      message: error.message
    });
  }
};

/**
 * List all loaded proxies
 */
const listProxies = (req, res) => {
  try {
    res.json({
      count: proxies.length,
      proxies
    });
  } catch (error) {
    console.error('Error listing proxies:', error);
    res.status(500).json({
      error: 'Failed to list proxies',
      message: error.message
    });
  }
};

/**
 * Validate a single proxy
 */
const validateProxy = async (req, res) => {
  try {
    const { proxy: proxyString } = req.body;

    if (!proxyString) {
      return res.status(400).json({
        error: 'Proxy string is required'
      });
    }

    const proxy = parseProxy(proxyString);
    
    if (!proxy) {
      return res.status(400).json({
        valid: false,
        error: 'Invalid proxy format'
      });
    }

    // Test proxy connection
    const axios = require('axios');
    const proxyAgent = require('https-proxy-agent');

    try {
      const agent = new proxyAgent.HttpsProxyAgent(proxy.url);
      const response = await axios.get('https://api.ipify.org?format=json', {
        httpsAgent: agent,
        timeout: 10000
      });

      res.json({
        valid: true,
        ip: response.data.ip,
        proxy
      });
    } catch (error) {
      res.json({
        valid: false,
        error: 'Proxy connection failed',
        details: error.message
      });
    }

  } catch (error) {
    console.error('Error validating proxy:', error);
    res.status(500).json({
      error: 'Failed to validate proxy',
      message: error.message
    });
  }
};

/**
 * Parse proxy string into structured format
 * Supports formats:
 * - http://username:password@host:port
 * - https://host:port
 * - socks5://username:password@host:port
 * - host:port:username:password
 * - host:port
 */
function parseProxy(proxyString) {
  const str = proxyString.trim();

  // Format: protocol://username:password@host:port
  const urlMatch = str.match(/^(https?|socks5):\/\/(?:([^:]+):([^@]+)@)?([^:]+):(\d+)$/);
  if (urlMatch) {
    const [, protocol, username, password, host, port] = urlMatch;
    return {
      url: proxyString,
      protocol,
      host,
      port: parseInt(port),
      username: username || null,
      password: password || null
    };
  }

  // Format: host:port:username:password
  const parts = str.split(':');
  if (parts.length === 4) {
    const [host, port, username, password] = parts;
    return {
      url: `http://${username}:${password}@${host}:${port}`,
      protocol: 'http',
      host,
      port: parseInt(port),
      username,
      password
    };
  }

  // Format: host:port
  if (parts.length === 2) {
    const [host, port] = parts;
    return {
      url: `http://${host}:${port}`,
      protocol: 'http',
      host,
      port: parseInt(port),
      username: null,
      password: null
    };
  }

  return null;
}

/**
 * Get a random proxy from the list
 */
function getRandomProxy() {
  if (proxies.length === 0) {
    return null;
  }
  return proxies[Math.floor(Math.random() * proxies.length)];
}

module.exports = {
  uploadProxies,
  listProxies,
  validateProxy,
  getRandomProxy,
  getProxies: () => proxies
};
