import React from 'react';
import CartContext from '../cart/Cart';
import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import styles from './style.module.css';
import NavBar from '../../../shared/components/NavBar/NavBar';
import Card from '../../../shared/components/Card/Card';
import { loadStripe } from '@stripe/stripe-js';
import Payment from './Payment';
import UserContext from '../../../user-store/user-context';
import axios from 'axios';
import './AddingInfo.css';
import arrow from '../cart/ArrowLeft.png';
import arrowR from '../cart/ArrowRight.png';
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
    prevArrow: (
      <div>
        <img src={arrow} alt="Left Arrow" />
      </div>
    ),
    nextArrow: (
      <div>
        <img src={arrowR} alt="Right Arrow" />
      </div>
    ),
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
  const navigate = useNavigate();

  const toPrevious = () => {
    navigate(-1);
  };
  const appearance = {
    theme: 'stripe',

    variables: {
      colorPrimary: '#0570de',
      colorBackground: 'rgba',
      colorText: 'black',
      colorDanger: '#df1b41',
      fontFamily: 'Poppins',
      spacingUnit: '2px',
      borderRadius: '4px',
      fontLineHeight: 'normal',
      spacingUnit: '5px',
      colorTextPlaceholder: 'rgba(255, 255, 255, 0.7)',
    },

    rules: {
      '.DropdownItem --highlight': {
        backgroundColor: 'black',
      },
      '.Input': {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderBottomColor: 'black',
        borderBottomWidth: '2px',
        borderTopWidth: '0px',
        borderLeftWidth: '0px',
        borderRightWidth: '0px',
        boxShadow: 'none',
        width: 'larger',
        color: 'white',
        outline: 'black',
        height: '32px',
        padding: '9px',
        fontSize: '12px',
      },

      '.Label': {
        textTransform: 'uppercase',
        color: 'black',
        fontFamily: 'Poppins',
        fontSize: '16px',
        fontWeight: '400',
        lineHeight: 'normal',
      },

      // See all supported class names and selector syntax below
    },
  };
  return (
    <div>
      <NavBar />
      <div className={styles.checkout}>
        <div className={styles.div}>
          <div className={styles.overlapGroup}>
            <div className={styles.overlap2}>
              <div className="container" style={{ marginLeft: '50px' }}>
                <div style={{ paddingTop: '50px' }}>
                  <span
                    className={styles.title}
                    style={{
                      color: 'white',
                      textDecoration: 'none',
                      marginLeft: '695px',
                      fontSize: '24px',
                    }}
                  >
                    Purchase Details
                  </span>

                  {/* <AddressForm /> */}

                  <Elements stripe={stripePromise}>
                    <Payment
                      CartCtx={cartCtx}
                      SelectedAddressId={selectedAddressId}
                    />
                  </Elements>
                </div>
              </div>
            </div>
            <div className={styles.overlap3}>
              <div
                className={styles.backarrow}
                style={{ marginBottom: '20px' }}
              >
                <img src={arrow} style={{ width: '20px', height: 'auto' }} />
                <button className={styles.back} onClick={toPrevious}>
                  {' '}
                  Back
                </button>
              </div>

              <br />
              <h2 className={styles.title}>ORDER SUMMARY</h2>
              <div className="carousel-container">
                <br />
                <Slider {...settings}>
                  {cartCtx.items.map((item, index) => (
                    <div key={index}>
                      <p className={styles.indexCartItem}>
                        Item {index + 1} of {cartCtx.items.length}
                      </p>
                      <p className={styles.nameCartItem}>{item.name}</p>
                      <p className={styles.priceCartItem}>${item.price}</p>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          alignSelf: 'center',
                          width: '338px',
                          height: '201px',
                        }}
                      />
                    </div>
                  ))}
                </Slider>
                <div className="container" id="totalss">
                  Total: ${cartCtx.total}
                  {/* ///need to add package stuff */}
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
