const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');

const extractSass = new ExtractTextPlugin({
	filename: "style.css",
	disable: process.env.NODE_ENV === 'development'
});

module.exports = {
	entry: "./wwwroot/app",
	output: {
		path: path.resolve("./wwwroot", 'dist'),
		filename: "build.js"
	},
	devtool: 'source-map',
	module: {
		loaders: [
			{
				test: /\.css$/,
				loaders: ['style-loader', 'css-loader', 'resolve-url-loader']
			},
			{
				test: /\.scss$/,
				loaders: ['style-loader', 'css-loader', 'resolve-url-loader', 'sass-loader?sourceMap']
			},
			{
				test: /\.woff2?$|\.ttf$|\.otf$|\.eot$|\.svg$|\.png|\.jpe?g|\.gif$/,
				loader: 'file-loader'
			}/*,
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			}*/
		],
		rules: [
			/*{
				test: /\.scss$/,
				use: extractSass.extract({
					use: [
						{
							loader: 'css-loader'
						},
						{
							loader: 'resolve-url'
						},
						{
							loader: 'sass-loader'
						}
					],
					fallback: 'style-loader'
				})
			},*/
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			}
		]
	},
	plugins: [
		new ExtractTextPlugin('styles.css', {
            allChunks: true
		}),
		new webpack.ProvidePlugin({
			$: "jquery/dist/jquery.min.js",
			jQuery: "jquery/dist/jquery.min.js",
			"window.jQuery": "jquery/dist/jquery.min.js",
			Vue: 'vue/dist/vue.min.js'
		}),
		//new webpack.optimize.UglifyJsPlugin()
	]
};
