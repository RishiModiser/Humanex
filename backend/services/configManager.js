// Configuration Manager - Validates and manages bot configuration

class ConfigManager {
  /**
   * Validate bot configuration
   */
  static validateConfig(config) {
    const errors = [];

    // Validate traffic settings
    if (!config.trafficSettings) {
      errors.push('Traffic settings are required');
    } else {
      const { totalProfiles, concurrentProfiles } = config.trafficSettings;
      
      if (!totalProfiles || totalProfiles < 1) {
        errors.push('Total profiles must be at least 1');
      }
      
      if (!concurrentProfiles || concurrentProfiles < 1) {
        errors.push('Concurrent profiles must be at least 1');
      }
      
      if (concurrentProfiles > totalProfiles) {
        errors.push('Concurrent profiles cannot exceed total profiles');
      }
    }

    // Validate website details or RPA script
    if (!config.websiteDetails && !config.rpaScript) {
      errors.push('Either website details or RPA script is required');
    }

    // Validate website details if provided
    if (config.websiteDetails) {
      if (!config.websiteDetails.urls || !Array.isArray(config.websiteDetails.urls)) {
        errors.push('Website URLs must be an array');
      } else if (config.websiteDetails.urls.length === 0) {
        errors.push('At least one URL is required');
      } else {
        config.websiteDetails.urls.forEach((urlConfig, index) => {
          if (!urlConfig.url) {
            errors.push(`URL ${index + 1} is missing URL field`);
          }
          if (!this.isValidUrl(urlConfig.url)) {
            errors.push(`URL ${index + 1} is not a valid URL: ${urlConfig.url}`);
          }
        });
      }
    }

    // Validate RPA script if provided
    if (config.rpaScript) {
      if (!config.rpaScript.actions || !Array.isArray(config.rpaScript.actions)) {
        errors.push('RPA script must contain actions array');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Check if string is valid URL
   */
  static isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get default configuration
   */
  static getDefaultConfig() {
    return {
      trafficSettings: {
        totalProfiles: 10,
        concurrentProfiles: 2,
        platform: 'Windows',
        visitType: 'direct',
        humanLikeScrolling: true,
        enableInteraction: true,
        headless: false,
        maxPages: 3
      },
      websiteDetails: {
        urls: [
          {
            url: 'https://example.com',
            stayTime: 5000
          }
        ]
      },
      proxySettings: {
        enabled: false,
        rotate: true
      }
    };
  }
}

module.exports = ConfigManager;
