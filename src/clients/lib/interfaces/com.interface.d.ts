// @NOTE there may be a new base
// Identifier string that would then not make this necessary

/* __AJAX Communication __*/
interface postage {
  url: string,
  type: string,
  data?: undefined |  null  | string | Document | Blob | ArrayBufferView | ArrayBuffer | FormData | URLSearchParams | ReadableStream
  header_type?: string, //cors,form,json
  wait?: number,
  debug?: Boolean
}

interface serviceClass {
  getServices():services
}

interface services{
  server_port: number,
  env: string,
  params: service
}

interface service{
  base: string,
  login: string,
  login_success: Object,
  uri: string
}

interface request{
  type:string,
  uri:string,
  action: Function,
  data?:any
}

interface loginResponse{
  status?:string
}

interface comState{
  [Identifier:number]: comStateItem
}

interface comStateItem{
  key: string,
  explained: string,
}

/*______*/

interface Session {
  data:SessionData,
  permitted(): boolean,
  loggedIn():boolean,
  pushItem(key:string, body:any):void,
}

interface SessionData{
  logged_in: boolean,
  pid:string,
  name: string,
  key: string,
  permits:Permits,
}

interface Permits{
  zones:Zones,
}

interface Zones{
  appointments:boolean
}

interface connectStatData{
  [Identifier:string]: connectStatItem
}

interface connectStatItem{
  [Identifier:string]: connectStatistics
}

interface connectStatistics{
  [Identifier:string]: number ,
}

/* __ Filters ___ */
interface filterInterface {
  filter(value:any):any
}

/* __ Validators ___ */
interface validatorInterface {
  isValid(value:any):Boolean
}

/* Storage */

interface performance{
  call: string,
  ms: number
}

interface liveData{
  exchangeUsed: string,
  call: string,
  performance: performance,
  data_type: string,
  data: string | Object
}
