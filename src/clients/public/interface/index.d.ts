
interface shellOptions{
  selector: string,
  selected: HTMLElement,
  any: any
}

interface observer{
  update(subject:subject, state:any):void
  getName(): string
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

interface tags{
  [Tag:string]: string
}

interface validators{
  [Identifier:string]: Array<string>
}

/* __ Validators ___ */
interface validator{
  isValid(value:any):Boolean
}
