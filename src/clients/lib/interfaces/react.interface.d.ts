//missing types for tsc
interface shoppingProps{
 categories: Array<string>,
 groups: Array<products>,
 id: string,
 name: string,
 totalPages:number
}

interface fieldValue{
  name:string,
  value:string,
}

interface shoppingState{
  type: HTMLElement,
  any: any
}

interface ReactElement{
  any:any,
}

interface scrollTops{
  el?:HTMLElement,
  top?:number,
}

interface DisplayBox{
  state?:shoppingProps,
  shoppingProps?:shoppingProps,
}

interface Shopping{
  props:any,
  state:any,
}

interface SidePanel{
  state:any,
}

interface ShopperFrame{
  state:any,
}

interface actions{
  sessionTracking(data:any):any,
  getData(data:any):any,
  setViewed(data:any):any,
  addToCart(data:any):any,
  resetTracking(data:any):any,
}
