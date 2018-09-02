
interface observer{
  update(state:any):void
}

interface subject{
  getState(): any,
  setState(state:any): void,
}

interface observers{
  [Identifier:string]: observer
}

interface subjects{
  [Identifier:string]: subject
}
