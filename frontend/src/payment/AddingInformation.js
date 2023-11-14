import React, { useState, useEffect } from 'react';
import Card from '../shared/components/Card/Card'
import Payment from '../components/payment/Payment';
import CartContext, { CartContextProvider } from '../../patient/pages/cart/Cart';
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
  const cartCtx = useContext(CartContext);
  
  useEffect(() => {
    const fetchDataPackage = async () => {
      
        if (DUMMY_APPOINTMENT[0].package !=null){
          setPackagePresent(true);
          try {
        const response = await fetch(
          `http://localhost:3000/packages/${DUMMY_APPOINTMENT[0].package}`,
          // `http://localhost:3000/packages/652b34379d864872c883a245`,
        );
        if (response.ok) {
          const data = await response.json();

          setDoctorSessionDiscount(data.data.package.doctorSessionDiscount);
        } else {
          alert('Failed to fetch package data.');
        }
       }catch (error) {
        alert('Network error: ' + error.message);
      }}
    };

    fetchDataPackage();
  }, []);
  useEffect(() => {
    const fetchDataDoctor = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/doctors/${DUMMY_APPOINTMENT[0].doctor}`,
        );
        if (response.ok) {
          const data = await response.json();

          setDoctorName(data.data.doctor.name);
        } else {
          alert('Failed to fetch package data.');
        }
      } catch (error) {
        alert('Network error: ' + error.message);
      }
    };

    fetchDataDoctor();
  }, []);
 

  useEffect(() => {

    const query = new URLSearchParams(window.location.search);

    if (query.get('success')) {
      setMessage('Order placed! You will receive an email confirmation.');
    }

    if (query.get('canceled')) {
      setMessage(
        "Order canceled -- continue to shop around and checkout when you're ready.",
      );
    }
  }, []);
  // setAppDate(DUMMY_APPOINTMENT[0].date.toUTCString())
  return (
    //
    <div className="container">
      <NavBar />
      <br />
      <br />
      <div className="row  justify-content-evenly gx-5">
        <div className="col card1">
          <Card>
            <Payment  props={DUMMY_APPOINTMENT}/>
          </Card>
        </div>
        <div className="col" id="card2">
          <Card>
            <Cart></Cart>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default AddingInfo;
