const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');


module.exports = {
    mode: 'production',
    entry: {
        'js/index.js': ['./src/index.ts']
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: '[name]'
    },
    target: 'node',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    transpileOnly: true
                }
            },
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    plugins: [
        new UglifyJsPlugin(),
        // Generates an `index.html` file with the <script> injected.
        new HtmlWebpackPlugin({
            inject: false,
            template: "src/index.html",
            filename: "index.html"
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/css/*.css', to: 'css/', flatten: true }
            ]
        })
    ],
};
