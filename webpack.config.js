const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const JS_PATH = './src/client/js/';

module.exports = {
	entry: {
		main: JS_PATH + 'main.js',
		post: JS_PATH + 'post.js',
		join: JS_PATH + 'join.js',
		profile: JS_PATH + 'profile.js',
		editProfile: JS_PATH + 'editProfile.js',
		upload: JS_PATH + 'upload.js',
		login: JS_PATH + 'login.js',
		admin: JS_PATH + 'admin.js',
	},
	plugins: [new MiniCssExtractPlugin({ filename: 'css/styles.css' })],
	output: {
		filename: 'js/[name].js',
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