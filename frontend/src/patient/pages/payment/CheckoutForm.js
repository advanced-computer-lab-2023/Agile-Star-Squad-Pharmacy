import { loadStripe } from "@stripe/stripe-js";
import { useState, useEffect } from "react";
import './CheckoutForm.css';

const CheckoutForm = (props) => {
  const [stripePromise, setStripePromise] = useState(null);

  useEffect(() => {
    setStripePromise(
      loadStripe("pk_test_51O9YaUIM4ONA4ExmSMtNdcbsS07Wi8oWFhFjG0tcyoYc6hXaliczsMz67gT3dTENgYUFhuxyqAXTMcGwrVhzctKE00CEwkiu9W") // Replace with your actual publishable key
    );
  }, []);

  useEffect(() => {
    const initializeStripeElements = async () => {
      if (!stripePromise) return;

      const stripe = await stripePromise;
      const elements = stripe.elements();

      const linkAuthElement = elements.create('linkAuthentication');
      linkAuthElement.mount('#link-auth-element');

      const addressElement = elements.create('address');
      addressElement.mount('#address-element');

      const paymentElement = elements.create('payment');
      paymentElement.mount('#payment-element');
    };

    initializeStripeElements();
  }, [stripePromise]);

  return (
    <div>
      <div id="link-auth-element"></div>
      <div id="address-element">
        
      </div>
      <div id="payment-element"></div>
    </div>
  );
};

export default CheckoutForm;
