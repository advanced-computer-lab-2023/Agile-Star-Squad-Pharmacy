import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { loadStripe } from "@stripe/stripe-js";


function Payment(props) {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch("http://localhost:3000/config");
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
        patient_id: "6521fc7bb512c918531f7e0b",
        price: props.props.total,
      };

      try {
        const response = await fetch("http://localhost:3000/create-payment-intent", {
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
  }, [props.props.total]);

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

  return (
    <>
      {clientSecret && stripePromise && (
        <Elements stripe={stripePromise} options={{ clientSecret, ...elementStyleOptions }}>
          <CheckoutForm />
        </Elements>
      )}
    </>
  );
}

export default Payment;
