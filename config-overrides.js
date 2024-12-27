const webpack = require('webpack');
const path = require('path');

module.exports = function override(config, env) {
  // Disable source-map-loader for @grpc/proto-loader
  config.module.rules = config.module.rules.map(rule => {
    if (rule.enforce === 'pre' && rule.loader && rule.loader.includes('source-map-loader')) {
      return {
        ...rule,
        exclude: /node_modules\/@grpc\/proto-loader/
      };
    }
    return rule;
  });

  config.resolve.fallback = {
    ...config.resolve.fallback,
    assert: require.resolve('assert/'),
    buffer: require.resolve('buffer/'),
    crypto: require.resolve('crypto-browserify'),
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    os: require.resolve('os-browserify/browser'),
    path: require.resolve('path-browserify'),
    process: require.resolve('process/browser'),
    stream: require.resolve('stream-browserify'),
    url: require.resolve('url/'),
    util: require.resolve('util/'),
    zlib: require.resolve('browserify-zlib'),
    http2: path.resolve(__dirname, './src/mocks/http2.js'),
    // Set these Node.js native modules to false
    fs: false,
    net: false,
    tls: false,
    dns: false,
    'child_process': false
  };

  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    })
  ];

  return config;
}; 