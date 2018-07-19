import * as React from 'react';

class Link extends React.Component <any, any > {

  static defaultProps = {
    event: {},
    name: 'NameMe',
    label: 'Label',
    handler: () => {alert('hey you are supposed to override me')}
  }
  
  constructor(props:any){
    super(props);
    this.props.handler.bind(this);
    this.state = {
      active: false
    }
  }

  render() {
    return(
        <a
          data-state = {this.props.name}
          href = {this.props.name}
          onClick = {e => this.props.handler(e)}
        >
          {this.props.label}
        </a>
    );
  }
}

export default Link;
