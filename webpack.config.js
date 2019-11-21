const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const cssNano = require('cssnano');

module.exports = (env, argv) => {
    const dev = argv.mode !== 'production';
    const config = {
        entry: {
            common: path.resolve(__dirname, './frontend/entry/common.js'),
        },
        output: {
            path: path.resolve(__dirname, 'www/dist'),
            filename: '[name].js',
        },
        devtool: dev ? 'cheap-module-source-map' : false,
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                        },
                    },
                },
                {
                    test: /\.(sass|scss)$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'postcss-loader',
                        'sass-loader',
                    ],
                },
                {
                    test: /\.(jpg|jpeg|gif|png|svg|webp)$/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 1024,
                                name: 'img/[name].[ext]',
                            },
                        },
                    ],
                },
                {
                    test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts/',
                    },
                },
                {
                    test: /\.twig$/,
                    use: [
                        'raw-loader',
                        'twig-html-loader',
                    ],
                },
            ],
        },
        optimization: {
            minimizer: [
                new UglifyJsPlugin({
                    extractComments: true,
                }),
                new OptimizeCssAssetsPlugin({
                    cssProcessor: cssNano,
                    cssProcessorPluginOptions: {
                        preset: ['default', {
                            discardComments: {
                                removeAll: true,
                            },
                        }],
                    },
                    canPrint: true,
                }),
            ],
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: '[name].css',
            }),
            new webpack.ProvidePlugin({
                $: 'jquery',
            }),
        ],
    };

    if (!dev) {
        const distPath = '/dist/';
        const manifest = new WebpackAssetsManifest({
            integrity: true,
            integrityHashes: ['md5'],
            integrityPropertyName: 'md5',
            transform(assets, manifest) {
                for (var key in assets) {
                    if (key.search(/\.(css|js)$/i) <= 0) delete assets[key];
                }
            },
            customize(entry, original, manifest, asset) {
                return {
                    key: distPath + entry.value,
                    value: distPath + entry.value + '?' + asset.md5.substr(4, 22),
                };
            },
        });

        config.plugins.push(manifest);
    }

    return config;
};
