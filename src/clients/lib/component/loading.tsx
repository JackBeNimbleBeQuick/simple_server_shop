import * as React from 'react';

class Loading extends React.Component <any, any > {

  static defaultProps = {
  }

  constructor(props:any){
    super(props);
    this.state = {}
  }

  render() {
    return(
      <div className="loading">
        <p>Getting results</p>
      </div>
    );
  }
}

export default Loading;
