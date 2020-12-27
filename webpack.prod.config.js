const path = require('path');
const HTMLWebpackPlugin = require ('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

module.exports = {
    mode: "production",
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
                exclude: /node_modules/,
                use: ['babel-loader'],
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
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options:{
                            publicPath: '../',
                        }
                    }, 
                    {
                        loader: 'css-loader',
                        options:{
                            url: false
                        }
                    },
                    'postcss-loader', 'sass-loader'],
            },
        ],

    },
    plugins: [
        new HTMLWebpackPlugin({
            title: 'Game',
            template: path.resolve(__dirname, './src/index.html'),
            filename: 'index.html', 
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: 'src/styles/styles.css',
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/assets'),
                    to: path.resolve(__dirname, 'dist/src/assets')
                }
            ]
        }),
        new ImageMinimizerPlugin({
            minimizerOptions: {
                plugins: [
                ['gifsicle', { interlaced: true }],
                ['jpegtran', { progressive: true }],
                ['optipng', { optimizationLevel: 5 }],
                [
                'svgo',
                {
                    plugins: [
                    {
                        removeViewBox: false,
                    },
                    ],
                },
                ],
            ],
            },
        })
    ]
}
