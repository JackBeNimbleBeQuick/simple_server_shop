///<reference path="../../../server/server.interface.d.ts" />
import Mailer from '../../../server/mail/mailer';
import CMSModel from '../../../server/model/cmsModel'
import DBConnect from '../../db_connect';
import Filters from '../../../server/utils/filters';
import cnf from '../../../server/config/connect.cnf';
import Responder from '../../../server/controllers/boilerplate/responder';
import * as pug from 'pug';
import * as path from 'path';


let account = [
  {
  fname: 'Jack',
  lname: 'Harrison',
  mname: '',
  email: 'jack@daisyranch.org',
  login: 'mawellCoffee',
  sigmond: '8',
  password: 'd@nc1ng0n7h3m00n',
  confirm_password: 'd@nc1ng0n7h3m00n',
  _csrf: 'zoZc1g3A-ycFQAFYI0NwE7OtmpVCvRzoIEnk',
  captcha: '8' },
  {
  fname: 'Sam',
  lname: 'Spade',
  mname: '',
  email: 'sam@daisyranch.org',
  // login: 'spaderonMoon',
  sigmond: '8',
  password: 'up3r45#0djen',
  confirm_password: '#)($#jdak;e431)',
  _csrf: 'zoZc1g3A-ycFQAFYI0NwE7OtmpVCvRzoIEnk',
  captcha: '8' },
  {
  fname: 'Sally',
  lname: 'May',
  mname: 'Francis',
  email: 'sam@daisyranch.org',
  login: 'sallyMay',
  sigmond: '8',
  password: 'cn0%@djJ$20',
  confirm_password: 'd@#ff003432LLll@#$',
  _csrf: 'zoZc1g3A-ycFQAFYI0NwE7OtmpVCvRzoIEnk',
  captcha: '8' },
  {
  fname: 'George',
  lname: 'Washingtom',
  mname: 'Willingtom',
  email: 'sam@daisyranch.org',
  login: 'withoutABoat',
  sigmond: '8',
  password: 'Bv0274S#kdr(-)',
  confirm_password: '$_dR23"334skre',
  _csrf: 'zoZc1g3A-ycFQAFYI0NwE7OtmpVCvRzoIEnk',
  captcha: '8' },
]

beforeAll( (done) => {

    DBConnect.dropDB();

    DBConnect.sessionStart()
    account.forEach((account:any)=>{
      CMSModel.createAccount(account, ()=>{
        done();
      }, ()=>{});
    })
});

describe('Test emailer service for account actions', ()=>{

  it('Proof out mail template generation', ()=>{
    Mailer.setOptions({toSend:false});

    for(let i in account){

      let env:mailerProtocol = {
        fname: account[i].fname,
        lname: account[i].lname,
        mname: account[i].mname,
        email: account[i].email,
      };

      let pkg = Mailer.mailer(env, 'create_enrol');
      // console.log(pkg);
      let ready = Mailer.mail(pkg);
      console.log(ready);

      pkg = Mailer.mailer(env, 'confirm_enrol');
      // console.log(pkg);
      ready = Mailer.mail(pkg);
      // console.log(ready);

      pkg = Mailer.mailer(env, 'start_reset');
      // console.log(pkg);
      ready = Mailer.mail(pkg);
      // console.log(ready);

      pkg = Mailer.mailer(env, 'confirm_reset');
      // console.log(pkg);
      ready = Mailer.mail(pkg);
      // console.log(ready);

    }
  });

  it('Account create process test', ()=>{

    Mailer.setOptions({toSend:false});

    let cnf_path = path.join(__dirname,
      '../../../server/controllers/boilerplate',
      cnf.locale.lang, cnf.locale.region
    );

    let message = Responder.render('create_enrol');
    console.log(message);

    for(let i in account){
      let data = account[i];
      //send mail
      let pkg = Mailer.mailer({
        fname: data.fname,
        lname: data.lname,
        mname: data.mname,
        email: data.email,
      }, 'create_enrol');
      let ready = Mailer.mail(pkg);
      console.log(ready);
    }

  });

  it('Test email sending', ()=>{

    Mailer.setOptions({toSend:false});

    let env:mailerProtocol = {
      fname: account[0].fname,
      lname: account[0].lname,
      mname: account[0].mname,
      email: account[0].email,
    };

    let pkg = Mailer.mailer(env, 'confirm_enrol');
    console.log(pkg);
    let ready = Mailer.mail(pkg);
    console.log(ready);
  });

  it('Mailer: start reset with email to reset link', (done)=>{

    Mailer.setOptions({toSend:false});

    for(let i in account){
      let data = account[i];

      CMSModel.setResetKeyByLogin(data.login, (reset) => {

        console.log(`PersonByLogin using: ${data.login}`)
        // console.log(reset);
        let person = reset.person;
        let login  = reset.login;
        let key    = reset.resetKey;

        let mailer = {
          type: 'start_reset',
          fname: person.fname,
          lname: person.lname,
          mname: person.mname,
          email: login.email,
          key:   key
        }

        console.log(mailer);

        let pkg = Mailer.mailer(mailer, 'start_reset');
        let mailed = Mailer.mail(pkg);
        console.log(mailed);

        expect(person.fname).toEqual(data.fname);
        expect(person.lname).toEqual(data.lname);
        expect(login.login).toEqual(data.login);


        CMSModel.getPersonByKey(key, (person) => {
          console.log(`Retrieve Person using resetKey ${key}`);
          console.log(person)
          done();
        });

        });

    }
  });

});

/*
describe('', ()=>{
  it('', ()=>{
  });
});
*/
