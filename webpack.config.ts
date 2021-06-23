const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {VueLoaderPlugin} = require('vue-loader');
const {DefinePlugin} = require('webpack');

module.exports = {
    entry: ['./src/main.ts'],
    devtool: 'inline-source-map',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '',
        globalObject: 'this'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: ['babel-loader']
            },
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: 'ts-loader',
                options: {
                    appendTsSuffixTo: [/\.vue$/],
                },
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.css$/,
                loader: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.scss$/,
                loader: [
                    'vue-style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(png|jpg)$/,
                loader: 'url-loader'
            },
            {
                test: /\.(vert|frag)$/,
                loader: ['raw-loader']
            },
            {
                test: /\.wav$/,
                exclude: /node_modules/,
                loader: ['arraybuffer-loader']
            },
            {
                test: /\.ttf$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts/'
                        }
                    }
                ]
            },
        ]
    },
    devServer: {
        contentBase: './dist',
        hot: true,
        writeToDisk: true
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            title: '',
            template: './index.html',
        }),
        new VueLoaderPlugin(),
        new DefinePlugin({
            __VUE_OPTIONS_API__: true,
            __VUE_PROD_DEVTOOLS__: false
        }),
    ],
    resolve: {
        extensions: ['.ts', '.js', '.vue', '.json'],
        alias: {
            'vue': '@vue/runtime-dom'
        }
    }
};
