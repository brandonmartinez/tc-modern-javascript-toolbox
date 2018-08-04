'use strict';
const webpack = require('webpack');

// Shared configuration
module.exports = (buildConfig) => {
    return {
        mode: buildConfig.environment,
        entry: {
            app: buildConfig.web.scripts.file
        },
        output: {
            filename: '[name].min.js',
            path: buildConfig.web.dist.basePath
        },
        module: {
            rules: [{
                test: /\.jsx?$/,
                exclude: buildConfig.nodeModules,
                include: buildConfig.web.scripts.cwd,
                loader: 'babel-loader',
                query: {
                    presets: ['env', 'react']
                }
            }]
        },
        plugins: [
            new webpack.ProvidePlugin({}),
            new webpack.DefinePlugin({
                IS_DEVELOPMENT: buildConfig.environment !== 'production'
            })
        ]
    };
};