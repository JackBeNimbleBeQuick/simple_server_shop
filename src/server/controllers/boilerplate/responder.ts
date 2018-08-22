
///<reference path="../../server.interface.d.ts" />
import cnf from '../../config/connect.cnf';
import * as path from 'path';
import * as pug from 'pug';
import * as sanitizeHtml from 'sanitize-html';

export class Responder{

  private template_path:string;
  private response:string;

  constructor(){
    this.template_path = path.join(__dirname, '../../templates');
    this.response = require(path.join(__dirname, './', cnf.locale.lang, cnf.locale.region))['default'];
  }

  public render = (key:string) => {
    let template = this.template_path+'/forms/response.pug';
    let responder = this.response[key];
    return pug.renderFile(template,{Spec: responder});
  }

  public clean = (text:string) => {
    return sanitizeHtml(text,{
      allowedTags: ['p','blockquote','div','span'],
      allowedAttributes: {'a': ['href'], 'img': ['src', 'class']}
    });
  }

}
export default new Responder();
