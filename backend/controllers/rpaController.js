// RPA Controller - Handles RPA script execution and validation

const RPAExecutor = require('../services/rpaExecutor');
const { v4: uuidv4 } = require('uuid');

/**
 * Execute an RPA script
 */
const executeScript = async (req, res) => {
  try {
    const { script, config } = req.body;

    if (!script || !script.actions) {
      return res.status(400).json({
        error: 'Invalid script',
        message: 'Script must contain an actions array'
      });
    }

    const executionId = uuidv4();
    global.broadcastLog(`🎬 Starting RPA script execution: ${executionId}`);

    const executor = new RPAExecutor(config);
    
    // Execute in background
    executor.execute(script).then(result => {
      global.broadcastLog(`✅ RPA script completed: ${executionId}`);
      global.broadcastStatus({
        type: 'rpa_completed',
        executionId,
        result
      });
    }).catch(error => {
      global.broadcastLog(`❌ RPA script failed: ${executionId} - ${error.message}`);
      global.broadcastStatus({
        type: 'rpa_failed',
        executionId,
        error: error.message
      });
    });

    res.json({
      success: true,
      executionId,
      message: 'RPA script execution started'
    });

  } catch (error) {
    console.error('Error executing RPA script:', error);
    res.status(500).json({
      error: 'Failed to execute script',
      message: error.message
    });
  }
};

/**
 * Validate an RPA script without executing
 */
const validateScript = (req, res) => {
  try {
    const { script } = req.body;

    if (!script) {
      return res.status(400).json({
        valid: false,
        errors: ['Script is required']
      });
    }

    const errors = [];

    // Check for actions array
    if (!script.actions || !Array.isArray(script.actions)) {
      errors.push('Script must contain an actions array');
    }

    // Validate each action
    if (script.actions) {
      script.actions.forEach((action, index) => {
        if (!action.type) {
          errors.push(`Action ${index} is missing type`);
        }
        if (!action.id) {
          errors.push(`Action ${index} is missing id`);
        }
      });
    }

    res.json({
      valid: errors.length === 0,
      errors
    });

  } catch (error) {
    console.error('Error validating script:', error);
    res.status(500).json({
      valid: false,
      errors: [error.message]
    });
  }
};

/**
 * Get sample RPA script templates
 */
const getTemplates = (req, res) => {
  try {
    const templates = [
      {
        name: 'Basic Navigation',
        description: 'Navigate to a URL and wait',
        script: {
          actions: [
            {
              id: uuidv4(),
              type: 'navigate',
              config: {
                url: 'https://example.com',
                waitUntil: 'domcontentloaded'
              }
            },
            {
              id: uuidv4(),
              type: 'wait',
              config: {
                duration: 3000
              }
            }
          ]
        }
      },
      {
        name: 'Search Workflow',
        description: 'Navigate, search, and interact',
        script: {
          actions: [
            {
              id: uuidv4(),
              type: 'navigate',
              config: {
                url: 'https://www.google.com',
                waitUntil: 'networkidle'
              }
            },
            {
              id: uuidv4(),
              type: 'input',
              config: {
                selector: 'input[name="q"]',
                text: 'humanex automation',
                typeDelay: 100
              }
            },
            {
              id: uuidv4(),
              type: 'click',
              config: {
                selector: 'input[name="btnK"]'
              }
            },
            {
              id: uuidv4(),
              type: 'wait',
              config: {
                duration: 5000
              }
            }
          ]
        }
      },
      {
        name: 'Scroll and Interact',
        description: 'Scroll page with human-like behavior',
        script: {
          actions: [
            {
              id: uuidv4(),
              type: 'navigate',
              config: {
                url: 'https://example.com',
                waitUntil: 'load'
              }
            },
            {
              id: uuidv4(),
              type: 'scrollPage',
              config: {
                scrollType: 'position',
                position: 'middle',
                wheelDistance: [100, 150],
                sleepTime: [200, 300]
              }
            },
            {
              id: uuidv4(),
              type: 'wait',
              config: {
                duration: 2000
              }
            },
            {
              id: uuidv4(),
              type: 'scrollPage',
              config: {
                scrollType: 'position',
                position: 'bottom',
                wheelDistance: [150, 200],
                sleepTime: [300, 500]
              }
            }
          ]
        }
      }
    ];

    res.json({ templates });

  } catch (error) {
    console.error('Error getting templates:', error);
    res.status(500).json({
      error: 'Failed to get templates',
      message: error.message
    });
  }
};

module.exports = {
  executeScript,
  validateScript,
  getTemplates
};
