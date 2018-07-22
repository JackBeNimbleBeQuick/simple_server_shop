
export class Register{
  constructor(){

  }

  /**
   * Registers the service work if not done yet
   * initiate the comLayer instantiation
   * @param  'serviceWorker'innavigator [description]
   * @return                            [description]
   */
  public check = (ioSocket: any, path: string) => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register(path)
          .then( (registration) => {
            // console.log('ServiceWorker registration successful with scope: %s', registration.scope);
            ioSocket(registration);
          }, (err) => {
            //@TODO add logging to server on next connect
            // console.log('ServiceWorker registration failed: ', err);
        });
      });
    }
  }

  public  credentialCheck = (token:string, providers: Array<string>) => {
    if ('credentials' in navigator) {
      (navigator.credentials as any).get({
        password: true,
        federated: {
          providers: providers
        },
        unmediated: true,
      }).then((cred:any) =>{
        if (cred) {
          let form = new FormData();
          form.append('email', cred.id);
          form.append('password', cred.password);
          form.append('csrf_token', token);
          return fetch('/signin', {
            method: 'POST',
            credentials: 'include',
            body: form
          });
        } else {
          // Fallback to sign-in form
        }
      }).then( (res:any) => {
        if (res.status === 200) {
          return res.json();
        } else {
          throw 'Auth failed';
        }
      }).then( (profile:any)=> {
        console.log('Auth succeeded', profile);
      });
    }

  }
}
export default new Register();
