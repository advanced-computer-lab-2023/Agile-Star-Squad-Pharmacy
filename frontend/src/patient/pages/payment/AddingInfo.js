import React, { useState, useEffect, useContext } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import Card from '../../../shared/components/Card/Card';
import { loadStripe } from '@stripe/stripe-js';
import CartContext from '../cart/Cart';
import Payment from './Payment';
import { Link, useLocation } from 'react-router-dom';
import Cart from '../cart/Cart';

const AddingInfo = (props) => {
  const cartCtx = useContext(CartContext);
  const { items, length, total, addItem, removeItem, removeAll } = useContext(CartContext);
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const data = {
    patient_id: '6521fc7bb512c918531f7e0b',
    price: total,
  };



  useEffect(() => {
    fetch('http://localhost:3000/config')
      .then(async (r) => {
        const { publishableKey } = await r.json();
        setStripePromise(loadStripe(publishableKey));
      })
      .catch((error) => {
        console.error('Error loading Stripe config:', error);
      });
  }, []);

  useEffect(() => {
    fetch('http://localhost:3000/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(async (result) => {
        const { clientSecret } = await result.json();
        setClientSecret(clientSecret);
      })
      .catch((error) => {
        console.error('Error fetching payment intent:', error);
      });
  }, [data]);

  return (
 
    <div className="container">
      <br />
      <br />
      <div className="row justify-content-evenly gx-5">
        <div className="col card1">
          <Card>
            <Elements stripe={stripePromise}>
              <Payment props={cartCtx} clientSecret={clientSecret} />
            </Elements>
          </Card>
        </div>
        <div className="col" id="card2">
          <Card>
            {/* Display your cart items, length, and total here */}
            <div>Items: {length}</div>
            <div>Total: ${total}</div>
            {items.map((item) => (
              <div key={item.id}>
                {item.name} - Quantity: {item.quantity} - Price: ${item.price}
              </div>
            ))}
          </Card>
          <Link to="../patient/pages/order/Order">
            <button className='orders'>Go to Order Page</button>
          </Link>
        </div>
      </div>
    </div>
   );
};

export default AddingInfo;
