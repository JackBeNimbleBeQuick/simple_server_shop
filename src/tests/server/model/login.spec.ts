import * as bcrypt from 'bcrypt';
import CMSModel from '../../../server/model/cmsModel'
import DBConnect from '../../db_connect';


let account = [
  {
  fname: 'Jason',
  lname: 'Maxwell',
  mname: 'Samual',
  email: 'jason@maxwll.house.com',
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
  email: 'sam@maxwll.house.com',
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
  email: 'sally@maxwll.house.com',
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
  email: 'george@maxwll.house.com',
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
    CMSModel.createAccount(account, ()=>{}, ()=>{});
  })

  done();
});

/**/

describe('CREATE ACCOUNTS LOGIN TESTS', ()=>{
  it('create multiple accounts test for both login | email', ()=>{
    console.log(` CREATE ACCOUNT TESTS for: RETRIEVE LOGINS`);
    let success = (login:any) => {
      console.log(login ? `RESULTS found email: ${login.email} login: ${login.login}` : `NO RESULTS WILL CALL NEXT`)
    }

    let fail = (login:any) => {
      console.log('ERROR from call');
    }

    CMSModel.login( null, (login) => {
      console.log(`null TEST to make sure null is returned`);
      console.log(`Expect null login: ${login}`);
      expect(login).toBeNull();
    }, fail);

    CMSModel.login( undefined, (login) => {
      console.log(`undefined TEST to make sure null is returned`);
      console.log(`Expect null login: ${login}`);
      expect(login).toBeNull();
    }, fail);

    for(let i in account){
      let email = account[i].email;
      CMSModel.login( account[i].email, (login) => {
        console.log(`EMAIL USED ${email}`)
        console.log(`found login: ${login}`);
        expect(login.email).toEqual(email);
      }, fail);
    }

    for(let i in account){
      let _login = account[i].login;
      CMSModel.login( _login, (login) => {
        console.log(`LOGIN USED: ${_login}`);
        console.log(`found login: ${login}`);
        if(_login && _login !==''){
          expect(login.login).toEqual(_login);
        }else{
          expect(login).toBeNull();
        }
      }, fail);

    }

  });

  describe('Login tests TRUE ', ()=>{

    it('Get login for for login field and use password', ()=>{
      DBConnect.sessionStart()
      console.log(`LOGIN TESTS for: login values`);
      for(let i in account){
        let acct:any = account[i],
          _login:any = acct.login,
          _pw:any = acct.password;

        if(_login){
          CMSModel.checkLogin({login: _login, pw: _pw}, (msg) => {
            console.log(`TESTING PASSWORD sb: TRUE for: ${_login} with: ${_pw}`);
            console.log(msg);
            expect(msg.isValid).toBeTruthy();
          });
        }
      }
    });
  });

  describe('Login tests FALSE', ()=>{

    it('Get login for for login field and use password', ()=>{
      DBConnect.sessionStart()
      console.log(`LOGIN TESTS for: login values`);
      for(let i in account){
        let acct:any = account[i],
          _login:any = acct.login,
          _pw:any = acct.password;

        if(_login){
          CMSModel.checkLogin({login: _login, pw: _pw+Date.now()}, (msg) => {
            console.log(`TESTING PASSWORD sb: TRUE for: ${_login} with: ${_pw}`);
            console.log(msg);
            expect(msg.isValid).toBeFalsy();
          });
        }
      }
    });
  });


});



/*
describe('', ()=>{
  it('', ()=>{
  });
});
*/
