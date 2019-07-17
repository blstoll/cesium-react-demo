const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const cesiumSource = 'node_modules/cesium/Source';
const cesiumWorkers = '../Build/Cesium/Workers';

module.exports = {
    entry: { main: './src/index.js' },
    output: {
        path: path.resolve(__dirname, '..', 'dist'),
        filename: '[name].[hash].js',

        // Needed to compile multi-line strings in Cesium
        sourcePrefix: '',
    },
    /*
    amd: {
        // Enable webpack-friendly use of require in Cesium
        toUrlUndefined: true,
    },
    node: {
        // Resolve node module use of fs
        fs: 'empty',
    },
    */
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    module: {
        // Cesium error: require function is used in a way in which dependencies cannot be statically extracted
        unknownContextCritical: false,
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [
                    process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ],
            },
            {
                // Primarily used to load CSS from 3rd party packages like Cesium
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ],
            },
            {
                test: /\.(png|gif|jpg|jpeg|svg|xml|json)$/,
                use: {
                    loader: 'url-loader',
                },
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            hash: true,
            filename: './index.html'
        }),
        new MiniCssExtractPlugin({
           filename: '[name].css',
           chunkFilename: '[id].css'
        }),
        new CopyWebpackPlugin([{
            from: path.join(cesiumSource, cesiumWorkers),
            to: 'Workers'
        }]),
        new CopyWebpackPlugin([{
            from: path.join(cesiumSource, 'Assets'),
            to: 'Assets'
        }]),
        new CopyWebpackPlugin([{
            from: path.join(cesiumSource, 'Widgets'),
            to: 'Widgets'
        }]),
        new webpack.DefinePlugin({
            CESIUM_BASE_URL: JSON.stringify(''),
        }),
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]cesium/,
                    name: 'Cesium',
                    chunks: 'all'
                },
            },
        },
    },
}