
export class Register{
  constructor(){

  }

  /**
   * Registers the service work if not done yet
   * initiate the comLayer instantiation
   * @param  'serviceWorker'innavigator [description]
   * @return                            [description]
   */
  public check = (comLayer: any) => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        // could maybe use a try .catch wrapper to prevent ugly first connect errors
        // where catch just then falls back to standard page loade from the site
        navigator.serviceWorker.register('public/js/service-worker.js')
          .then( (registration) => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
          comLayer(registration);
        }, (err) => {
          //@TODO add logging to server on next connect
          console.log('ServiceWorker registration failed: ', err);
        });
      });
    }
  }
}
export default new Register();
