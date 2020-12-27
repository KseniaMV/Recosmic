const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require ('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: "development",
    entry: {
        main: path.resolve(__dirname, './src/index.ts'),
    },
    devServer: {
        historyApiFallback: true,
        contentBase: path.resolve(__dirname, './dist'),
        open: true,
        compress: true,
        hot: true,
        port: 8080
      },
    devtool: 'inline-source-map',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].bundle.js',
    },
    module:{
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            ],
        rules: [
            {
                test: /\.js$/,
            },
            
            {
            test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
            type: 'asset/resource',
            use: [
                {
                loader: 'file-loader',
                    options: {
                        name: '[name].[ext]'
                    },
                },
            ],
            },
            {
                test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
                type: 'asset/inline',
                use: [
                    {
                    loader: 'file-loader',
                        options: {
                            name: '[name].[ext]'
                        },
                    },
                  ],
            },
            {
                test: /\.(mp.3|mp.4|wav|)$/,
                type: 'asset/inline',
                use: [
                    {
                    loader: 'file-loader',
                        options: {
                            name: '[name].[ext]'
                        },
                    },
                  ],
            },
            {
                test: /\.(scss|css)$/,
                use: [
                    'style-loader',
                    {
                    loader: 'css-loader',
                        options:{
                            url: false
                        }
                    }, 
                    'postcss-loader', 'sass-loader'
                ],
            },
        ],

    },
    plugins: [
        new HTMLWebpackPlugin({
            title: 'English for kids',
            template: path.resolve(__dirname, './src/index.html'),
            filename: 'index.html', 
        }),
        new CleanWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/'),
                    to: path.resolve(__dirname, 'dist/src/')
                }
            ]
        })
    ]

}
