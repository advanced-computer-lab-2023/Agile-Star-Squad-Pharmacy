import { PaymentElement } from '@stripe/react-stripe-js';
import React, { useState, useContext, useEffect } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import styles from './CheckoutForm.module.css';
import UserContext from '../../../user-store/user-context';
import CartContext from '../cart/Cart';
import './AddingInfo.css'
import axios from 'axios';
import { toastMeError } from '../../../shared/util/functions';
import { toastMeSuccess } from '../../../shared/util/functions';

const citiesInEgypt = [
  {
    city: 'Cairo',
    districts: ['Nasr City', 'Maadi', 'Heliopolis', 'Mohandessin', 'Zamalek']
  },
  {
    city: 'Alexandria',
    districts: ['Miami', 'Roushdy', 'Montaza', 'Sidi Bishr', 'Smouha']
  },
  {
    city: 'Giza',
    districts: ['Agouza', 'Dokki', 'Mohandessin', 'Faisal', 'Haram']
  },
];

export default function CheckoutForm(props) {
  const userCtx = useContext(UserContext);
  const cartCtx = useContext(CartContext);
  const stripe = useStripe();
  const elements = useElements();
  let navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [useWallet, setUseWallet] = useState(0);
  const [useSave, setUseSave] = useState(false);
  const addressId = props.addressInfo;
  const [balance, setBalance] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [address, setAddress] = useState();
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedStreet, setSelectedStreet] = useState('');
  const [savedAddress,setSavedAddress]= useState('')



  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
    setSelectedDistrict('');
  };

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
  };

  useEffect(() => {
    const fetchAddresses = async () => {
      const res = await axios
        .get(`http://localhost:4000/address/${userCtx.userId}`, {
          withCredentials: true,
        })
        .catch((err) => {
          console.error(err);
        });
        
      setAddresses(res.data.data.addresses);
      
      
     
    };
    fetchAddresses();
  }, []);
  useEffect(()=>{
    if(savedAddress)
      setSelectedAddressId(savedAddress)
  },[savedAddress])
  const handleAddressSelect = (addressId) => {
    
    setSelectedAddressId(addressId);
    if (addressId) {
      const foundAddress = addresses.find((address) => address._id === addressId)
      setAddress(foundAddress);
      setSelectedCity(foundAddress.city)
      setSelectedDistrict(foundAddress.district)
      
      setSelectedStreet(foundAddress.street)
    } else {
      setSelectedCity('')
      // setSelectedDistrict(foundAddress.district)
      setSelectedStreet('')
    }

  };

  // useEffect(()=>{
  //   if(savedAddress){
  //     switch (useWallet) {
  //       case 0:
  //         handleSubmit(e);
  //         break;
  //       case 1:
  //         handleWallet(e);
  //         break;
  //       case 2:
  //         handleCOD(e);
  //       default:
  //         break;
  //     }
  //   }
  // },[savedAddress])
  const addAddress= async()=>{
    if(selectedAddressId==null||selectedAddressId==''){
        
      let paymentIntentData2 = {
        country:'Egypt',
        city:selectedCity,
        district:selectedDistrict,
        street:selectedStreet,
        // patient:userCtx.userId
      };
     
      
      const response = await fetch(`http://localhost:4000/address/${userCtx.userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentIntentData2),
        credentials: 'include',
      });
      const responseStuff= await response.json();
      
      if (!response.ok) {
        
        throw new Error('Failed to send data to the server.');
    
      }
      
      
      toastMeSuccess('Address Added Successfully')
      console.log(responseStuff.data.address._id)
   
      return responseStuff.data.address._id
     }
  }

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
        return { medicineId: item.id, count: item.quantity, price: item.price, profit: item.price * 0.9 };
      });
      
      let addressToUse=null;
      if(selectedAddressId){
        addressToUse= selectedAddressId;
      }
      else if(savedAddress){
         addressToUse= savedAddress;
      }
      else{
       addressToUse= await addAddress();
      }
     
      
       let paymentIntentData = {
        patientId: userCtx.userId,
        medicineList,
        totalCost: cartCtx.total,
        address: addressToUse,
      };
     
      const response = await fetch('http://localhost:4000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentIntentData),
        credentials: 'include',
      });
    
      if (response.status == 400) {
        toastMeError((await response.json()).message);
        return;
      } else
      if (!response.ok) {
      
        throw new Error('Failed to send data to the server.');
      }
      toastMeSuccess(`Payment Successful`)
      setMessage('Payment successful!');
      cartCtx.clearCart();
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: navigate('/'),
        },
      });
    } catch (error) {
      console.log("hereeee")
      toastMeError('Failed to process payment.');
    }
    setIsProcessing(false);
  
  
  };

  const handleWallet = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    const deduct = cartCtx.total * -1;
    const response = await fetch(
      `http://localhost:4000/patients/${userCtx.userId}`
    );
    const responseData = await response.json();
    const currentWallet = responseData.data.patient.wallet;
    // console.log("wallet" ,currentWallet +deduct )
    if (currentWallet + deduct >= 0) {

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
          return { medicineId: item.id, count: item.quantity, price: item.price, profit: item.price * 0.9 };
        });

        let addressToUse=null;
      if(selectedAddressId){
        addressToUse= selectedAddressId;
      }
      else if(savedAddress){
         addressToUse= savedAddress;
      }
      else{
       addressToUse= await addAddress();
      }
        let paymentIntentData = {
          patientId: userCtx.userId,
          medicineList,
          totalCost: cartCtx.total,
          address: addressToUse,
        };
        await fetch('http://localhost:4000/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(paymentIntentData),
          credentials: 'include',
        });
        if (response.status == 400) {
          toastMeError((await response.json()).message);
          return;
        }  else 
        if (response.ok) {
          // Handle a successful response
          toastMeSuccess(`Payment Successful`)
          cartCtx.clearCart();
          navigate('/');
        } else {
          // Handle errors if the server response is not ok
          toastMeError('Failed to update data.');
        }
      } catch (error) {
        // Handle network errors
        toastMeError('Network error: ' + error.message);
      }
    } else {
      toastMeError('Insufficient balance in your wallet.');
    }

    setIsProcessing(false);
  };
  const handleCancel = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  const handleCOD = async (e) => {
    e.preventDefault();
    try {
      const cartItems = cartCtx.items;
      const medicineList = cartItems.map((item) => {
        return { medicineId: item.id, count: item.quantity, price: item.price, profit: item.price * 0.9 };
      });
      let addressToUse=null;
      if(selectedAddressId){
        addressToUse= selectedAddressId;
      }
      else if(savedAddress){
         addressToUse= savedAddress;
      }
      else{
       addressToUse= await addAddress();
      }
      let paymentIntentData = {
        patientId: userCtx.userId,
        medicineList,
        totalCost: cartCtx.total,
        address: addressToUse,
        isCOD: true,
      };
      const response = await fetch('http://localhost:4000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentIntentData),
        credentials: 'include',
      });
      
      if (response.status == 400) {
        toastMeError((await response.json()).message);
      } else {
        toastMeSuccess(`Order Placed Successfully`)
        cartCtx.clearCart();
        navigate('/');
      }
    } catch (error) {
    }
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
        handleCOD(e);
      default:
        break;
    }
  };

  return (
    <form id="payment-form" onSubmit={onSubmit}>
      <div style={{ paddingBottom: '14px' }}>
        <div
          style={{
            display: 'flex',
            marginLeft: '25px',
            paddingBottom: '14px',
            justifyContent: 'space-between',
          }}
        >
          <span className={styles.title}>Address</span>
        </div>

        <select
          className={styles.input1}
          value={selectedAddressId}
          onChange={(e) => handleAddressSelect(e.target.value)}
        >
          <option value="" style={{ color: 'black' }}>Select an Address</option>
          
          {addresses.map((address1) => (
            
            <option style={{ color: 'black' }} key={address1._id} value={address1._id}>
              <p>
                <strong> Country:</strong> {address1.country}
              </p>
              <p>
                <strong> --- City:</strong> {address1.city}
              </p>
              <p>
                <strong> --- Street:</strong> {address1.street}
              </p>
              <p>
                <strong> --- District:</strong> {address1.district}
              </p>
            </option>
          ))}
        </select>
        <label className={styles.label1}>Name</label>
        <br />
        <input
          type="text"
          className={styles.input1}
          name="radio"
          placeholder="Enter your Name"

        // id="use-wallet"
        />

       {!selectedAddressId &&(<div><label className={styles.label1}> City:</label>
        <select className={styles.input1} value={selectedCity} onChange={handleCityChange} required>
          <option value="" style={{ color: 'black' }}>Select a city</option>
          {citiesInEgypt.map((cityObj, index) => (
            <option key={index} value={cityObj.city} style={{ color: 'black' }}>
              {cityObj.city}
            </option>
          ))}
        </select></div>)}

        {selectedCity && !selectedAddressId &&(
          <div>
            <label className={styles.label1}>District:</label>
            <select className={styles.input1} value={selectedDistrict} onChange={handleDistrictChange}>
              <option value="" style={{ color: 'black' }}>Select a district</option>
              {citiesInEgypt
                .find((cityObj) => cityObj.city === selectedCity)
                .districts.map((district, index) => (
                  <option key={index} value={district} style={{ color: 'black' }}>
                    {district}
                  </option>
                ))}
            </select>
          </div>
        )}
       {!selectedAddressId &&
       <div> <label className={styles.label1}>Street</label>
        <br />
        <input
          type="text"
          className={styles.input1}
          name="radio"
          placeholder="Enter your Street"
          value={selectedStreet}
          onChange={(e) => setSelectedStreet(e.target.value)}
          // id="use-wallet"
          required
        />
        </div>}
        <label className={styles.label1}>Mobile Number</label>
        <br />
        <input
          type="tel"
          className={styles.input1}
          name="number"
          placeholder="Enter your mobile number"
        // id="use-wallet"
        />
        
      </div>
      <div
        style={{
          display: 'flex',
          marginLeft: '25px',
          paddingBottom: '14px',
          justifyContent: 'space-between',
        }}
      >
        <span className={styles.title}>Payment</span>
        <label
          className={styles.title2}
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
          <div className={styles.me3} style={{ marginLeft: '0px' }}>
            <img
              className={`hellokitty ${useWallet === 0 ? 'active' : ''}`}
              src="/cc.png"
              onClick={() => setUseWallet(0)}
            />
          </div>
          <div className={styles.me3} style={{ paddingLeft: '40px' }}>
            {/* <label htmlFor="use-wallet">Cash on Delivery</label> */}
            <img
              className={`hellokitty ${useWallet === 2 ? 'active' : ''}`}
              src="/cod.png"
              onClick={() => setUseWallet(2)}
            />
          </div>
          <div className={styles.me3} style={{ paddingLeft: '40px' }}>
            <img
              className={`hellokitty ${useWallet === 1 ? 'active' : ''}`}
              src="/wallet.png"
              onClick={() => setUseWallet(1)}
              id="use-wallet"
            />
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
              <label className={styles.label1}>Card Holder Name</label>
              <br />
              <input
                type="text"
                className={styles.input1}
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
      <div className={styles.buttons} style={{ paddingTop: '20px' }}>
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
