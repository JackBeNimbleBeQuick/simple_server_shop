
///<reference path="../server.interface.d.ts" />
import * as SMTPconnect from 'nodemailer/lib/smtp-connection';
import * as MailComposer from 'nodemailer/lib/mail-composer';
import {readFileSync, readdir, writeFile, createWriteStream} from 'fs';
import en_bp from './boilerplate/en/us';
import cnf from '../config/connect.cnf'
import * as path from 'path';
import {Buffer} from 'buffer';
import * as HtmlParse from 'html-to-text';


// person: mailerProtocol,
interface mailer{
  to: string,
  from: string,
  name: string,
  subject: string,
  body: string,
  key?: string,
  envelope: {
    to: string,
    from: string,
  }
}

interface envelope{
  to: string,
  from: string,
  subject: string,
  html?: string,
  text: string,
  size?: number,
  use8BitMime?: boolean,
  envelope: {
    to: string,
    from: string,
  }
}

interface options{
  send: boolean,
}

export class Mailer{

  private bp:any = {};
  private connected:boolean = false;
  private connection:any;
  private isBatch:boolean = false;
  private toSend: boolean = true;

  private settable:RegExp = /\b(toSend)\b/

  constructor(options?:Object){

    if(options){
      for(let i in options){
        if(this.settable.test(i)) this[i] = options[i];
      }
    }

    let dir = path.join(__dirname, 'boilerplate', cnf.locale.lang, cnf.locale.region);
    this.bp = require(dir)['default'];
  }

  public setOptions = (options:Object) => {
    if(options){
      for(let i in options){
        if(this.settable.test(i)) this[i] = options[i];
      }
    }
  }

  /**
   * provide mailer wrapper function
   * @param {registration} person
   * @return {mailer}
   */
  public mailer = (person:mailerProtocol,tmp: string):mailer => {

    let tmpl = this.bp[tmp];
    let to   = `${person.fname} ${person.lname} <${person.email}>`
    let from = `${cnf.mail.returns.mailer_name} <${cnf.mail.returns.mailer}>`
    let name = `${person.fname} ${person.lname}`;

    return {
      from: cnf.mail.returns.mailer,
      to: person.email,
      subject: tmpl.subject,
      body: tmpl.body,
      name: name,
      key: person.key ? person.key : '',
      envelope: {
        from: from,
        to: to,
      }
    }
  }

  /**
   * Batch mailer
   * @param {Array<mailer>} batch
   * @return {void}
   */
  public batch = (batch:Array<mailer>):void => {
    let counter = batch.length;
    batch.forEach((mailer) => {
      counter--;
      if(counter == 0) this.mail(mailer);
      else this.mail(mailer, ()=>{this.hangup()})
    });
  }

  /**
   * mail
   * @param {mailer}  env
   * @return {void}
   */
  public mail =  (env:mailer, cb?:Function):envelope => {
    let tmpl = this.prep(env);
    // let to = `${env.person.fname} ${env.person.lname}<${env.person.email}>`
    let buffer = new Buffer(tmpl.subject + tmpl.body, 'utf-8');

    let boxed:envelope = {
      to: env.to,
      from: env.from,
      subject: tmpl.subject,
      text: this.extractText(tmpl.body),
      html: tmpl.body,
      envelope: env.envelope
      // size: buffer.byteLength
    };

    if(this.toSend){
      this.send(boxed, cb);
    }
    return boxed;
  }

  /**
   * Provides lazy load pattern for sending emails
   * .when there are multiples the connection can be re-used
   * @param  this.connection&&this.connected
   * @return
   */
  private send = (envelope:any, cb?:Function):void => {
    if(this.connection && this.connected){
      this.connection.send(envelope, () => {
        console.log(`Message (Reusing connection) to: ${envelope.to} for: ${envelope.subject}`);
        if(cb) cb(envelope);
        if(this.isBatch === false) this.hangup();
      });
    }else{
      this.connect(() => {

        let message = new MailComposer(envelope)
          .compile()
          .createReadStream();

        this.connection.send({
          from: envelope.from,
          to: envelope.to}, message, (err:any, info:any) => {
            console.log(`Message (Delayed and sent) to: ${envelope.to} for: ${envelope.subject}`);
            if(this.isBatch === false) this.hangup();
            if(cb) cb(envelope);
            console.log(err);
            console.log(info);
        });
      })
    }
  }

  /**
   * connect to the email service
   * @param {Function} options callback for after connection is made
   * @return {void}
   * normalizes connecting to the mailer server where a connection may
   * already may existing but in closed state
   * . return existing and connected
   * . set listeners to determine the connected state
   * . perform login and do post login tasks
   */
  private connect = (delivery?:Function):any => {
    if( this.connected && this.connected ) return this.connection;
    if(this.connection && ! this.connected){
      this.connection.reset((err:any) => {
        console.log(`RESET callback returns not yet known ${err}`);
        if(delivery) delivery();
        return this.connection;
      });
    }else{
      this.connection = new SMTPconnect(cnf.mail.options);

      this.connection.connect((e)=>{
        console.log('Connection made')

        this.connection.login(cnf.mail.auth, (err:any) => {
          if(!err){
            console.log('Delivery made after login')
            if(delivery) delivery();
            return this.connection;
          }
          console.log(err);
        });
      });

      this.connection.on('connect',(e) => {
        console.log('Connect fired');
        this.connected = true;
      });
      this.connection.on('error',(e) => {
        console.log('Error fired');
        this.connected = false;
      });
      this.connection.on('end',(e) => {
        console.log('End fired');
        this.connected = false;
      });

    }
  }

  /**
   * close out the server connection
   * @param  this.connection
   * @return {void}
   */
  private hangup = ():void => {
    if(this.connection){
      this.connection.quit();
    }
  }

  /**
   * replace out template information with selected person / context
   * @param  '__NAME_' string pattern for name replacements
   * @param  {mailer}
   * @return {mailer}
   */
  public prep = (env:mailer):mailer => {
    let url = cnf.mode === 'dev'
      ? `${cnf.devUrl}:${cnf.sslPort}/`
      : `${cnf.prodUrl}`;

    let replacers = {
      __HOST_PATH__: url,
      __NAME__: env.name,
      __KEY__: env.key ? env.key : '',
    }

    for(let r in replacers){
      let replacement = replacers[r];
      let needle = new RegExp(r,'g');
      // console.log(needle);
      // console.log(replacement);

      env.subject = env.subject.replace(needle, replacement);
      env.body    = env.body.replace(needle, replacement);
    }

    return env;
  }

  private extractText = (text:string):any => {

    return HtmlParse.fromString(text, {
      wordwrap: 130
    });

  }

}

export default new Mailer();
