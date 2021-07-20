const path = require('path');

module.exports = {
	mode: "production",
	entry: "./src/FKClient.ts",
	output: {
		path: path.resolve(__dirname, "./dist"),
		filename: "FKClient.js",
		library: {
			name: "FKClient",
			type: "umd",
		},
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js"],
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: "ts-loader"
			}
		]
	}
};
