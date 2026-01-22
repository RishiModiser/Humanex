// Bot Controller - Manages bot lifecycle and execution

const AutomationEngine = require('../services/automationEngine');
const ConfigManager = require('../services/configManager');

let botInstance = null;
let isRunning = false;
let stats = {
  completedProfiles: 0,
  remainingProfiles: 0,
  activeProfiles: 0,
  totalProfiles: 0,
  startTime: null
};

/**
 * Start the bot with given configuration
 */
const startBot = async (req, res) => {
  try {
    if (isRunning) {
      return res.status(400).json({
        error: 'Bot is already running',
        message: 'Please stop the current bot before starting a new one'
      });
    }

    const config = req.body;
    
    // Validate configuration
    const validation = ConfigManager.validateConfig(config);
    if (!validation.valid) {
      return res.status(400).json({
        error: 'Invalid configuration',
        errors: validation.errors
      });
    }

    // Initialize bot instance
    botInstance = new AutomationEngine(config);
    
    // Reset stats
    stats = {
      completedProfiles: 0,
      remainingProfiles: config.trafficSettings.totalProfiles || 0,
      activeProfiles: 0,
      totalProfiles: config.trafficSettings.totalProfiles || 0,
      startTime: new Date()
    };

    // Start bot execution
    isRunning = true;
    global.broadcastLog('🚀 Bot started successfully');
    global.broadcastStatus(stats);

    // Execute bot in background
    botInstance.start((update) => {
      stats = { ...stats, ...update };
      global.broadcastStatus(stats);
    }).then(() => {
      isRunning = false;
      global.broadcastLog('✅ Bot execution completed');
      global.broadcastStatus({ ...stats, status: 'completed' });
    }).catch((error) => {
      isRunning = false;
      global.broadcastLog(`❌ Bot execution failed: ${error.message}`);
      global.broadcastStatus({ ...stats, status: 'error', error: error.message });
    });

    res.json({
      success: true,
      message: 'Bot started successfully',
      stats
    });

  } catch (error) {
    console.error('Error starting bot:', error);
    isRunning = false;
    res.status(500).json({
      error: 'Failed to start bot',
      message: error.message
    });
  }
};

/**
 * Stop the running bot
 */
const stopBot = async (req, res) => {
  try {
    if (!isRunning || !botInstance) {
      return res.status(400).json({
        error: 'No bot is running',
        message: 'There is no active bot to stop'
      });
    }

    global.broadcastLog('⏸️ Stopping bot...');
    await botInstance.stop();
    isRunning = false;
    botInstance = null;

    global.broadcastLog('🛑 Bot stopped successfully');
    global.broadcastStatus({ ...stats, status: 'stopped' });

    res.json({
      success: true,
      message: 'Bot stopped successfully',
      stats
    });

  } catch (error) {
    console.error('Error stopping bot:', error);
    res.status(500).json({
      error: 'Failed to stop bot',
      message: error.message
    });
  }
};

/**
 * Get current bot status and statistics
 */
const getStatus = (req, res) => {
  try {
    res.json({
      isRunning,
      stats,
      uptime: stats.startTime ? Date.now() - stats.startTime.getTime() : 0
    });
  } catch (error) {
    console.error('Error getting status:', error);
    res.status(500).json({
      error: 'Failed to get status',
      message: error.message
    });
  }
};

module.exports = {
  startBot,
  stopBot,
  getStatus
};
