///<reference path="../../../server/server.interface.d.ts" />
import * as mongoose from 'mongoose';
import Mailer from '../../../server/mail/mailer';
import CMSModel from '../../../server/model/cmsModel'
import DBConnect from '../../db_connect';
import Filters from '../../../server/utils/filters';


let account = [
  {
  fname: 'Jack',
  lname: 'Harrison',
  mname: '',
  email: 'jack@daisyranch.org',
  login: 'mawellCoffee',
  password: 'd@nc1ng0n7h3m00n',
  },
  {
  fname: 'Sam',
  lname: 'Spade',
  mname: '',
  email: 'sam@daisyranch.org',
  // login: 'spaderonMoon',
  password: 'up3r45#0djen',
  },
  {
  fname: 'Sally',
  lname: 'May',
  mname: 'Francis',
  email: 'sally@daisyranch.org',
  login: 'sallyMay',
  password: 'cn0%@djJ$20',
  },
  {
  fname: 'George',
  lname: 'Washingtom',
  mname: 'Willingtom',
  email: 'george@daisyranch.org',
  login: 'withoutABoat',
  password: 'Bv0274S#kdr(-)',
  },
]

let resetTest = (lid:string, key: string, account, done) => {

      CMSModel.setResetKeyByLogin(lid,(response:any)=>{
        let person:any, login:any, resetKey:string;
        if(response && response.resetKey){
          person   = response.person;
          login    = response.login;
          resetKey = response.resetKey;
          console.log(`The email can now be sent with key: ${response.resetKey}`);
        }
        // console.log(response);

        expect(resetKey).toBeTruthy();
        expect(person.fname).toEqual(account.fname);
        expect(person.lname).toEqual(account.lname);


        CMSModel.repo('Person').findOne({resetKey: resetKey},(err:any,person:any)=>{
          // console.log(person);
          console.log(`Person retrieved by new resetKey account
            created with:      ${account[key]}
            account retrieved: ${response.login.login} `);

          expect(login[key]).toEqual(account[key]);
          expect(resetKey).toEqual(person.resetKey);
          done();
        });
      });
}

beforeAll( (done) => {

    DBConnect.dropDB();

    DBConnect.sessionStart()
    account.forEach((account:any)=>{
      CMSModel.createAccount(account, ()=>{
        done();
      }, ()=>{});
    })
});


describe('test account reset', ()=>{
  it('set account resetKeys using login key', (done)=>{
    // expect.assertions(1);
    DBConnect.sessionStart();
    for(let i in account){
      let lid = account[i].login;
      resetTest(lid, 'login', account[i], done);
    }
  });

  it('set account resetKeys using email key', (done)=>{
    // expect.assertions(1);
    DBConnect.sessionStart();
    for(let i in account){
      let lid = account[i].email;
      resetTest(lid, 'email', account[i], done);
    }
  });

});



/*
describe('', ()=>{
  it('', ()=>{
  });
});
*/
