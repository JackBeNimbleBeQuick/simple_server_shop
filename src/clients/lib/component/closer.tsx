import * as React from 'react';

class Closer extends React.Component <any, any > {

  static defaultProps = {
    open: true,
    handler: () => {alert('hey you are supposed to override me')}
  }
  constructor(props:any){
    super(props);
    this.props.handler.bind(this);
    this.state = {
      open: true,
      active: false
    }
  }

  render() {
    let classes = ['closer',this.props.open ? 'open' : 'closed'];
    return(
      <button className={classes.join(' ')}
        onClick = {e => this.props.handler(e)}>
        <span className="icon"></span>
      </button>
    );
  }
}

export default Closer;
