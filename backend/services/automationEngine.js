// Automation Engine - Core bot execution logic with Playwright

const { chromium } = require('playwright');
const RPAExecutor = require('./rpaExecutor');
const proxyController = require('../controllers/proxyController');
const { randomUserAgent, randomFingerprint, sleep } = require('../utils/helpers');

class AutomationEngine {
  constructor(config) {
    this.config = config;
    this.isRunning = false;
    this.browsers = [];
    this.stats = {
      completed: 0,
      active: 0,
      failed: 0
    };
  }

  /**
   * Start bot execution
   */
  async start(onUpdate) {
    this.isRunning = true;
    this.onUpdate = onUpdate;

    const { trafficSettings, websiteDetails, proxySettings, rpaScript } = this.config;
    
    const totalProfiles = trafficSettings.totalProfiles || 1;
    const concurrentProfiles = trafficSettings.concurrentProfiles || 1;
    const platform = trafficSettings.platform || 'Windows';
    
    global.broadcastLog(`🚀 Starting bot with ${totalProfiles} total profiles, ${concurrentProfiles} concurrent`);

    // Process profiles in batches
    for (let i = 0; i < totalProfiles && this.isRunning; i += concurrentProfiles) {
      const batch = [];
      const batchSize = Math.min(concurrentProfiles, totalProfiles - i);

      for (let j = 0; j < batchSize; j++) {
        const profileNumber = i + j + 1;
        batch.push(this.executeProfile(profileNumber, platform));
      }

      // Wait for batch to complete
      try {
        await Promise.all(batch);
      } catch (error) {
        global.broadcastLog(`❌ Batch error: ${error.message}`);
      }

      // Update stats
      this.stats.completed += batchSize;
      if (this.onUpdate) {
        this.onUpdate({
          completedProfiles: this.stats.completed,
          remainingProfiles: totalProfiles - this.stats.completed,
          activeProfiles: 0
        });
      }

      // Small delay between batches
      if (i + concurrentProfiles < totalProfiles) {
        await sleep(2000);
      }
    }

    global.broadcastLog('✅ All profiles completed');
    this.isRunning = false;
  }

  /**
   * Execute a single profile
   */
  async executeProfile(profileNumber, platform) {
    let browser = null;
    let context = null;

    try {
      this.stats.active++;
      if (this.onUpdate) {
        this.onUpdate({ activeProfiles: this.stats.active });
      }

      global.broadcastLog(`▶️ Starting profile #${profileNumber}`);

      // Get proxy if enabled
      let proxy = null;
      if (this.config.proxySettings && this.config.proxySettings.enabled) {
        proxy = proxyController.getRandomProxy();
        if (proxy) {
          global.broadcastLog(`🔐 Using proxy: ${proxy.host}:${proxy.port}`);
        }
      }

      // Browser launch options
      const launchOptions = {
        headless: this.config.trafficSettings.headless !== false,
        args: [
          '--disable-blink-features=AutomationControlled',
          '--no-sandbox',
          '--disable-setuid-sandbox'
        ]
      };

      if (proxy) {
        launchOptions.proxy = {
          server: proxy.url,
          username: proxy.username,
          password: proxy.password
        };
      }

      // Launch browser
      browser = await chromium.launch(launchOptions);
      this.browsers.push(browser);

      // Create context with fingerprinting
      const fingerprint = randomFingerprint(platform);
      const contextOptions = {
        viewport: fingerprint.viewport,
        userAgent: fingerprint.userAgent,
        locale: fingerprint.locale,
        timezoneId: fingerprint.timezone
      };

      context = await browser.newContext(contextOptions);
      const page = await context.newPage();

      // Apply stealth scripts
      await this.applyStealthScripts(page);

      // Execute RPA script or website visit
      if (this.config.rpaScript && this.config.rpaScript.actions) {
        global.broadcastLog(`🎬 Executing RPA script for profile #${profileNumber}`);
        const executor = new RPAExecutor({ page, context });
        await executor.execute(this.config.rpaScript);
      } else if (this.config.websiteDetails && this.config.websiteDetails.urls) {
        // Visit websites
        for (const urlConfig of this.config.websiteDetails.urls) {
          await this.visitWebsite(page, urlConfig);
        }
      }

      global.broadcastLog(`✅ Profile #${profileNumber} completed`);

    } catch (error) {
      this.stats.failed++;
      global.broadcastLog(`❌ Profile #${profileNumber} failed: ${error.message}`);
      
      // Take screenshot on error
      try {
        if (context) {
          const page = context.pages()[0];
          if (page) {
            const screenshotPath = `./backend/logs/error_${profileNumber}_${Date.now()}.png`;
            await page.screenshot({ path: screenshotPath });
            global.broadcastLog(`📸 Screenshot saved: ${screenshotPath}`);
          }
        }
      } catch (screenshotError) {
        // Ignore screenshot errors
      }
    } finally {
      // Cleanup
      this.stats.active--;
      if (this.onUpdate) {
        this.onUpdate({ activeProfiles: this.stats.active });
      }

      try {
        if (context) await context.close();
        if (browser) await browser.close();
      } catch (cleanupError) {
        // Ignore cleanup errors
      }

      // Remove from browsers array
      const index = this.browsers.indexOf(browser);
      if (index > -1) {
        this.browsers.splice(index, 1);
      }
    }
  }

  /**
   * Visit a website with human-like behavior
   */
  async visitWebsite(page, urlConfig) {
    const { url, stayTime } = urlConfig;
    
    global.broadcastLog(`🌐 Navigating to: ${url}`);
    
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Human-like scrolling if enabled
    if (this.config.trafficSettings.humanLikeScrolling) {
      await this.humanScroll(page);
    }
    
    // Random interactions if enabled
    if (this.config.trafficSettings.enableInteraction) {
      await this.randomInteractions(page);
    }
    
    // Stay time
    const stay = stayTime || 5000;
    global.broadcastLog(`⏱️ Staying for ${stay}ms`);
    await sleep(stay);
  }

  /**
   * Apply stealth scripts to avoid detection
   */
  async applyStealthScripts(page) {
    await page.addInitScript(() => {
      // Override webdriver property
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined
      });

      // Override plugins
      Object.defineProperty(navigator, 'plugins', {
        get: () => [1, 2, 3, 4, 5]
      });

      // Override languages
      Object.defineProperty(navigator, 'languages', {
        get: () => ['en-US', 'en']
      });

      // Chrome runtime
      window.chrome = {
        runtime: {}
      };

      // Permissions
      const originalQuery = window.navigator.permissions.query;
      window.navigator.permissions.query = (parameters) => (
        parameters.name === 'notifications'
          ? Promise.resolve({ state: Notification.permission })
          : originalQuery(parameters)
      );
    });
  }

  /**
   * Human-like scrolling behavior
   */
  async humanScroll(page) {
    try {
      const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
      const viewportHeight = await page.evaluate(() => window.innerHeight);
      
      let currentPosition = 0;
      const scrollSteps = Math.floor(scrollHeight / viewportHeight);
      
      for (let i = 0; i < Math.min(scrollSteps, 5); i++) {
        const scrollAmount = Math.random() * 300 + 200;
        currentPosition += scrollAmount;
        
        await page.evaluate((pos) => {
          window.scrollTo({ top: pos, behavior: 'smooth' });
        }, currentPosition);
        
        await sleep(Math.random() * 1000 + 500);
      }
    } catch (error) {
      // Ignore scroll errors
    }
  }

  /**
   * Random mouse movements and interactions
   */
  async randomInteractions(page) {
    try {
      // Random mouse movements
      for (let i = 0; i < 3; i++) {
        const x = Math.random() * 800 + 100;
        const y = Math.random() * 600 + 100;
        await page.mouse.move(x, y);
        await sleep(Math.random() * 500 + 200);
      }
    } catch (error) {
      // Ignore interaction errors
    }
  }

  /**
   * Stop bot execution
   */
  async stop() {
    global.broadcastLog('🛑 Stopping bot...');
    this.isRunning = false;

    // Close all browsers
    for (const browser of this.browsers) {
      try {
        await browser.close();
      } catch (error) {
        // Ignore close errors
      }
    }

    this.browsers = [];
    global.broadcastLog('✅ Bot stopped');
  }
}

module.exports = AutomationEngine;
