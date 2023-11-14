import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Select from "react-select"
import classes from './requestsStyle.module.css';
import doctorImage from './051_Doctor 1.png';
import tick from './Medicine.png';
import logo from './PHARMA.png';
import { DUMMY_USER } from '../shared/DummyUsers';
import { useNavigate } from 'react-router-dom';


const AcceptedRequest = (props) => {
  const [isButtonPressed, setButtonPressed1] = useState(false);
  const [isButtonPressed2, setButtonPressed2] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);
  const [timeSlots, setTimeSlots] = useState([{ label: "Empty Slot" }]);

  const doctorId = DUMMY_USER._id;
  const handleButtonClick1 = () => {
    setButtonPressed1(true);
  }
  const navigate = useNavigate();

  const handleButtonClick2 = () => {
    setButtonPressed2(true);
    navigate('/pharmacy/home');

  }
  const handleButtonLogout = () => {
    navigate('/');

  }
  const slotSelectStyle = isButtonPressed2 ? classes.slotSelectStyle : "";

  const getDay = (day) => {
    switch (day) {
      case 0:
        return "Sunday"
      case 1:
        return "Monday"
      case 2:
        return "Tuesday"
      case 3:
        return "Wednesday"
      case 4:
        return "Thursday"
      case 5:
        return "Friday"
      case 6:
        return "Saturday"
      default:
        break;
    }
  }

  const timeOptions = [
    { value: "00:00", label: "12:00 AM" },
    { value: "01:00", label: "1:00 AM" },
    { value: "02:00", label: "2:00 AM" },
    { value: "03:00", label: "3:00 AM" },
    { value: "04:00", label: "4:00 AM" },
    { value: "05:00", label: "5:00 AM" },
    { value: "06:00", label: "6:00 AM" },
    { value: "07:00", label: "7:00 AM" },
    { value: "08:00", label: "8:00 AM" },
    { value: "09:00", label: "9:00 AM" },
    { value: "10:00", label: "10:00 AM" },
    { value: "11:00", label: "11:00 AM" },
    { value: "12:00", label: "12:00 PM" },
    { value: "13:00", label: "1:00 PM" },
    { value: "14:00", label: "2:00 PM" },
    { value: "15:00", label: "3:00 PM" },
    { value: "16:00", label: "4:00 PM" },
    { value: "17:00", label: "5:00 PM" },
    { value: "18:00", label: "6:00 PM" },
    { value: "19:00", label: "7:00 PM" },
    { value: "20:00", label: "8:00 PM" },
    { value: "21:00", label: "9:00 PM" },
    { value: "22:00", label: "10:00 PM" },
    { value: "23:00", label: "11:00 PM" },
  ];

  const handleTimeSlotAdd = () => {
    setTimeSlots(prevValue => {
      const newSlot = {
        day: selectedDay,
        from: fromTime.value,
        to: toTime.value,
        label: `${getDay(selectedDay).slice(0, 3)} ${fromTime.label} - ${toTime.label}`
      }
      prevValue[prevValue.length - 1] = newSlot;
      return [...prevValue, { label: "Empty Slot" }]
    });
  }

  const removeSlot = (removedSlot) => {
    setTimeSlots(prevValue => {
      const newSlots = prevValue.filter(slot => slot != removedSlot);
      return newSlots;
    })
  }

  const [fromTime, setFromTime] = useState(timeOptions[10]);
  const [toTime, setToTime] = useState(timeOptions[11]);

  const handleFromTimeSet = (option) => {
    if (option.value >= toTime.value) {
      const adjustedToTime = timeOptions[timeOptions.indexOf(option) + 1];
      setToTime(adjustedToTime);
    }
    setFromTime(option);
  }

  const handleToTimeSet = (option) => {
    if (option.value <= fromTime.value) {
      const adjustedFromTime = timeOptions[timeOptions.indexOf(option) - 1];
      setFromTime(adjustedFromTime);
    }
    setToTime(option);
  }

  const onSubmitSlots = () => {
    const allSlots = [];
    timeSlots.forEach(slot => {
      if (slot.day == null) return;
      const exists = allSlots.some(existingSlot => {
        return existingSlot.day === slot.day && existingSlot.from === slot.from && existingSlot.to === slot.to;
      })
      if (!exists) {
        allSlots.push(slot)
      }
    });

    const finalResults = [[], [], [], [], [], [], []];
    allSlots.forEach(slot => {
      finalResults[slot.day].push({ from: slot.from, to: slot.to });
    });
    
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
      body: JSON.stringify({timeSlots: finalResults}),
    };

    fetch(`http://localhost:3000/doctors/${doctorId}/timeSlots`, requestOptions)
  }

  return (

    <body className={classes.background}>
      <div className='d-flex'>
        <div className={`${classes.mainBackground} col-5`}>
          <div className={classes.logo}>
            <img src={logo} alt="Clinic Logo" />
          </div>
          <img src={doctorImage} alt="Doctor Image" className={classes.doctorImage} />
        </div>

        <div className={`${classes.secondBackground} col-7`}>
          {
            <div className={`${classes.customText} ${slotSelectStyle}`}>
              {!isButtonPressed && (
                <>
                  <p className={classes.p1}>ACCESS REQUEST APPROVED</p>
                  <p className={classes.p2}>Access Authorized</p>
                  <img src={tick} alt="BIG TICK" />
                  <div>
                    <button className={classes.button} onClick={handleButtonClick1}>NEXT</button>
                  </div>
                </>
              )}
              {isButtonPressed && (
                <>
                  {!isButtonPressed2 && (
                    <>
                      <div className={classes.terms}>Employment Contract</div>
                      <div className={classes.agreement}>Your agreement</div>
                      <div className={`${classes.container} text-start`}>Last Revised: November 14, 2023<br/>
                      By registering as a pharmacist on our virtual pharmacy platform, you agree to adhere to the following terms and conditions:
<br/><br/>
1.Eligibility and Registration Approval:
<br/>
You must hold a valid medical license and meet the eligibility criteria specified by the relevant medical authorities.
Your registration request will be subject to review by our administrative team, who reserves the right to accept or reject your application based on your credentials, specialty, medical background, and other relevant factors.
<br/><br/>
2.Professional Conduct:
<br/>
As a registered doctor, you agree to uphold the highest standards of professional conduct and ethical behavior.
You will provide medical advice and services within the scope of your expertise and in compliance with all applicable laws and regulations.
<br/><br/>
3. Availability and Appointment Scheduling:
<br/>
You commit to maintaining accurate availability information on the platform and ensuring that you are available during the times you designate for appointments.
Patients may book video appointments with you through the platform, and you agree to conduct these appointments in a timely and professional manner.
<br/><br/>
4. Follow-up Appointments:
<br/>
You may schedule follow-up appointments with patients as necessary for continued care. The platform will facilitate these appointments, and you agree to honor scheduled follow-ups as per the patient's needs.
<br/><br/>
5. Fees and Payments:
<br/>
The platform will add a 10% service fee on top of the rate you set for each appointment. You agree to this fee structure.
Payments for your services will be processed by the platform, and you will receive your earnings, minus the service fee, in a timely manner.
<br/><br/>
6. Confidentiality:
<br/>
You must maintain the confidentiality of patient information in accordance with applicable privacy laws and regulations.
Any patient-related information obtained through the platform must be used solely for the purpose of providing medical services and must not be disclosed or used for any other purpose.
<br/><br/>
7. Termination of Registration:
<br/>
The platform reserves the right to terminate your registration at any time if you violate these terms and conditions, engage in unprofessional conduct, or for any other reason deemed appropriate by the administrative team.
<br/><br/>
8. Updates and Communication:
<br/>
You agree to receive communications from the platform, including updates, announcements, and other relevant information.
It is your responsibility to keep your contact information up to date on the platform.
<br/><br/>
9. Indemnification:
<br/>
You agree to indemnify and hold harmless the virtual clinic platform, its administrators, and affiliates from any claims, losses, or damages arising out of your use of the platform or your provision of medical services.
<br/><br/>
10. Changes to Terms and Conditions:
<br/>
The platform reserves the right to update these terms and conditions at any time. You will be notified of any changes, and continued use of the platform constitutes acceptance of the revised terms.
By registering as a doctor on our virtual clinic platform, you acknowledge that you have read, understood, and agreed to these terms and conditions. Failure to comply with these terms may result in the termination of your registration and access to the platform.
                      </div>
                      <div className={classes.buttonsDiv}>
                        <button className={classes.cancelButton} onClick={handleButtonLogout} >Logout</button>
                        <button className={classes.agreeButton} onClick={handleButtonClick2}>Agree</button>
                      </div>
                    </>
                  )}
                  
                </>
              )}
            </div>


          }

        </div>
      </div>
    </body>







  )
}
export default AcceptedRequest;


const customStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: 'white',
    border: 'none',
    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.09)",
    borderRadius: "17px",
    textAlign: 'start'
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: "#193842"
  }),
  indicatorSeparator: () => ({}),
  menu: (provided) => ({
    ...provided,
    borderRadius: '20px',
  }),
  option: (provided, state) => ({
    ...provided,
    borderRadius: '14px',
    fontSize: '14px',
    fontWeight: state.isFocused ? "500" : "400",
    color: state.isFocused ? "black" : "#666666",
    textAlign: "left",
    backgroundColor: "transparent"
  }),
  singleValue: (provided) => ({
    ...provided,
    fontSize: '12px',
    fontWeight: "600",
    color: "#193842"
  }),
  valueContainer: (provided) => ({
    ...provided,
    backgroundColor: "transparent"
  }),
  menuList: (base) => ({
    ...base,

    "::-webkit-scrollbar": {
      width: "3px",
      height: "0px",
    },
    "::-webkit-scrollbar-track": {
      background: "transparent"
    },
    "::-webkit-scrollbar-thumb": {
      background: "#888",
      borderRadius: '3px',
    },
    "::-webkit-scrollbar-thumb:hover": {
      background: "#555"
    }
  })
};