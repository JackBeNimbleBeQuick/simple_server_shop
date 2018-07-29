/// <reference path="../../lib/interfaces/com.interface.d.ts"/>
import Actions from 'clients/shop/data/actions';

export class Connected{

	//Keep for reference even though query stats are now stripped out
	private MEDIA_TYPES:string[] = ["application/json", "application/x-www-form-urlencoded", "text/plain", "text/html"];

  private xhr: XMLHttpRequest;

	//Keep for reference even though query stats are now stripped out
  private states:comState = {
    0: {key: 'UNSENT', explained: 'Client has been created. open() not called yet.'},
    1: {key: 'OPENED', explained: 'open() has been called.'},
    2: {key: 'HEADERS_RECEIVED', explained: 'send() has been called, and headers and status are available.'},
    3: {key: 'LOADING', explained: 'Downloading the responseText. Partial data received'},
    4: {key: 'DONE', explained: 'Well explains its self don\'t it '},
  }


  public constructor(){
		this.xhr = this.requester();
  }

	private requester(){
		 try { return new XMLHttpRequest();											} catch(e){}
		 try { return new ActiveXObject('Msxml2.XMLHTTP.6.0');	} catch(e){}
		 try { return new ActiveXObject('Msxml2.XMLHTTP.3.0');	} catch(e){}
		 try { return new ActiveXObject('Msxml2.XMLHTTP');			} catch(e){}
		 try { return new ActiveXObject('Microsoft.XMLHTTP');		} catch(e){}
		 return null;
	}

  public send = (postage:postage, success:Function, failure:Function) => {
    
    this.xhr.timeout = postage.wait ? postage.wait : 500;

    this.xhr.open(this.getType(postage), postage.url , true);

		this.setHeaders(postage.header_type);

    //es6+ may not need this for better scoped vars
    let xhr_ = this.xhr;
    this.xhr.onreadystatechange = () => {
      if (xhr_.readyState == XMLHttpRequest.DONE) {
        if(xhr_.status == 200){
        this.processServerResponse();
          return success(xhr_.responseText);
        }else{
	        return failure(xhr_.responseText);
				}
      }
    }
    xhr_.send(postage.data);
  }

  /**
   * Stub out in the case where this may be useful for tayloring
   * communications after initial connects
   * @return Array<string> of header results or parse results
   */
  private processServerResponse = () => {
    let headers = this.xhr.getAllResponseHeaders();
    // console.log(headers);
    return [];
  }


  /**
   * Determined by the postage.header_type
   * <see postage interface for latetest use cases
   * @param {string} type
   * @return {void} sets headers on current xhr
   */
	private setHeaders= (type?:string) => {
    switch(type){
      case 'form-ac':
    		this.xhr.setRequestHeader("Access-Control-Allow-Credentials",'true');
      case 'form':
    		this.xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    		this.xhr.setRequestHeader("Accept","application/json");
      break;
      case 'json':
    		this.xhr.setRequestHeader("Content-Type","application/json");
      break;
      case 'cors':
        this.xhr.withCredentials = true;
      break;

      default:
    		this.xhr.setRequestHeader("Content-Type","application/json");
    }
  };

   /**
    * sanity check to make sure strings passed in result in correct usage
    * for REST : POST | GET | DELETE | PUT
    * @param  datum
    * @return
    */
   private getType(datum:postage){
    let matchable = datum.type.match(/\b(post|get|delete|put)\b/i);
    if(matchable &&matchable.length > 0 ) return matchable[0].toUpperCase();
    return 'POST';
  }

}
