import { PaymentElement } from "@stripe/react-stripe-js";
import { useState , useContext } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import './CheckoutForm.css'
import UserContext from '../../../user-store/user-context';
import CartContext from "../cart/Cart";

export default function CheckoutForm(props) {
  const userCtx = useContext(UserContext);
  const stripe = useStripe();
  const elements = useElements();
  let navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [useWallet, setUseWallet] = useState(false);
  
  // const fetchUserBalance= async()=>{
    
  // }
  let paymentIntentData = {
    patient: userCtx.userId,
    medicineList: props.CartCtx.items,
    totalCost: props.CartCtx.total,
   
  };
   console.log(paymentIntentData)

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
    // const { error } = await stripe.confirmPayment({
    //   elements,
    //   confirmParams: {
       
    //      return_url: 'http://localhost:3000/order',
    //   },
    // });
    
    // if (error.type === "card_error" || error.type === "validation_error") {
    //   setMessage(error.message);
    // } else {
      console.log("//////////////////////////")
      console.log(props.CartCtx.items)
        const medicineList=props.CartContext.items.map((item)=>{
          return{medicineId:item.id,count:item.quantity}
        })
        let paymentIntentData = {
          patientId: userCtx.userId,
          medicineList: medicineList,
          totalCost: props.CartCtx.total,
         
        };
        console.log(medicineList)
       
       
        const response = await fetch('http://localhost:4000/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(paymentIntentData),
        }).catch( (err)=>{console.log(err);
        alert("       ")});
       
        if (!response.ok) {
          throw new Error('Failed to send data to the server.');
        }
        
        setMessage('Payment successful!');
      }
    // }
     catch (error) {
      setMessage('Failed to process payment.');
    }
    setIsProcessing(false);
    
  };
 
  const handleWallet=async(e)=>{
    e.preventDefault();
    setIsProcessing(true);
    const response = await fetch(`http://localhost:4000/patients/${userCtx.userID}`)
const responseData=await response.json()
    const currentWallet =responseData.data.patient.wallet
    
    const deduct= props.price * -1

    
    if (currentWallet+deduct >= 0){
      try{
        const response = await fetch(
                `http://localhost:4000/patients/${userCtx.userID}/wallet`,
                
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