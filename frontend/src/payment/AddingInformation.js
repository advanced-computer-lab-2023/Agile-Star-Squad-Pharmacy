import React, { useState, useEffect } from 'react';
import { Elements } from "@stripe/react-stripe-js";
import Card from '../shared/components/Card/Card'
import Payment from './Payment';
import CheckoutForm from './SubscriptionForm';
import { loadStripe } from "@stripe/stripe-js";

const DUMMY_APPOINTMENT = [
  {
    date: new Date('October 13, 2014 11:13:00'),
    doctor: '652d090d263d88f43ea92b96',
    patient: '65270df9cfa9abe7a31a4d88',
    package: '652b34379d864872c883a245',
    patientName:"ahmed",
    price : 1000
  },
];

const AddingInfo = (props) => {
  const [showItem, setShowItem] = useState(false);
  const [showDelivery, setShowDelivery] = useState(false);
  const [message, setMessage] = useState('');
  const [doctorSessionDiscount, setDoctorSessionDiscount] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [appDate, setAppDate] = useState('');
  const [packagePresent,setPackagePresent]= useState(false);
  const price =DUMMY_APPOINTMENT[0].price;

  
  // useEffect(() => {
  //   const fetchDataPackage = async () => {
      
  //       if (DUMMY_APPOINTMENT[0].package !=null){
  //         setPackagePresent(true);
  //         try {
  //       const response = await fetch(
  //         `http://localhost:3000/packages/${DUMMY_APPOINTMENT[0].package}`,
  //         // `http://localhost:3000/packages/652b34379d864872c883a245`,
  //       );
  //       if (response.ok) {
  //         const data = await response.json();

  //         setDoctorSessionDiscount(data.data.package.doctorSessionDiscount);
  //       } else {
  //         alert('Failed to fetch package data.');
  //       }
  //      }catch (error) {
  //       alert('Network error: ' + error.message);
  //     }}
  //   };

  //   fetchDataPackage();
  // }, []);
  // useEffect(() => {
  //   const fetchDataDoctor = async () => {
  //     try {
  //       const response = await fetch(
  //         `http://localhost:3000/doctors/${DUMMY_APPOINTMENT[0].doctor}`,
  //       );
  //       if (response.ok) {
  //         const data = await response.json();

  //         setDoctorName(data.data.doctor.name);
  //       } else {
  //         alert('Failed to fetch package data.');
  //       }
  //     } catch (error) {
  //       alert('Network error: ' + error.message);
  //     }
  //   };

  //   fetchDataDoctor();
  // }, []);
 

  // useEffect(() => {

  //   const query = new URLSearchParams(window.location.search);

  //   if (query.get('success')) {
  //     setMessage('Order placed! You will receive an email confirmation.');
  //   }

  //   if (query.get('canceled')) {
  //     setMessage(
  //       "Order canceled -- continue to shop around and checkout when you're ready.",
  //     );
  //   }
  // }, []);
  // // setAppDate(DUMMY_APPOINTMENT[0].date.toUTCString())
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const data={
    patient_id:"83274894793827847384783",
    price :1000
}
  useEffect(() => {
    fetch("http://localhost:3000/config").then(async (r) => {
      const { publishableKey } = await r.json();
      setStripePromise(loadStripe(publishableKey));
    });
  }, []);

  useEffect(() => {
    fetch("http://localhost:3000/create-payment-intent", {
      method: "POST",
      body: JSON.stringify(data),
    }).then(async (result) => {
      const { clientSecret } = await result.json();
      setClientSecret(clientSecret);
    });
  }, []);

  return (
    //
    <div className="container">
     
      <br />
      <br />
      <div className="row  justify-content-evenly gx-5">
        <div className="col card1">
          <Card>
          <Elements stripe={ stripePromise} options={{ clientSecret}}>
            <CheckoutForm/>
            </Elements>
          </Card>
        </div>
        <div className="col" id="card2">
          <Card>
            
          </Card>
        </div>
      </div>
    </div>
  );
};
export default AddingInfo;
