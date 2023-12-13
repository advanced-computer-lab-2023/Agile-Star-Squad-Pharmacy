import React, { useState, useEffect, useContext } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import Card from '../../../shared/components/Card/Card';
import { loadStripe } from '@stripe/stripe-js';
import CartContext from '../cart/Cart';
import Payment from './Payment';
import { useNavigate, Link } from 'react-router-dom';
import UserContext from '../../../user-store/user-context';
import axios from 'axios';

const AddingInfo = (props) => {
  const userCtx = useContext(UserContext);
  const patientId = userCtx.userId;
  const cartCtx = useContext(CartContext);
  const [stripePromise, setStripePromise] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAddresses = async () => {
      const res = await axios
        .get(`http://localhost:4000/address/${patientId}`, {
          withCredentials: true,
        })
        .catch((err) => {
          console.error(err);
        });
      setAddresses(res.data.data.addresses);
      setSelectedAddressId(res.data.data.addresses[0]._id);
    };
    fetchAddresses();
  }, []);

  // const hanldeAddressSelect = async () => {
  //   // try {
  //   //   const res = await axios
  //   //     .post(`http://localhost:4000/order/${patientId}`, { withCredentials: true })
  //   //     .catch((err) => {
  //   //       console.error(err);
  //   //     });
  //   //   setAddresses(res.data.data.addresses);
  //   // }
  //   // catch (error) {
  //   //   console.error('Error fetching data:', error);
  //   // }
  // }

  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId);
  };

  console.log('addresses///////////////////////////');
  console.log(addresses);
  console.log('addresses///////////////////////////');

  const goToOrdersHandler = () => {
    navigate('/order');
  };
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const data = {
  //       patient_id: userCtx.userId,
  //       price: cartCtx.total,
  //     };

  //     try {
  //       const response = await fetch('http://localhost:4000/create-payment-intent', {
  //         method: 'POST',
  //         body: JSON.stringify(data),
  //       });

  //       const { clientSecret } = await response.json();
  //       setClientSecret(clientSecret);
  //     } catch (error) {
  //       console.error('Error creating payment intent:', error);
  //     }
  //   };

  //   fetchData();
  // }, [cartCtx.total]);

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
        <Card>
          <div>
            <h3>Shipping Address</h3>
            <select >
              <option value="" disabled selected>
                Select an Address
              </option>
              {addresses.map((address) => (
                <option
                  key={address._id}
                 
                >
                  <div>{address.country} - {address.city} - {address.street}</div>
                  <div>
                    <strong>       Country:</strong> {address.country}  
                  </div>
                  <div>
                    <strong>       City:</strong> {address.city}  
                  </div>
                  <div>
                    
                    <strong>       Street:</strong> {address.street}  
                  </div>
                </option>
              ))}
            </select>
          </div>
        </Card>
        <div className="col card1">
          <Card>
            <Elements stripe={stripePromise}>
              <Payment
                CartCtx={cartCtx}
                SelectedAddressId={selectedAddressId}
              />
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
        </div>
      </div>
    </div>
  );
};

export default AddingInfo;
