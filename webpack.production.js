'use strict';

const merge = require('webpack-merge');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = (buildConfig) => {
    const common = require('./webpack.common.js')(buildConfig);
    return merge(common, {
        plugins: [
            new webpack.SourceMapDevToolPlugin({
                moduleFilenameTemplate: info => {
                    let sanitizedPath = info.resourcePath
                        .replace(/\\/ig, '/')
                        .replace('src/scripts', 'scripts');

                    return sanitizedPath;
                },
            }),
            new UglifyJSPlugin({
                sourceMap: true,
                parallel: true
            })
        ]
    });
};