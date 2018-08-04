'use strict';

const merge = require('webpack-merge');
const webpack = require('webpack');

module.exports = (buildConfig) => {
    const common = require('./webpack.common.js')(buildConfig);
    return merge(common, {
        plugins: [
            new webpack.SourceMapDevToolPlugin({
                filename: '[name].min.js.map',
                moduleFilenameTemplate: info => {
                    let sanitizedPath = info.resourcePath
                        .replace(/\\/ig, '/')
                        .replace('src/scripts', 'scripts');

                    return sanitizedPath;
                },
            })
        ]
    });
};