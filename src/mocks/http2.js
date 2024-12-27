const constants = {
  HTTP2_HEADER_PATH: ':path',
  HTTP2_HEADER_STATUS: ':status',
  HTTP2_HEADER_METHOD: ':method',
  HTTP2_HEADER_AUTHORITY: ':authority',
  HTTP2_HEADER_SCHEME: ':scheme',
  HTTP2_HEADER_ACCEPT_ENCODING: 'accept-encoding',
  HTTP2_HEADER_CONTENT_TYPE: 'content-type',
  HTTP2_HEADER_USER_AGENT: 'user-agent',
  HTTP2_HEADER_CONTENT_LENGTH: 'content-length',
  HTTP2_HEADER_TE: 'te',
  HTTP2_HEADER_HOST: 'host',
  HTTP_STATUS_OK: 200,
  HTTP_STATUS_INTERNAL_SERVER_ERROR: 500
};

module.exports = {
  constants,
  connect: () => {},
  createServer: () => {},
  createSecureServer: () => {},
  getDefaultSettings: () => ({}),
  getPackedSettings: () => ({}),
  getUnpackedSettings: () => ({}),
  sensitiveHeaders: new Set(),
  DEFAULT_SETTINGS: {},
  NGHTTP2_SESSION_CLIENT: 1,
  NGHTTP2_SESSION_SERVER: 2
}; 