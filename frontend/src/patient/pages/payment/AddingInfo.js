import React, { useState, useEffect, useContext } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import Card from '../../../shared/components/Card/Card';
import { loadStripe } from '@stripe/stripe-js';
import CartContext from '../cart/Cart';
import Payment from './Payment';
import { useNavigate,Link} from 'react-router-dom';
import UserContext from '../../../user-store/user-context';

const AddingInfo = (props) => {
  const userCtx = useContext(UserContext);
  const cartCtx = useContext(CartContext);
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState('');

  const navigate = useNavigate();

  const goToOrdersHandler = () => {
    navigate(`/order`);
  };
  useEffect(() => {
    const fetchData = async () => {
      const data = {
        patient_id: userCtx.userId,
        price: cartCtx.total,
      };

      try {
        const response = await fetch('http://localhost:4000/create-payment-intent', {
          method: 'POST',
          body: JSON.stringify(data),
        });

        const { clientSecret } = await response.json();
        setClientSecret(clientSecret);
      } catch (error) {
        console.error('Error creating payment intent:', error);
      }
    };

    fetchData();
  }, [cartCtx.total]);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('http://localhost:4000/config');
        const { publishableKey } = await response.json();
        setStripePromise(loadStripe(publishableKey));
      } catch (error) {
        console.error('Error loading Stripe config:', error);
      }
    };

    fetchConfig();
  }, []);

  return (
    <div className="container">
      <br />
      <br />
      <div className="row justify-content-evenly gx-5">
        <div className="col card1">
          <Card>
            <Elements stripe={stripePromise}>
              <Payment CartCtx={cartCtx} />
            </Elements>
          </Card>
        </div>
        <div className="col" id="card2">
          <Card>
            {/* Display your cart items, length, and total here */}
            <div>Items: {cartCtx.length}</div>
            <div>Total: ${cartCtx.total}</div>
            {cartCtx.items.map((item) => (
              <div key={item.id}>
                {item.name} - Quantity: {item.quantity} - Price: ${item.price}
              </div>
            ))}
          </Card>
          <Link to="../patient/pages/order/Order">
          <button onClick={goToOrdersHandler}>Go to Orders</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AddingInfo;
