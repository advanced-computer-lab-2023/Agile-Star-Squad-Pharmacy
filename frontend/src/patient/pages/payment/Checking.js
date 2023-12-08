import React from 'react';
// import { FontistoAmerican } from '../../../shared/components/FontistoAmerican';
// import { LogosVisa } from '../../../shared/components/LogosVisa';
import CartContext from '../cart/Cart';
import {useContext,useEffect,useState} from 'react';
import { Elements } from '@stripe/react-stripe-js';
import './style.css';
import NavBar from '../../../shared/components/NavBar/NavBar';
import Card from '../../../shared/components/Card/Card';
import { loadStripe } from '@stripe/stripe-js';
import Payment from './Payment';
import UserContext from '../../../user-store/user-context';
import axios from 'axios';


const Checking = () => {
  const userCtx = useContext(UserContext);
  const cartCtx = useContext(CartContext);
  const patientId = userCtx.userId;
  const [stripePromise, setStripePromise] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
useEffect(() => {
    const fetchAddresses = async () => {
      const res = await axios
        .get(`http://localhost:4000/address/${patientId}`, { withCredentials: true })
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
    <div>
      <NavBar />
      <div className="checkout">
        <div className="div">
          <div className="overlap-group">
            <div className="overlap-2">
              <div className='container' style={{marginLeft:'50px'}}>
            
            <Elements stripe={stripePromise} >
              <Payment CartCtx={cartCtx} SelectedAddressId={selectedAddressId}/>
            </Elements>
          
         
          </div>
            </div>
            <div className="overlap-3">
              <h2 className="title">ORDER SUMMARY</h2>
              <div>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Checking;
