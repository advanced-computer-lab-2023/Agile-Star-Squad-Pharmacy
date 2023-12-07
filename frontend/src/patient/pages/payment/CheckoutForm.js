import { PaymentElement } from '@stripe/react-stripe-js';
import { useState, useContext, useEffect } from 'react';
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
    fetch(
      `http://localhost:4000/patients/${userCtx.userId}`, { credentials: "include" }
    ).then(async response => {
      const responseData = await response.json();
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
        address: addressId
      };
      const response = await fetch('http://localhost:4000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentIntentData),
        credentials: "include"
      })

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
        address: addressId
      };
      await fetch('http://localhost:4000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentIntentData),
        credentials: "include"
      })

      if (response.ok) {
        // Handle a successful response
        cartCtx.clearCart();
        navigate("/");
      } else {
        // Handle errors if the server response is not ok
        alert('Failed to update data.');
      }
    } catch (error) {
      // Handle network errors
      alert('Network error: ' + error.message);
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
        address: addressId
      };
      await fetch('http://localhost:4000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentIntentData),
        credentials: "include"
      })
      cartCtx.clearCart();
      navigate("/");
    } catch (error) {
    }

  }

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
  }


  return (
    <form id="payment-form" onSubmit={onSubmit}>
      <div className='d-flex flex-row justify-content-between'>
        <div>
          <input
            type="radio"
            className='me-2'
            name='radio'
            id="use-wallet"
            // checked={useWallet}
            onChange={(e) => setUseWallet(1)}
          />
          <label htmlFor="use-wallet">Pay with Wallet</label>
        </div>
        <label>Balance: {balance}</label>
      </div>
      <div>
        <input
          type="radio"
          name='radio'
          className='me-2'
          // id="use-wallet"
          // checked={false}
          onChange={(e) => setUseWallet(2)}
        />
        <label htmlFor="use-wallet">Cash on Delivery</label>
      </div>
      <div>
        <input
          type="radio"
          className='me-2'
          name='radio'
          // id="use-wallet"
          checked={useWallet == 0}
          onChange={(e) => setUseWallet(0)}
        />
        <label htmlFor="use-wallet">Credit Card</label>
      </div>
      {useWallet == 1 && balance < cartCtx.total && <div>
        Insufficient funds!
      </div>}
      <div>{useWallet == 0 && <PaymentElement id="payment-element" />}</div>
      <button disabled={isProcessing || !stripe || !elements || (useWallet == 1 && balance < cartCtx.total)} id="submit">
        <span id="button-text">
          {isProcessing ? 'Processing ... ' : 'Pay now'}
        </span>
      </button>
      <button onClick={(e)=> handleCancel(e)}>Cancel</button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}
