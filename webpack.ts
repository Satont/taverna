import VueLoaderPlugin from 'vue-loader/lib/plugin'
import HtmlPlugin from 'html-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import { resolve } from 'path'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'

const isDev = () => process.env.NODE_ENV === 'development'

export default {
  devServer: {
    historyApiFallback: true,
  },
  mode: 'development',
  entry: './src/client/index.ts',
  output: {
    path: resolve(process.cwd(), 'public'),
    //publicPath: '/static/',
    filename: 'dest/[name].[contenthash].js',
    chunkFilename: 'dest/[name].[contenthash].js',
    pathinfo: false,
  },
  performance: { hints: false },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin(),
      new CssMinimizerPlugin(),
    ],
  },
  module: {
    rules: [
      {
        test: /\.vue$/i,
        loader: 'vue-loader',
      },
      {
        test: /\.css$/i,
        use: [
          isDev() ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.ts$/i,
        use: {
          loader: 'ts-loader',
          options: { experimentalFileCaching: true, appendTsSuffixTo: [/\.vue$/] },
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      dangerouslyAllowCleanPatternsOutsideProject: true,
    }),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: 'dest/[name].[contenthash].css',
      chunkFilename: 'dest/[id].[contenthash].css',
    }),
    new HtmlPlugin({ filename: 'index.html', template: 'src/client/index.html' })
  ],
  resolve: {
    extensions: ['.ts', '.js', '.vue'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
    },
  },
}
