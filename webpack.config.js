const path = require('path');
const PugPlugin = require('pug-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');

const isDev = process.env.NODE_ENV === 'development';

const babelOptions = (preset) => {
  const opts = {
    presets: [
      '@babel/preset-env',
    ],
  };
  if (preset) {
    opts.presets.push(preset);
  }
  return opts;
};

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: {
    index: './index.pug',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  devtool: isDev ? 'source-map' : false,
  devServer: {
    port: 4200,
    hot: isDev,
  },
  plugins: [
    new PugPlugin({
      pretty: isDev,
      js: {
        filename: 'js/[name].[contenthash:8].js',
      },
      css: {
        filename: 'css/[name].[contenthash:8].css',
      },
    }),
    new SpriteLoaderPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: PugPlugin.loader,
      },
      {
        test: /\.(css|sass|scss)$/,
        use: ['css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|gif|ico)$/,
        type: 'asset/resource',
        generator: {
          filename: 'img/[name][ext][query]',
        },
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext][query]',
        },
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        options: {
          extract: true,
          outputPath: 'img/',
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: babelOptions(),
        },
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: babelOptions('@babel/preset-typescript'),
        },
      },
    ],
  },
};
