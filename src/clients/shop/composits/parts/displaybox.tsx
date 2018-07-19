///<reference path="../../../lib/interfaces/shop.interface.d.ts" />
import * as React from 'react';
import Closer from 'clients/lib/component/closer';
import Image from 'clients/lib/component/image';
import DomUtils from 'clients/lib/util/dom';
import Store from 'clients/shop/data/store';

class DisplayBox extends React.Component <any, any > {

  windowSnoop:any;

  static defaultProps = {
    closer: ()=>{alert('DisplayBox saize: we needs closer hanler ! Dude-8^)')},
    product: {},
    images:{},
    alt: 'Nice picture of your selection...'
  }

  constructor(props:any){
    super(props);
    this.windowSnoop = this.changeDisplay;
    this.state = {
      // store: new Store(),
      aspect: window.outerWidth / window.outerHeight,
      product: this.props.product,
      images: this.props.images,
      alt: this.props.alt,
      pointer: 0,
      expanded: false
    }
  }

  /**
   * By using listener on store, this component becomes stateful
   */
  componentDidMount(){
    Store.subscribe(this.changeDisplay);
    window.addEventListener('resize',this.windowSnoop);
  }

  componentWillUnmount(){
    window.removeEventListener('resize',this.windowSnoop);
    Store.unsubscribe(this.changeDisplay);
  }

  aspectChange = () => {
    this.setState({aspect: window.outerWidth/window.outerHeight});
  }

  changeDisplay = (data:any) => {
    console.log('DisplayBox changeDisplay')
    console.log(data);
    if(data.shopping && data.shopping.viewing){
      let prod = data.shopping.viewing;

      this.setState({
        pointer: 0,
        expanded: true,
        product: prod,
        images: this.images(prod),
      });
    }else{
      this.setState({
        aspect: window.outerWidth / window.outerHeight,
      });
    }
  }

  /**
   * Closes out the overlay
   * @return {void}
   */
  closeExpander = () => {
    //util class for DOM related activities
    DomUtils.unLockScroll();

    // re: render with expanded = false will result in
    // .null DisplayBox
    this.setState({
      expanded: false,
    });
  }

  /**
   * Changes current slide based on direction
   * @param  {string} dir
   * @return {void} results in setState() re-render
   */
  changeSlide = (dir:string) => {
    let point = this.state.pointer;
    let len   = this.state.images.length;

    switch(dir){

      case 'left':
        point = point-1 > -1
          ? point-1 : len-1;
        break;

      case 'right':
      default:
        point = point+1 < len
          ? point+1 : 0;

    }
    this.setState({pointer:  point});
  }

  /**
   * Supports selecting from images marque
   * @param  {number} slide
   *  setState results with re render using new pointer index
   */
  slideSelect = (slide:number) => {
    this.setState({pointer:  slide});
  }

  /**
   * we need to put hero image on top of marque
   * safest way to do this is to provide new array with it on top
   * @return {[type]} [description]
   */
  images = (prod:product) => {
    //product images we create new Array so as to avoid
    // this.product.images.unshift will polute data that should stay immutable
    let images:Array<image> = [];
    prod.images.map( (image,key)=>{
      images.push(image);
    });
    images.unshift(prod.hero);
    return images;
  }

  /**
   * Render Marque of all images for easy selection
   * @return {[type]} [description]
   */
  renderImagePanel = () =>{
    let list = this.state.images.map((image:image,i:any)=>{

      let classes = ['sidebar', i==this.state.pointer ? 'selected' : ''];

      return(
        <li className={classes.join(' ')} key={i}>
          <Image
            image = {image}
            alt = {this.state.product.name}
            handler= { this.slideSelect.bind(this,i)}
          />
        </li>
      );
    });

    return (
      <ul>
        {list}
      </ul>
    );
  }

  /**
   * Render the DisplayBox Sub View
   * . only renders if expand == true
   *
   * @return {HTMLElement|null}
   */
  render() {

    if(! this.state.expanded) return null;

    let style:React.CSSProperties = DomUtils.rebox('75%', .0001);

    return(
        <div className="bg-block" >
          <Closer
            open={true}
            handler={this.closeExpander}
          />
          <div className="presentation-box" style={style} >

            <div className="view" >

              <span className="clickbar left" onClick={this.changeSlide.bind(this,'left')} >
                <span className="indicate left" ></span>
              </span>

              <Image
                image = {this.state.images[this.state.pointer]}
                alt = {this.state.product.name}
                handler = { this.changeSlide.bind(this,'main')}
              />

              <span className="clickbar right" onClick={this.changeSlide.bind(this,'right')} >
                <span className="indicate right" ></span>
              </span>

              <div className="slides" >
                {this.renderImagePanel()}
              </div>
            </div>
          </div>
        </div >
    );
  }
}

export default DisplayBox;
