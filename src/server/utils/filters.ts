


export class Filters{



  public randomRange = (min:number, max:number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  public generateKey = (len = 9, pw = false) => {
		let vowels    = 'aAeEiouUyY';
		let constants = 'bBdDgGhHjJmMnNpPqQrRsStTvVzZ';
		let keys = pw === false ? '123456789' : '23456789@#$!%^&';

		let word = '';
    let dex = 0;

		let alt = this.randomRange(0,2);

		for (let i = 0; i < len; i++) {

			switch(alt){
				case 0:
          dex = this.randomRange(0,constants.length-1);
					word += constants[dex];
					break;
				case 1:
          dex = this.randomRange(0,vowels.length-1);
					word += vowels[dex];
					break;
				case 2:
          dex = this.randomRange(0,keys.length-1);
					word += keys[dex];
					break;
			}
			alt = this.randomRange(0,2);
		}
		return word;
	}


}

export default new Filters();
