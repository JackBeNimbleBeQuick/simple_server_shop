import * as React from 'react';

class Input extends React.Component <any, any > {

  static defaultProps = {
    type: 'text',
    label: 'Provide Label',
    name: 'field-name',
    handler: ()=> {alert('somebody forgot to set field handler')}
  }

  constructor(props:any){
    super(props);
    this.state = {
      active: false,
      value: null,
    }
  }

  checkState = (el:any) => {
    this.setState({ active: this.state.value && this.state.value.length ? true : false});
  }

  focus = (el:any ) => {
    let input = el.target.parentNode.querySelector('input');
    if(input){
      input.focus();
      input.select();
    }
  }

  active = (el:any) => {
    let value = el.target.value;
    this.setState({ active: true, value: value});
    this.props.handler({[this.props.name]: value});
  }

  render() {
    let labelState = ['field', this.state.active ? 'active' : null];

    return(
      <div className={labelState.join(' ')}>

        <label
          onClick={e=>this.focus(e)}
          >{this.props.label}</label>

        <input type={this.props.type} name={this.props.name}
          onBlur={e=>this.checkState(e)}
          onChange={e=>this.active(e)}
          onFocus={ e=>this.active(e) }/>

      </div>

    );
  }
}

export default Input;
