export default {
  session:{
    adapter: 'connect-mongo',
    collection: 'session',
    url: 'mongodb://127.0.0.1:27017/simpleStore',
    // username: 'admints',
    // password: 'eafb0424376b45769ccc4ffeacbd8f48',
  },
  ws: {
    url: 'ws://127.0.0.1:8085/shop',
  },
  port: 8095,
  sslPort: 4040,
  wsPort: 40510,
  sessionOptions: {},
  duration: 24, //hours
  mongoUrl: 'mongodb://127.0.0.1:27017/simpleStore',
  key: 'bf6987742b9c56b947f9c02baa6930dc',
}
