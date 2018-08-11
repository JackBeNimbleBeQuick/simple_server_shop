// import {EventEmitter} from 'events';
//
// interface Actions{
//   emitter: EventEmitter
// }
//missing types for tsc
interface productPoint{
  name: string,
  product_id: string,
  count: number
}

interface trayEvent{
  trayid: string,
  state: string  // open | close | no-data
}

interface trays{
  [Identifier:string]: string 
}

interface trayStates{
  length: number,
  lastin: string,
  trays: trays
}

interface cartItem{
  quantity: number,
  id: product,
}

interface groups{
  id:string,
  name: string
  groups: Array<products>,
}

interface products{
  [Identifier:number]: product
}

interface product{
  id: string,
  name: string,
  links: links,
  messages: message,
  priceRange: priceRange,
  reviews: reviews,
  swatches: swatches,
  hero: image,
  thumbnail: image,
  images: Array<image>,
}

/* links*/
interface links{
  [Indetifier:string]:link
}

interface link{
  www: string,
  socket?: string,
}

/* image interface */
interface imageRoles{
  hero:image, //large
  tumbnaile: image, //small
  images: Array<image>, //small
}

interface image{
  size:string,
  meta:string,
  alt:string,
  rel: string, //hero | thumbnail | althero
  width:number,
  href:'string'
  height:number
}

/* messages*/
interface messages{
  [Identifier:number]:message
}

interface message{
  [Identifier:number]: string
}

/* swatched */

interface swatches{
  [Identifier:number]:Array<swatch>
}

interface swatch{

}

/* flags */
interface flags{
  [Identifier:number]: flag
}

interface flag{
  bopisSuppress:boolean,
  rank:number,
  id:string
}

/* prices interface*/
interface priceRange{
  selling: prices,
}

interface prices{
  hight:number,
  low:number,
}


/* reviews interface*/
interface reviews{
  recommendationCount:number,
  likelihood:number,
  reviewCount:number,
  averageRating:number,
  id:string,            //organic-mini-check-sheet-set-b2465,
  type:string//GROUP_REVIEWS
}

interface flux_store{
  id:string,
  store_key?:string,
  value_key?:string,
  callback:Function
}

interface FluxMethods{
  catchStoreChanges(val:flux_store): Function
  productKey: string
  getState(val:string): Object
}

interface listerns{
  [Identifier:string]:Function
}
