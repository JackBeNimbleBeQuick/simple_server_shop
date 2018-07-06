
export class Register{
  constructor(){

  }

  /**
   * Registers the service work if not done yet
   * initiate the comLayer instantiation
   * @param  'serviceWorker'innavigator [description]
   * @return                            [description]
   */
  public check = (ioSocket: any) => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        // could maybe use a try .catch wrapper to prevent ugly first connect errors
        // where catch just then falls back to standard page loade from the site
        // navigator.serviceWorker.register('public/js/service-worker.js')
        navigator.serviceWorker.register('public/js/sw.js')
          .then( (registration) => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
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
