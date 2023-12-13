import React, { useState, useContext, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import './CheckoutForm.css';
import UserContext from '../../../user-store/user-context';
import CartContext from '../cart/Cart';
import axios from 'axios';

 

export default function AddressForm(props) {
  const userCtx = useContext(UserContext);
  const patientId = userCtx.userId;
  const addressId = props.addressInfo;
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
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
  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId);
  };
 


  //   const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     setMessage('');
  //     if (!stripe || !elements) {
  //       // Stripe.js has not yet loaded.
  //       // Make sure to disable form submission until Stripe.js has loaded.
  //       return;
  //     }

  //     setIsProcessing(true);

  //     try {
  //       // console.log('//////////////////////////');
  //       // console.log(props.CartCtx.items);
  //       const cartItems = cartCtx.items;
  //       const medicineList = cartItems.map((item) => {
  //         return { medicineId: item.id, count: item.quantity };
  //       });
  //       let paymentIntentData = {
  //         patientId: userCtx.userId,
  //         medicineList,
  //         totalCost: cartCtx.total,
  //         address: addressId,
  //       };
  //       const response = await fetch('http://localhost:4000/orders', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify(paymentIntentData),
  //         credentials: 'include',
  //       });

  //       if (!response.ok) {
  //         throw new Error('Failed to send data to the server.');
  //       }

  //       setMessage('Payment successful!');
  //       cartCtx.clearCart();
  //       const { error } = await stripe.confirmPayment({
  //         elements,
  //         confirmParams: {
  //           return_url: 'http://localhost:3000/order',
  //         },
  //       });
  //     } catch (error) {
  //       setMessage('Failed to process payment.');
  //     }
  //     setIsProcessing(false);
  //   };

  //   const onSubmit = (e) => {
  //     switch (useWallet) {
  //       case 0:
  //         handleSubmit(e);
  //         break;
  //       case 1:
  //         handleWallet(e);
  //         break;
  //       case 2:
  //         handleCOD();
  //       default:
  //         break;
  //     }
  //   };

  return (
    <form
      id="address-form"
      style={{ width: '700px', marginLeft: '650px', paddingLeft: '20px' }}
    >
         
      <div
        style={{
          display: 'flex',
          marginLeft: '25px',
          paddingBottom: '14px',
          justifyContent: 'space-between',
        }}
      >
        
        <span id="title">Shipping</span>
      </div>
      <select className='input1'>
              <option  value="" disabled selected>
                Select an Address
              </option>
              {addresses.map((address) => (
                <option
                  key={address._id}
                 
                >
                  <div>{address.country} - {address.city} - {address.street}</div>
                  <div>
                    <strong>       (Country:</strong> {address.country}  
                  </div>
                  <div>
                    <strong>       City:</strong> {address.city}  
                  </div>
                  <div>
                    
                    <strong>       Street:</strong> {address.street}) 
                  </div>
                </option>
              ))}
            </select>
      <label className="label1">Name</label>
      <br />
      <input
        type="text"
        className="input1"
        name="radio"
        placeholder="Name"
        // id="use-wallet"
      />
      <label className="label1">Address</label>
      <br />
      <input
        type="text"
        className="input1"
        name="radio"
        placeholder="Name"
        // id="use-wallet"
      />
      <label className="label1">Mobile Number</label>
      <br />
      <input
        type="tel"
        className="input1"
        name="number"
        placeholder="Enter your mobile number"
        // id="use-wallet"
      />
    </form>
  );
}
