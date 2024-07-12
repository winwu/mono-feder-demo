const { EsbuildPlugin } = require('esbuild-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');

module.exports = {
    entry: './src/index.ts',
    // @TODO improve it by checking --env
    mode: 'development',
    devServer: {
        static: path.join(__dirname, 'dist'),
        port: 3000,
        historyApiFallback: true,
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.css', '.json'],
        // alias: {},
    },
    output: {
        publicPath: 'auto',
    },
    module: {
        rules: [
            {
                // Match .js, .jsx, .ts & .tsx files
                test: /\.[jt]sx?$/,
                loader: 'esbuild-loader',
                options: {
                    // JavaScript version to compile to
                    target: 'es2015', // = ES6
                },
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
        ],
    },
    plugins: [
        new ModuleFederationPlugin({
            name: 'app1',
            remotes: {
                shared: 'shared@http://localhost:3003/remoteEntry.js',
            },
        }),
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            title: 'App 1',
            template: './public/index.html',
        }),
    ],
    optimization: {
        minimizer: [
            new EsbuildPlugin({
                target: 'es2015', // Syntax to compile
                css: true, // Apply minification to CSS assets
            }),
        ],
    },
};
