import { PaymentElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import './CheckoutForm.css'

export default function CheckoutForm(props) {
  const stripe = useStripe();
  const elements = useElements();
  let navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [useWallet, setUseWallet] = useState(false);
  const fetchUserBalance= async()=>{
    
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsProcessing(true);
  
      try{
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
       
        return_url: navigate(-1),
      },
    });
    
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
        
        let paymentIntentData = {
          
          doctor: props.doctorId,
          patient: props.patientId,
          dateOfAppointment: props.appDate,
          status: 'reserved'
        };
        
        // Send data to the backend
        const response = await fetch('http://localhost:3000/doctors/appointments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(paymentIntentData),
        });

        if (!response.ok) {
          throw new Error('Failed to send data to the server.');
        }
        
        setMessage('Payment successful!');
      }
    } catch (error) {
      setMessage('Failed to process payment.');
    }
    setIsProcessing(false);
    
  };
  const handleWallet=async(e)=>{
    e.preventDefault();
    setIsProcessing(true);
    const response = await fetch(`http://localhost:3000/patients/${props.patientId}`)
const responseData=await response.json()
    const currentWallet =responseData.data.patient.wallet
    
    const deduct= props.price * -1
    if (currentWallet+deduct >= 0){
      try{
        const response = await fetch(
                `http://localhost:3000/patients/${props.patientId}/wallet`,
                
                {
                  method: 'POST', 
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({walletAmount : deduct}),
                }
              );
        
              if (response.ok) {
                // Handle a successful response
                setMessage("Payment successful via wallet!");
                alert("Payment successful via wallet!")
                navigate(-1);
              } else {
                // Handle errors if the server response is not ok
                alert('Failed to update data.');
              }
            } catch (error) {
              // Handle network errors
              alert('Network error: ' + error.message);
            }
      

    }
    else{
      setMessage("Insufficient balance in your wallet.");
    }

    
    setIsProcessing(false)
  
  }
  const handleCancel = () => {
    
    navigate(-1);
  };
  return (
    <form id="payment-form" onSubmit={!useWallet?handleSubmit:handleWallet}>
       <input
        type="checkbox"
        id="use-wallet"
        checked={useWallet}
        onChange={(e) => setUseWallet(e.target.checked)}
      />
      <label htmlFor="use-wallet">Pay with Wallet</label>
      <div>{!useWallet &&
      <PaymentElement id="payment-element"  />}
      </div>
      <button disabled={isProcessing || !stripe || !elements} id="submit">
        <span id="button-text">
          {isProcessing ? "Processing ... " : "Pay now"}
        </span>
      </button>
      <button onClick={handleCancel}>Cancel</button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}
