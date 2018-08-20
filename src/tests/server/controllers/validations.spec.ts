///<reference path="../../../server/server.interface.d.ts" />
import * as mongoose from 'mongoose';
import Mailer from '../../../server/mail/mailer';
import CMSModel from '../../../server/model/cmsModel'
import DBConnect from '../../db_connect';
import Filters from '../../../server/utils/filters';
import Validation from '../../../server/utils/validation';


let outputs = {
  password: 'PW Strength password not strong enough',
  login: 'Duplicate login',
  sigmond: 'Captcha does not match',
  confirm_password: 'Password Match: does not match',
  email: 'Duplicate email',
}

let registrants = [
  {
  expect: {
    isValid: true,
    failed: {}
  },
  fname: '',
  lname: 'Sam',
  mname: '',
  email: 'yosemite@daisyranch.org',
  login: 'getThemVarmits',
  sigmond: '8',
  password: 'd@nc1ng0n7h3m00n',
  confirm_password: 'd@nc1ng0n7h3m00n',
  captcha: '8' },

  {
  expect: {
    isValid: false,
    failed: {
      confirm_password: outputs.confirm_password,
      login: outputs.login,
    }
  },
  fname: 'Jack',
  lname: 'Harrison',
  mname: '',
  email: 'jack@daisyranch.org',
  login: 'withoutABoat',
  sigmond: '8',
  password: 'doesnotmatchenteredvalue',
  confirm_password: 'd@nc1ng0n7h3m00n',
  captcha: '8' },

  {
  expect: {
    isValid: false,
    failed: {
      email: outputs.email,
      password: outputs.password,
    }
  },
  fname: 'Martha',
  lname: 'Stewart',
  mname: '',
  email: 'sam@daisyranch.org',
  // email: 'stirmaster@daisyranch.org',
  login: 'stirCrazy',
  sigmond: '8',
  password: 'weak',
  confirm_password: 'weak',
  captcha: '8' },

{
  expect: {
    isValid: false,
    failed: {
      email: outputs.email,
      password: outputs.password,
      sigmond: outputs.sigmond,
    }
  },
  fname: 'Sarah',
  lname: 'McClockin',
  mname: '',
  email: 'sam@daisyranch.org',
  // email: 'stirmaster@daisyranch.org',
  login: 'sarahMac',
  sigmond: '8',
  password: 'weak',
  confirm_password: 'weak',
  captcha: '22' },

]

let account = [
  {
  fname: 'Sam',
  lname: 'Spade',
  mname: '',
  email: 'sam@daisyranch.org',
  login: 'spaderOnMoon',
  sigmond: '8',
  password: 'up3r45#0djen',
  confirm_password: '#)($#jdak;e431)',
  captcha: '8' },

  {
  fname: 'Sally',
  lname: 'May',
  mname: 'Francis',
  email: 'sundance@daisyranch.org',
  login: 'sallyMay',
  sigmond: '8',
  password: 'd@#ff003432LLll@#$',
  confirm_password: 'd@#ff003432LLll@#$',
  captcha: '8' },

  {
  fname: 'George',
  lname: 'Washingtom',
  mname: 'Willingtom',
  email: 'george@daisyranch.org',
  login: 'withoutABoat',
  sigmond: '8',
  password: 'Bv0274S#kdr(-)',
  confirm_password: 'Bv0274S#kdr(-)',
  captcha: '8' },

]

let filters = {};

let validators = {};

validators['login'] = ['unique.Login.login','optional'];
validators['email'] = ['unique.Login.email','email'];
validators['sigmond']  = ['match.captcha'];
validators['password'] = ['password','required'];
validators['confirm_password'] = ['match.password','required'];

filters['email'] = [];
filters['login'] = [];
filters['password'] = [];
filters['confirm_password'] = [];

beforeAll( (done) => {
  /**/

  DBConnect.dropDB();

  DBConnect.sessionStart();
  account.forEach((account:any)=>{
    CMSModel.createAccount(account, ()=>{
      done();
    }, ()=>{});
  });

});

describe('validators: test batch processing', ()=>{

  it('validation with batch method', (done)=>{

    let validate = new Validation(DBConnect, CMSModel);

    for(let r in registrants){
      let reg = registrants[r];
      let _expect = reg.expect;
      let _tag = `${reg.fname}: login: ${reg.login} email: ${reg.email}`


      validate.batch(validators, reg, (result) => {
        console.log(_tag);
        console.log(`Expected isValid: ${result.isValid}`);
        expect(result.isValid === _expect.isValid).toBeTruthy();
        // console.log(result);
        for(let f in result.failed){
          let issue = _expect.failed[f];
          console.log(`Expected issue: ${issue}`);
          expect(issue).toBeTruthy();
          expect(issue).toEqual(outputs[f]);
        }
      });

      done();

    }
  });

});





/*
describe('', ()=>{
  it('', ()=>{
  });
});
*/
