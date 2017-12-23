import React, { Component } from 'react';
import braintree from 'braintree-web-drop-in';
import BraintreeDropin from 'braintree-dropin-react';


const renderSubmitButton = ({onClick, isDisabled, text}) => {
    return (
      <button
        onClick={onClick}
        disabled={isDisabled}
      >{text}</button>
    )
}


export default class PaymentForm extends Component {
constructor(props){
    super(props);
//    console.log(props);
    this.state={clientToken: ''}

   
    this.handlePaymentMethod = this.handlePaymentMethod.bind(this);
    this.getClientToken = this.getClientToken.bind(this);

    
}

componentDidMount() {
    console.log('Mounted');
    this.getClientToken().then(token=>{
    this.setState({clientToken: token});    
        }); 
    }
    
onError(err){

console.log(err)
}

handlePaymentMethod(payload){
console.log(payload)
//send nonce to server to create payment method or transaction

fetch(`/checkout`,{
  method: 'post',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
}).then(response => {    
    // console.log(response);
     if (response.ok) {
      //   console.log(response.json());
      response.json().then(transaction =>{
               console.log(transaction);
      })
     } else { throw new Error('Server response was not OK');
 }
 })


} 

onCreate = (instance) => {
    console.log('onCreate')
  }

  onDestroyStart = () => {
    console.log('onDestroyStart')
  }

  onDestroyEnd = () => {
    console.log('onDestroyEnd')
  }

  onError = (error) => {
    console.log('onError', error)
  }

getClientToken(){
 return fetch(`/client_token`).then(response => {    
               // console.log(response);
                if (response.ok) {
                 //   console.log(response.json());
                return response.json();
                
                } else { throw new Error('Server response was not OK');
            }
            })
        }
    
render() {

if(!this.state.clientToken) return null;else
    return (
    <div>

        <BraintreeDropin
          braintree={braintree}
          authorizationToken={this.state.clientToken}
          handlePaymentMethod={this.handlePaymentMethod}  
          onCreate={this.onCreate}
          onDestroyStart={this.onDestroyStart}
          onDestroyEnd={this.onDestroyEnd}
          onError={this.onError}
          renderSubmitButton={renderSubmitButton}

        />
    
    </div>
    
    );
    }

}