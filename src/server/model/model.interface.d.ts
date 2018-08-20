import * as mongoose from 'mongoose';

interface schemata{
  [Identifier:string]:entityField
}

interface entityField{
  [Identifier:string]: entitySpec
}

interface entitySpec{
  type: string,
  required: boolean | string,
  meta?: entityMeta
}

interface entityMeta{
    form?: entityForm
}

interface entityForm{
    validators: Array<string>,
    filters: Array<string>,
    name?: string,
    type: string,
    label: string,
    attributes?: Object
}

interface entitySpec{
  type: string,
  required: boolean | string,
  meta?: entityMeta
}

interface entityMeta{
    form?: entityForm
}

interface entityForm{
    validators: Array<string>,
    filters: Array<string>,
    name?: string,
    type: string,
    label: string,
    attributes?: Object
}
