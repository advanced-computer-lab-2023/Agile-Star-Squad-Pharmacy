import React, { useState, useEffect, useContext } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import { loadStripe } from '@stripe/stripe-js';
import UserContext from '../../../user-store/user-context';

function Payment(props) {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const userCtx = useContext(UserContext);
  const cartCtx = props.CartCtx;
  const addressInfo = props.SelectedAddressId;

  // const [address, setAddress] = useState([]);

  // setAddresses(address);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('http://localhost:4000/config');
        const configData = await response.json();
        console.log('Config Data:', configData); // Add this line
        const { publishableKey } = configData;
        setStripePromise(loadStripe(publishableKey));
      } catch (error) {
        console.error('Error fetching config:', error);
      }
    };

    fetchConfig();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const data = {
        patient_id: userCtx.userId,
        price: cartCtx.total, // Change this line
      };

      try {
        console.log(data);
        const response = await fetch(
          'http://localhost:4000/create-payment-intent',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          }
        );

        const { clientSecret } = await response.json();
        setClientSecret(clientSecret);
      } catch (error) {
        console.error('Error creating payment intent:', error);
      }
    };

    fetchData();
  }, [cartCtx.total]);

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
      '.DropdownItem --highlight':{
        backgroundColor:'black'
      },
      '.Input': {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderBottomColor: 'black',
        borderBottomWidth: '2px',
        borderTopWidth: '0px',
        borderLeftWidth: '0px',
        borderRightWidth: '0px',
        boxShadow:'none',
        width:'larger',
        color:'white',
        outline:'black',
        height: '32px',
        padding :'9px',
        fontSize:'12px',
        
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

  // console.log("kkkkkk",userCtx.userId);
  // console.log("pppppp",props.CartCtx.total);
  return (
    <>
      {clientSecret && stripePromise && (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance,
            fonts: [
              {
                // integrate your font into stripe
                cssSrc:
                  'https://fonts.googleapis.com/css2?family=Manrope:wght@200;400;700&family=Maven+Pro:wght@600&family=Poppins:wght@100;300;400;600;700&family=Roboto:wght@500&family=Yeseva+One&display=swap',
              },
            ],
          }}
        >
          <CheckoutForm
            CartCtx={cartCtx}
            addressInfo={props.SelectedAddressId}
          />
        
        </Elements>
      )}
    </>
  );
}

export default Payment;
