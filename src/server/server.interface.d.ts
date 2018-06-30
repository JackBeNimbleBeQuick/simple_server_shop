interface sessionConnect{
  store: Function,
  maxAge: Date,
  secret: string,
  saveUninitialized?: boolean,
  resave?: boolean,
  cookie?: Object
}

interface shopApp{
  get():Function,
  init():Function,
  getHttpServer():Function,
  getHttpsServer():Function,
}
