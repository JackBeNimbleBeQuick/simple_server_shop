///<reference path="../../../lib/interfaces/shop.interface.d.ts" />

import * as React from 'react';

import Image from 'clients/lib/component/image';

class ShopperFrame extends React.Component<any, any>{

  static defaultProps = {
    product:{
      id: 'id name',
      name: 'product name',
      links: [],
      messages: [],
      priceRange: {},
      reviews: [],
      swatches: [],
      hero: {},
      thumbnail: {},
      images: [],
    },
    heading: null,
    expander: ()=>{alert('Hey do not forget to override me 8^)')},
    currencySymbol: "$",
    icons: {
      organic:{
        label: 'Organic',
      },
      fairTrade:{
        label: 'Fair Trade',
      },
      newcore:{
        label: 'new'
      }
    }
  }

  constructor(props:any){
    super(props);
    this.state = {
    }
  }

  renderPrices = () => {

    return(
      <div className="price-range">
        <span className="price">
          <span className="currency">{this.props.currencySymbol}</span>
          {this.props.product.priceRange.selling.low}
        </span>
        <span className="symbol dash"></span>
        <span className="price">
          <span className="currency">{this.props.currencySymbol}</span>
          {this.props.product.priceRange.selling.high}
        </span>
      </div>
    );

  }

  renderFlags = () => {

    let flags =  this.props.product.flags.map((flag:flag,i:any)=>{
      let tag   = `flag-${flag.id} rank-${flag.rank}`;
      let label = this.props.icons[flag.id] ? this.props.icons[flag.id].label : '';
      return (
        <span className={tag} key={i}>
          {label}
        </span>
      );

    });

    return (
      <div className="flags">
        {flags}
      </div>
    );
  }

  render(){
    let heading = null;
    if(this.props.heading){
      heading =
      <h4>{this.props.heading}</h4>
    }
    return(
      <div className="frame col-lg-4 col-sm-12">
        {heading}
        <div className="panel left">
          <Image
            product = {this.props.product}
            image = {this.props.product.hero}
            alt = {this.props.product.name}
            handler = {this.props.expander}
          />
        </div>
        <div className="panel right">
          <h2>{this.props.product.name}</h2>
          {this.renderFlags()}
          {this.renderPrices()}
        </div>
      </div>
    );
  }
}

export default ShopperFrame;
