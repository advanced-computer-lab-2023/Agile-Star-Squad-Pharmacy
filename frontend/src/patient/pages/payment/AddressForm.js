import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CheckoutForm.module.css';
import UserContext from '../../../user-store/user-context';
import CartContext from '../cart/Cart';
import axios from 'axios';

export default function AddressForm(props) {
  const userCtx = useContext(UserContext);

  const patientId = userCtx.userId;
  const addressId = props.addressInfo;
  const [addresses, setAddresses] = useState([]);
  const [address, setAddress] = useState();
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
  }, [selectedAddressId]);
  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId);
    setAddress(addresses.filter)
  };
  

     

  return (
    <form
      id="payment-form"
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
        <span className={styles.title}>Address</span>
      </div>
     
      <select className={styles.input1} onChange={(e)=>handleAddressSelect(e.target.value)}>
              <option   value="">
                Select an Address
              </option>
              {addresses.map((address) => (
                <option
                  key={address._id}
                  value={selectedAddressId}
                >
                
                  <p>
                    <strong>       Country:</strong> {address.country}  
                  </p>
                  <p>
                    <strong> --- City:</strong> {address.city}  
                  </p>
                  <p>
                    
                    <strong> --- Street:</strong> {address.street}
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
      <label className={styles.label1}>Street</label>
      <br />
      <input
        type="text"
        className={styles.input1}
        name="radio"
        placeholder="Enter your Street"
        
        // id="use-wallet"
      />
      <label className={styles.label1}>City</label>
      <br />
      <select
        type="text"
        className={styles.input1}
        name="radio"
        placeholder="Select your City"
        // id="use-wallet"
      />
      <label className={styles.label1}>District</label>
      <br />
      <select
        type="text"
        className={styles.input1}
        name="radio"
        placeholder="Select your City"
        // id="use-wallet"
      />
      <label className={styles.label1}>Mobile Number</label>
      <br />
      <input
        type="tel"
        className={styles.input1}
        name="number"
        placeholder="Enter your mobile number"
        // id="use-wallet"
      />
    </form>
  );
}
