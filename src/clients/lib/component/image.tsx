import * as React from 'react';

class Image extends React.Component <any, any > {

  static defaultProps = {
    product: {},
    image:{
      height: 1,
      width: 1,
      href: '',
    },
    alt: '',
    src: '',
    name: 'NameMe',
    handler: () => {alert('hey you are supposed to override me')}
  }

  constructor(props:any){
    super(props);
    this.state = {
      active: false
    }
  }

  render() {

    let w = Number.parseFloat(this.props.image.width);
    let h = Number.parseFloat(this.props.image.height);
    let p_aspect = {paddingBottom: `w/h%`};

    return(
      <span className="image-wrap" style={p_aspect}>
        <img
          alt = {this.props.alt}
          className = {this.props.name}
          src = {this.props.image.href}
          onClick = {e => this.props.handler(this.props.product)}
        />
      </span>
    );
  }
}

export default Image;
