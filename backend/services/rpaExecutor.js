// RPA Executor - Executes RPA scripts step by step

const { sleep, randomInRange } = require('../utils/helpers');

class RPAExecutor {
  constructor(config) {
    this.page = config.page;
    this.context = config.context;
    this.currentStep = 0;
  }

  /**
   * Execute RPA script
   */
  async execute(script) {
    if (!script || !script.actions) {
      throw new Error('Invalid RPA script format');
    }

    global.broadcastLog(`🎬 Executing RPA script with ${script.actions.length} actions`);

    for (let i = 0; i < script.actions.length; i++) {
      this.currentStep = i + 1;
      const action = script.actions[i];
      
      try {
        await this.executeAction(action);
        global.broadcastLog(`✅ Step ${this.currentStep}/${script.actions.length}: ${action.type} completed`);
      } catch (error) {
        global.broadcastLog(`❌ Step ${this.currentStep}/${script.actions.length}: ${action.type} failed - ${error.message}`);
        throw error;
      }
    }

    global.broadcastLog('✅ RPA script execution completed');
  }

  /**
   * Execute a single action
   */
  async executeAction(action) {
    const { type, config } = action;

    switch (type) {
      case 'navigate':
        await this.actionNavigate(config);
        break;

      case 'wait':
        await this.actionWait(config);
        break;

      case 'scrollPage':
        await this.actionScroll(config);
        break;

      case 'click':
        await this.actionClick(config);
        break;

      case 'input':
        await this.actionInput(config);
        break;

      case 'refresh':
        await this.actionRefresh(config);
        break;

      case 'goBack':
        await this.actionGoBack(config);
        break;

      case 'newPage':
        await this.actionNewPage(config);
        break;

      case 'closePage':
        await this.actionClosePage(config);
        break;

      case 'closeOtherPages':
        await this.actionCloseOtherPages(config);
        break;

      case 'screenshot':
        await this.actionScreenshot(config);
        break;

      case 'hover':
        await this.actionHover(config);
        break;

      case 'select':
        await this.actionSelect(config);
        break;

      case 'evaluate':
        await this.actionEvaluate(config);
        break;

      default:
        throw new Error(`Unknown action type: ${type}`);
    }
  }

  /**
   * Navigate to URL
   */
  async actionNavigate(config) {
    const { url, waitUntil = 'domcontentloaded' } = config;
    global.broadcastLog(`🌐 Navigating to: ${url}`);
    await this.page.goto(url, { waitUntil, timeout: 30000 });
  }

  /**
   * Wait for specified duration
   */
  async actionWait(config) {
    const { duration, selector } = config;
    
    if (selector) {
      global.broadcastLog(`⏳ Waiting for element: ${selector}`);
      await this.page.waitForSelector(selector, { timeout: duration || 10000 });
    } else {
      const waitTime = duration || 1000;
      global.broadcastLog(`⏳ Waiting for ${waitTime}ms`);
      await sleep(waitTime);
    }
  }

  /**
   * Scroll page with human-like behavior
   */
  async actionScroll(config) {
    const {
      scrollType = 'position',
      position = 'middle',
      wheelDistance = [100, 200],
      sleepTime = [200, 400],
      selector
    } = config;

    global.broadcastLog(`📜 Scrolling page (${scrollType})`);

    if (selector) {
      // Scroll to element
      await this.page.locator(selector).scrollIntoViewIfNeeded();
    } else if (scrollType === 'position') {
      // Scroll to position
      let targetY = 0;
      const pageHeight = await this.page.evaluate(() => document.body.scrollHeight);
      const viewportHeight = await this.page.evaluate(() => window.innerHeight);

      switch (position) {
        case 'top':
          targetY = 0;
          break;
        case 'middle':
          targetY = (pageHeight - viewportHeight) / 2;
          break;
        case 'bottom':
          targetY = pageHeight - viewportHeight;
          break;
        default:
          targetY = parseInt(position) || 0;
      }

      // Human-like scrolling with multiple steps
      const currentY = await this.page.evaluate(() => window.pageYOffset);
      const distance = Math.abs(targetY - currentY);
      const steps = Math.ceil(distance / randomInRange(wheelDistance[0], wheelDistance[1]));

      for (let i = 0; i < steps; i++) {
        const stepDistance = randomInRange(wheelDistance[0], wheelDistance[1]);
        const newY = currentY < targetY
          ? Math.min(currentY + stepDistance * (i + 1), targetY)
          : Math.max(currentY - stepDistance * (i + 1), targetY);

        await this.page.evaluate((y) => {
          window.scrollTo({ top: y, behavior: 'smooth' });
        }, newY);

        await sleep(randomInRange(sleepTime[0], sleepTime[1]));
      }
    }
  }

  /**
   * Click element
   */
  async actionClick(config) {
    const { selector, button = 'left', delay = 100 } = config;
    global.broadcastLog(`👆 Clicking: ${selector}`);
    
    await this.page.waitForSelector(selector, { timeout: 10000 });
    await this.page.click(selector, { button, delay });
  }

  /**
   * Input text
   */
  async actionInput(config) {
    const { selector, text, typeDelay = 100, clear = true } = config;
    global.broadcastLog(`⌨️ Typing into: ${selector}`);
    
    await this.page.waitForSelector(selector, { timeout: 10000 });
    
    if (clear) {
      await this.page.fill(selector, '');
    }
    
    // Type with delay for human-like behavior
    await this.page.type(selector, text, { delay: typeDelay });
  }

  /**
   * Refresh page
   */
  async actionRefresh(config) {
    global.broadcastLog('🔄 Refreshing page');
    await this.page.reload({ waitUntil: 'domcontentloaded' });
  }

  /**
   * Go back
   */
  async actionGoBack(config) {
    global.broadcastLog('⬅️ Going back');
    await this.page.goBack({ waitUntil: 'domcontentloaded' });
  }

  /**
   * Create new page
   */
  async actionNewPage(config) {
    global.broadcastLog('📄 Creating new page');
    this.page = await this.context.newPage();
  }

  /**
   * Close current page
   */
  async actionClosePage(config) {
    global.broadcastLog('❌ Closing current page');
    await this.page.close();
    
    // Switch to first available page
    const pages = this.context.pages();
    if (pages.length > 0) {
      this.page = pages[0];
    }
  }

  /**
   * Close all pages except current
   */
  async actionCloseOtherPages(config) {
    global.broadcastLog('❌ Closing other pages');
    const pages = this.context.pages();
    
    for (const page of pages) {
      if (page !== this.page) {
        await page.close();
      }
    }
  }

  /**
   * Take screenshot
   */
  async actionScreenshot(config) {
    const { path = `./backend/logs/screenshot_${Date.now()}.png`, fullPage = false } = config;
    global.broadcastLog(`📸 Taking screenshot: ${path}`);
    await this.page.screenshot({ path, fullPage });
  }

  /**
   * Hover over element
   */
  async actionHover(config) {
    const { selector } = config;
    global.broadcastLog(`🎯 Hovering over: ${selector}`);
    await this.page.waitForSelector(selector, { timeout: 10000 });
    await this.page.hover(selector);
  }

  /**
   * Select dropdown option
   */
  async actionSelect(config) {
    const { selector, value } = config;
    global.broadcastLog(`📋 Selecting option: ${value} in ${selector}`);
    await this.page.waitForSelector(selector, { timeout: 10000 });
    await this.page.selectOption(selector, value);
  }

  /**
   * Execute JavaScript in page context
   */
  async actionEvaluate(config) {
    const { script } = config;
    global.broadcastLog('💻 Executing custom script');
    await this.page.evaluate(script);
  }
}

module.exports = RPAExecutor;
