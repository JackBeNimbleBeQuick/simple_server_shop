declare module MemoryStore{

}
interface sessionConnect{
  store: Function,
  maxAge: Date,
  secret: string,
  saveUninitialized?: boolean,
  resave?: boolean,
  cookie?: Object
}

interface shopApp{
  //may need type of express.Application
  get(): any,
  init():Function,
  //may nee type of https.Server
  getHttpsServer(): any,
}

interface message{
  type: string,
  message: any,
}

interface ioConnect{
  (value:string, app:any):ioResult
}

interface ioResult{
  socket: Function,
  data: any,
}

interface ConnectionOptions{
  useNewUrlParser?: boolean
}

interface ioOptions{
  //path (String): name of the path to capture (/socket.io)
  path?: string,
  // serveClient (Boolean): whether to serve the client files (true)
  serveClient?: boolean,
  // adapter (Adapter): the adapter to use. Defaults to an instance of the Adapter that ships with socket.io which is memory based. See socket.io-adapter
  adapter?: Function,
  // origins (String): the allowed origins (*) | ['domian1.net:2112','domin2.net:3212']
  origin?: string | validOrigin,
  // parser (Parser): the parser to use. Defaults to an instance of the Parser that ships with socket.io. See socket.io-parser.
  parser?: Function,
  cookie?: boolean,
  pingInterval?: number,
  pingTimeout?: number,
}

interface validOrigin{
  (origin:string): [string, boolean]
}
