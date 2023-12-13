import React from 'react';
// import { FontistoAmerican } from '../../../shared/components/FontistoAmerican';
// import { LogosVisa } from '../../../shared/components/LogosVisa';
import CartContext from '../cart/Cart';
import { useContext, useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import './style.css';
import NavBar from '../../../shared/components/NavBar/NavBar';
import Card from '../../../shared/components/Card/Card';
import { loadStripe } from '@stripe/stripe-js';
import Payment from './Payment';
import UserContext from '../../../user-store/user-context';
import axios from 'axios';
import AddressForm from './AddressForm';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Checking = () => {
  const userCtx = useContext(UserContext);
  const cartCtx = useContext(CartContext);
  const patientId = userCtx.userId;
  const [stripePromise, setStripePromise] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
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
              <div className="container" style={{ marginLeft: '50px' }}>
                <div style={{ paddingTop: '50px' }}>
                  <span
                    id="title"
                    style={{
                      color: 'white',
                      textDecoration: 'none',
                      marginLeft: '695px',
                      fontSize: '24px',
                    }}
                  >
                    Purchase Details
                  </span>
                  <AddressForm />
                  <Elements stripe={stripePromise}>
                    <Payment
                      CartCtx={cartCtx}
                      SelectedAddressId={selectedAddressId}
                    />
                  </Elements>
                </div>
              </div>
            </div>
            <div className="overlap-3">
              <br />
              <h2 className="title">ORDER SUMMARY</h2>
              <div className="carousel-container">
                <br />
                <Slider {...settings}>
                  {cartCtx.items.map((item, index) => (
                    <div key={index}>
                      <p>Item {index+1} of {cartCtx.items.length}</p>
                      <p>{item.name}</p>
                      <p>{item.price}</p>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          alignSelf: 'center',
                          width: '288px',
                          height: '301px',
                        }}
                      />
                    </div>
                  ))}
                </Slider>
                <div className="container" style={{paddingTop:'50px'}}>
                  <div>Items: {cartCtx.length}</div>
                  <div>Total: ${cartCtx.total}</div>
                </div>
              </div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Checking;
