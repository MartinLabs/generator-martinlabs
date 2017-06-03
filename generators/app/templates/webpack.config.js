var webpack = require('webpack');
var paths = require('./webpack.path.json');
//Path module
var path = require('path');
//Plugin Sass
var ExtractTextPlugin = require('extract-text-webpack-plugin');
//Reload dist folder every compilation
var CleanWebpackPlugin = require('clean-webpack-plugin');
//Check if it is on dev or production
var inProduction = process.env.NODE_ENV === 'production';

module.exports = {
    entry: paths,
    devtool: inProduction ? "eval" : "source-map",
    output: {//Compilated js
        path: path.resolve(__dirname, './dist'),
        filename: '[name].[chunkhash].js'
    },
    resolve: {
        alias: {
            vue: 'vue/dist/vue.js'
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        'css': 'vue-style-loader!css-loader',
                        'scss': 'vue-style-loader!css-loader!sass-loader',
                    }
                }
            },
            {//Compile Css
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader'],
                    fallback: 'style-loader'
                })
            },
            {//Compile Sass
                test: /\.s[ac]ss$/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader', 'sass-loader'],
                    fallback: 'style-loader'
                })
            },
            {//Compile images and fonts
                test: /\.(png|jpe?g|gif|svg|otf|eot|ttf|woff|woff2)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[hash].[ext]',
                    publicPath: '../dist/',
                    outputPath: 'assets/'
                }
            },
            {//Active es2015
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            }
        ]
    },
    plugins: [
        //Clear dist
        new CleanWebpackPlugin(['dist'], {
            root: __dirname,
            verbose: true,
            dry: false
        }),

        //Compilated css
        new ExtractTextPlugin('[name].[chunkhash].css'),

        //Minificate css
        new webpack.LoaderOptionsPlugin({
            minimize: inProduction
        }),

        //Creates manifest.json
        function () {
            this.plugin('done', stats => {
                require('fs').writeFileSync(
                        path.join(__dirname, 'dist/manifest.json'),
                        JSON.stringify(stats.toJson().assetsByChunkName));
            });
        }
    ]
};

//if it is in production then minificate js
if (inProduction) {
    module.exports.plugins.push(
            new webpack.optimize.UglifyJsPlugin());
}