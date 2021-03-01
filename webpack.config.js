const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: 'production',
    plugins: [
        new MiniCssExtractPlugin(),
        new CopyPlugin({
            patterns: [
              { from: "src/*.html", to: "[name].[ext]" },
            ],
          })
    ],
    module: {
        rules: [
            {
                test: /\.(scss|css)$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader']
            }
        ]
    },
    devServer: {
        contentBase: path.resolve(__dirname, './dist'),
        open: true,
        compress: true,
        hot: true,
        port: 8080
    }
}
