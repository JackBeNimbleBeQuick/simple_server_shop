///<reference path="../../lib/interfaces/dom.interface.d.ts" />

/**
 * Provides central set of methods for dom based activities
 * so as to keep things DRY and reusable over time
 * @param  DomUtils.isBrowser
 * @return
 */
export class DomUtils{

  //@NOTE good idea but does not work in unit test... yet 8^)
  public static isBrowser = window && typeof window.document === 'object';


  public static lockScroll = ():void => {
    if(document && document.querySelector && DomUtils.isBrowser){
      let query = document.querySelector('body');
      if(query) query.style.overflow = 'hidden';
    }
  }


  public static unLockScroll = (st?:scrollTops):void => {
    if(document && document.querySelector && DomUtils.isBrowser){
      let query = document.querySelector('body');
      if(query) query.style.overflow = 'inherit';
    }
  }

  /**
   * Provides resizing for elements in a responsive view
   * @param  factor*value*precision
   * @return {React.CSSProperties}
   * @NOTE there must be a more elegant way to do this
   */
  public static rebox = (box_size: string, margin:number, input_ratio?:number):React.CSSProperties  => {

    let roundDown = (value: number, factor:number, precision: number) => {
      return  Math.floor( factor * value * precision) / precision;
    }

    let ratio = typeof input_ratio === 'number'
      ? input_ratio
      : window.outerHeight/window.outerWidth;

    let percent = box_size.match(/\d+\%/);
    let isPercent = percent != null  &&  percent.length>0 && percent[0]  == box_size;

    let box_s =  parseFloat(box_size);
    if(isPercent || box_s > 1 ){
      box_s = box_s / 100;
    }
    // console.log(`aspect: ${ratio} bs: ${box_s}`);

    if(ratio && ratio < 1){

      let width = ratio * box_s;
      let r_width = roundDown(width, 100, 1000);

      let sides   = (1 - (width + margin) ) / 2;
      let r_sides = roundDown(sides, 100, 1000);

      return{
        width: `${r_width}%`,
        marginLeft: `${r_sides}%`,
        marginRight: `${r_sides}%`,
      }
    }
    return {};
  }


}
export default DomUtils;
