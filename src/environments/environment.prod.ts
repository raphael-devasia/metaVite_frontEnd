// export const environment = {
//   production: true,
//   SOCKET_ENDPOINT: 'https://metavite.ddns.net/socketiochat/',
//   SOCKET_ENDPOINT2: 'https://metavite.ddns.net/socketio/',
// };
export const environment = {
  production: true,
  // Use the appropriate WebSocket URLs for each service
  SOCKET_ENDPOINT: 'wss://metavite.ddns.net/socketiochat/', // For socketiochat service
  SOCKET_ENDPOINT2: 'wss://metavite.ddns.net/socketio/', // For socketio service
};
