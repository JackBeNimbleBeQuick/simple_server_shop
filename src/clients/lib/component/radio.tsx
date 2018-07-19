import * as React from 'react';

class Radio extends React.Component <any, any > {

  static defaultProps = {
    event: {},
    name: 'NameMe',
    handler: () => {alert('ouch your are supposed to set handler')},
    icon: 'boolean-state',
    label: 'Label:',
    select: false,
    value: 'NameMe',
  }

  constructor(props:any){
    super(props);
    this.props.handler.bind(this);
    this.state = {
      active: false
    }
    this.props.handler.bind(this);
  }

  changes = (e:any) => {
    e.preventDefault();
    this.props.handler({
      target: {
        name: this.props.name,
        value: this.props.value,
        caller: this
      }
    });
  }

  render() {
    let target = '#'+this.props.name;
    let state  =  this.props.select ? this.props.icon + ' active' : this.props.icon;

    return(
        <a
          data-value= {this.props.name}
          data-state = {state}
          href = {target}
          onClick = {e => this.changes(e)}
        >
          <span className="icon"> </span>
          <input type="radio"
            name={this.props.name}
            value={this.props.value}
            checked={this.props.select}
            onChange={ e => this.changes(e)}/>

          <label>{this.props.label}</label>
        </a>
    );
  }
}

export default Radio;
