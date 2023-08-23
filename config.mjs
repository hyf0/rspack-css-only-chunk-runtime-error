import path from "path";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from 'html-webpack-plugin'

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isRunningWebpack = !!process.env.WEBPACK;
const isRunningRspack = !!process.env.RSPACK;
if (!isRunningRspack && !isRunningWebpack) {
  throw new Error("Unknown bundler");
}

/**
 * @type {import('webpack').Configuration | import('@rspack/cli').Configuration}
 */
const config = {
  mode: "development",
  devtool: false,
  entry: {
    main: {
      import: "./src/index",
      runtime: "build-runtime",
    },
    main2: {
      import: "./src/index2",
      runtime: "build-runtime",
    }
  },
  plugins: [
    ...(isRunningWebpack ? [
      new HtmlWebpackPlugin(),
    ] : [])
  ],
  ...(isRunningRspack ? {
    builtins: {
      html: [{}],
    },
  } : {}),
  output: {
    clean: true,
    path: isRunningWebpack
      ? path.resolve(__dirname, "webpack-dist")
      : path.resolve(__dirname, "rspack-dist"),
    filename: "[name].js",
  },
  optimization: {
    runtimeChunk: true,
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: 'all',
          test: /render\.css/,
          enforce: true,
          name: 'vendor'
        },
      }
    }
  },
  experiments: {
    css: true,
  }
};

export default config;
