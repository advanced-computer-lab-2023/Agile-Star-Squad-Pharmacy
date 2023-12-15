import { PaymentElement } from '@stripe/react-stripe-js';
import React, { useState, useContext, useEffect } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import './CheckoutForm.css';
import UserContext from '../../../user-store/user-context';
import CartContext from '../cart/Cart';

export default function CheckoutForm(props) {
  const userCtx = useContext(UserContext);
  const cartCtx = useContext(CartContext);
  const stripe = useStripe();
  const elements = useElements();
  let navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [useWallet, setUseWallet] = useState(0);
  const addressId = props.addressInfo;
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:4000/patients/${userCtx.userId}`, {
      credentials: 'include',
    }).then(async (response) => {
      const responseData = await response.json();
      // console.log(responseData.data.patient.wallet);
      setBalance(+responseData.data.patient.wallet);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsProcessing(true);

    try {
      // console.log('//////////////////////////');
      // console.log(props.CartCtx.items);
      const cartItems = cartCtx.items;
      const medicineList = cartItems.map((item) => {
        return { medicineId: item.id, count: item.quantity };
      });
      let paymentIntentData = {
        patientId: userCtx.userId,
        medicineList,
        totalCost: cartCtx.total,
        address: addressId,
      };
      const response = await fetch('http://localhost:4000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentIntentData),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to send data to the server.');
      }

      setMessage('Payment successful!');
      cartCtx.clearCart();
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: 'http://localhost:3000/order',
        },
      });
    } catch (error) {
      setMessage('Failed to process payment.');
    }
    setIsProcessing(false);
  };

  const handleWallet = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    const deduct = cartCtx.total * -1;
    const response = await fetch(`http://localhost:4000/patients/${userCtx.userId}`)
    const responseData = await response.json();
    const currentWallet = responseData.data.patient.wallet;
   if(currentWallet+deduct<=0){

    try {
      const response = await fetch(
        `http://localhost:4000/patients/${userCtx.userId}/wallet`,

        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ walletAmount: deduct }),
        }
      );

      const cartItems = cartCtx.items;
      const medicineList = cartItems.map((item) => {
        return { medicineId: item.id, count: item.quantity };
      });
      let paymentIntentData = {
        patientId: userCtx.userId,
        medicineList,
        totalCost: cartCtx.total,
        address: addressId,
      };
      await fetch('http://localhost:4000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentIntentData),
        credentials: 'include',
      });

      if (response.ok) {
        // Handle a successful response
        cartCtx.clearCart();
        navigate('/');
      } else {
        // Handle errors if the server response is not ok
        alert('Failed to update data.');
      }
    } catch (error) {
      // Handle network errors
      alert('Network error: ' + error.message);
    }}
    else{
      setMessage("Insufficient balance in your wallet.");
    }

    setIsProcessing(false);
  };
  const handleCancel = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  const handleCOD = async () => {
    try {
      const cartItems = cartCtx.items;
      const medicineList = cartItems.map((item) => {
        return { medicineId: item.id, count: item.quantity };
      });
      let paymentIntentData = {
        patientId: userCtx.userId,
        medicineList,
        totalCost: cartCtx.total,
        address: addressId,
      };
      await fetch('http://localhost:4000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentIntentData),
        credentials: 'include',
      });
      cartCtx.clearCart();
      navigate('/');
    } catch (error) {}
  };
  const cardElementOptions = {
    style: {
      base: {
        fontSize: '40px',

        color: '#32325d',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
      },
    },
    // Customize other options here
  };

  const onSubmit = (e) => {
    switch (useWallet) {
      case 0:
        handleSubmit(e);
        break;
      case 1:
        handleWallet(e);
        break;
      case 2:
        handleCOD();
      default:
        break;
    }
  };

  return (
    <form id="payment-form" onSubmit={onSubmit}>
      <div
        style={{
          display: 'flex',
          marginLeft: '25px',
          paddingBottom: '14px',
          justifyContent: 'space-between',
        }}
      >
        <span id="title">Payment</span>
        <label
          id="title2"
          style={{
            marginTop: '15px',
            marginLeft: '150px',
            textDecoration: 'none',
            fontSize: 'smaller',
            color: 'white',
            fontWeight: '300',
          }}
        >
          Balance: {balance}{' '}
        </label>
      </div>

      <div className="d-flex flex-row justify-content-between">
        <div style={{ display: 'flex', marginLeft: '65px' }}>
          <div className='me-3' style={{marginLeft:'0px'}}> 
           
            <img className={`hellokitty ${useWallet === 0? 'active' : ''}`} src="/cc.png" onClick={() => setUseWallet(0)}/>
            
          </div>
          <div className='me-3' style={{paddingLeft:'40px'}}>
           
            {/* <label htmlFor="use-wallet">Cash on Delivery</label> */}
            <img className={`hellokitty ${useWallet === 2 ? 'active' : ''}`} src="/cod.png" onClick={() => setUseWallet(2)} />
          
          </div>
          <div className='me-3'style={{paddingLeft:'40px'}} > 
            
            <img className={`hellokitty ${useWallet === 1 ? 'active' : ''}`} src="/wallet.png"  onClick={() => setUseWallet(1)}  id='use-wallet'/>
          
          </div>
        </div>
      </div>
      {useWallet == 1 && balance < cartCtx.total && (
        <div
          style={{
            margin: '25px',
            fontFamily: 'poppins',
            fontWeight: '400',
            color: 'rgb(184, 4, 4)',
          }}
        >
          Insufficient funds!
        </div>
      )}

      <div>
        {useWallet == 0 && (
          <React.Fragment>
            <div>
              <label className="label1">Card Holder Name</label>
              <br />
              <input
                type="text"
                className="input1"
                name="radio"
                placeholder="Enter your Name"
                // id="use-wallet"
                checked={useWallet == 0}
                onChange={(e) => setUseWallet(0)}
              />
            </div>
            <PaymentElement id="payment-element" />
          </React.Fragment>
        )}
      </div>
      <div className="buttons" style={{ paddingTop: '20px' }}>
        <button
          disabled={
            isProcessing ||
            !stripe ||
            !elements ||
            (useWallet == 1 && balance < cartCtx.total)
          }
          id="submit"
          style={{ marginLeft: '25px' }}
        >
          <span id="button-text">
            {isProcessing ? 'Processing ... ' : 'Pay now'}
          </span>
        </button>
        <button onClick={(e) => handleCancel(e)}>Cancel</button>

        {/* Show any error or success messages */}
        {message && <div id="payment-message">{message}</div>}
      </div>
    </form>
  );
}
