const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
	entry: './src/client/js/main.js',
	mode: "development",
	watch: true,
	plugins: [new MiniCssExtractPlugin({ filename: 'css/styles.css' })],
	output: {
		filename: 'js/main.js',
		path: path.resolve(__dirname, 'assets'),
		clean: true,
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
				  loader: 'babel-loader',
				  options: {
					presets: ['@babel/preset-env']
				  }
				}
			},
			{
				test: /\.scss$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
			},
		]
	},
};