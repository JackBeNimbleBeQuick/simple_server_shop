
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
            console.log('ServiceWorker registration successful with scope: %s', registration.scope);
            ioSocket(registration);
          }, (err) => {
            //@TODO add logging to server on next connect
            console.log('ServiceWorker registration failed: ', err);
        });
      });
    }
  }
}
export default new Register();
