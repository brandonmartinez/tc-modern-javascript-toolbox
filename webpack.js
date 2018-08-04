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
            new webpack.SourceMapDevToolPlugin({
                filename: '[name].min.js.map',
                moduleFilenameTemplate: info => {
                    let sanitizedPath = info.resourcePath
                        .replace(/\\/ig, '/')
                        .replace('src/scripts', 'scripts');

                    return sanitizedPath;
                },
            }),
            new webpack.ProvidePlugin({}),
            new webpack.DefinePlugin({
                IS_DEVELOPMENT: buildConfig.environment !== 'production'
            })
        ]
    };
};