import React, { useState, useEffect, useContext} from "react";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { loadStripe } from "@stripe/stripe-js";
import UserContext from '../../../user-store/user-context';

function Payment(props) {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const userCtx = useContext(UserContext);
  const cartCtx= props.CartCtx;

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch("http://localhost:4000/config");
        const { publishableKey } = await response.json();
        setStripePromise(loadStripe(publishableKey));
      } catch (error) {
        console.error("Error fetching config:", error);
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
        const response = await fetch("http://localhost:4000/create-payment-intent", {
          method: "POST",
          body: JSON.stringify(data),
        });

        const { clientSecret } = await response.json();
        setClientSecret(clientSecret);
      } catch (error) {
        console.error("Error creating payment intent:", error);
      }
    };

    fetchData();
  }, [props.CartCtx.total]);

  const elementStyleOptions = {
    base: {
      fontSize: "40px",
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  };
  // console.log("kkkkkk",userCtx.userId);
  // console.log("pppppp",props.CartCtx.total);
  return (
    <>
      {clientSecret && stripePromise && (
        <Elements stripe={stripePromise} options={{ clientSecret, ...elementStyleOptions }}>
          <CheckoutForm CartCtx={cartCtx} />
        </Elements>
      )}
    </>
  );
}

export default Payment;
