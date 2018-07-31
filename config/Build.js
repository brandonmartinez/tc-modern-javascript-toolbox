const path = require('path');

/**
 * Creates a configuration object to be used in the build process
 */
function BuildConfig() {
    'use strict';

    // Root paths
    const projectBasePath = path.resolve(__dirname, '../'),
        nodeModulesBasePath = path.resolve(__dirname, '../node_modules/');

    // Config
    const buildConfig = {
        'projectBasePath': projectBasePath,
        'nodemodules': nodeModulesBasePath,
    };

    return buildConfig;
}

module.exports = new BuildConfig();