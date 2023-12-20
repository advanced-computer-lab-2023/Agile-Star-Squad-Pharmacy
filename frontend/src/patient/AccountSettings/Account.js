import React, { useState, useEffect, useContext } from 'react';
import storage from '../../index';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import 'react-calendar/dist/Calendar.css';
import NavBar from '../../shared/components/NavBar/NavBar';
import UserContext from '../../user-store/user-context';
import { useNavigate } from 'react-router-dom';
import classes from './Account.module.css';
import patient1 from '../../assets/patientAccount/patient1.png';
import globeImg from '../../assets/patientAccount/globe.png';
import familyImg from '../../assets/patientAccount/family.png';
import medicalImg from '../../assets/patientAccount/medical.png';
import paymentImg from '../../assets/patientAccount/payment.png';
import appointmentsImg from '../../assets/patientAccount/appointments.png';
import notificationImg from '../../assets/patientAccount/notification.png';
import aboutImg from '../../assets/patientAccount/about.png';
import contactImg from '../../assets/patientAccount/contact.png';
import inviteImg from '../../assets/patientAccount/invite.png';
import logoutImg from '../../assets/patientAccount/logout.png';
import chevronRight from '../../assets/patientAccount/chevronRight.png';
import PaymentCard from './PaymentCard';
import MedicalCard from './MedicalCard';
import AboutUs from './AboutUs'
import ShippmentCard from './ShippmentCard';
import AccountDetailsCard from './AccountDetailsCard';
import { toastMeError } from '../../shared/util/functions';

const PatientAccountSettings = (props) => {
  const patient = useContext(UserContext);
  const navigate = useNavigate();
  const [healthPackage, setPackage] = useState(null);
  const [medicalRecordUrls, setMedicalRecords] = useState(null);
  const [isButtonPressed, setButtonPressed] = useState(false);
  const [healthRecord, setHealthRecord] = useState('');
  const [subscriptionDate, setsubscriptionDate] = useState(Date.now());
  const [expiringDate, setexpiringDate] = useState(Date.now());
  const [cancellationDate, setcancellationDate] = useState(Date.now());
  const [currentPatient, setCurrentPatient] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [index, setIndex] = useState(null);

  // useEffect(() => {
  //   fetchAppointments();
  //   fetchFamilyMembers();
  // }, []);

  const onHealthRecordChange = (file) => {
    setHealthRecord(file.target.files[0]);
  };

  // const fetchAppointments = () => {
  //   fetch(`http://localhost:3000/patients/${patient.userId}/appointments`, {
  //     credentials: 'include',
  //   }).then(async (response) => {
  //     const json = await response.json();
  //     const appointmentsJson = json.data.appointments;
  //     setAppointments(
  //       appointmentsJson.map((appointment) => {
  //         return {
  //           id: appointment['_id'],
  //           ...appointment,
  //         };
  //       }),
  //     );
  //   });
  // };

  // const fetchFamilyMembers = () => {
  //   fetch(`http://localhost:3000/patients/${patient.userId}/familyMembers`, {
  //     credentials: 'include',
  //   }).then(async (response) => {
  //     const json = await response.json();
  //     const familyMembersJson = json.data.members;
  //     setFamilyMembers(
  //       familyMembersJson.map((member) => {
  //         return {
  //           _id: member['_id'],
  //           ...member,
  //         };
  //       }),
  //     );
  //   });
  // };

  const fetchPackage = async () => {
    fetch(`http://localhost:4000/patients/${patient.userId}`, {
      credentials: 'include',
    }).then(async (response) => {
      const json = await response.json();
      console.log(json.data);
     
      setCurrentPatient(json.data.patient);
      setcancellationDate(json.data.patient.creationDate);
    });
  };

  const handeleUnsubscribeButtonclick = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/patients/${patient.userId}/package`,
        {
          method: 'PATCH',
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        },
      );
      console.log(response);
      if (response.ok) {
        setButtonPressed(true);
        setPackage(null);
        setcancellationDate(JSON.stringify(new Date()));
      } else {
        console.error(
          'Failed to remove health package. Status:',
          response.status,
        );
        const responseBody = await response.json();
        console.error('Response body:', responseBody);
      }
    } catch (error) {
      console.error('Error removing health package:', error);
    }
  };
  const handleHealthRecordUpload = async () => {
    let healthRecordUrl;
    if (healthRecord !== '') {
      const healthRecordRef = ref(storage, `${healthRecord.name}`);
      await uploadBytesResumable(healthRecordRef, healthRecord).then(
        async (snapshot) => {
          healthRecordUrl = await getDownloadURL(snapshot.ref);
        },
      );
    }
    setMedicalRecords((records) => {
      return [...records, healthRecordUrl];
    });
    // const formData = new FormData();
    // formData.append('medicalRecord', healthRecordUrl);
    const data = {
      medicalRecord: healthRecordUrl,
    };

    try {
      console.log(healthRecordUrl);
      const requestOptions = {
        method: 'PATCH',
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
        body: JSON.stringify(data),
      };
      console.log(requestOptions.body);
      console.log(requestOptions);

      const response = await fetch(
        `http://localhost:3000/patients/${patient.userId}`,
        requestOptions,
      );
      console.log(response);
      if (!response.ok) {
        //alert('Failed to upload health record');
        toastMeError(`Failed to upload health record`);
      }
    } catch (error) {
      console.error('Error uploading health record:', error);
    }
  };

  useEffect(() => {
    fetchPackage();
  }, []);

  const deleteImage = (e, url) => {
    e.preventDefault();

    setMedicalRecords((records) => {
      const newRecords = records.filter((record) => record != url);
      const requestOptions = {
        method: 'PATCH',
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({ medicalRecord: newRecords }),
      };

      fetch(
        `http://localhost:3000/patients/${patient.userId}/setHealthRecords`,
        requestOptions,
      );
      return newRecords;
    });
  };

  const logout = async () => {
    await patient.logout();
    navigate('/');
  };
  useEffect(()=>{
    if(index==9){
      logout();
    }
    if(index === 6){

    }
  },[index])

  const changePasswordHandler = () => {
    navigate('/changePassword');
  };

  const familyMembersHandler = () => {
    navigate('/patient/family');
  };

 

  const { healthRecordInput } = healthRecord;
  return (
    <body className={classes.pageWrapper}>
      <NavBar />
      <Greeting
        name={currentPatient.name}
        imageUrl={patient1}
        joinedDate={currentPatient.creationDate}
      />
      <SettingsContainer title={'Settings'}>
        <SettingsTile
          onClick={() => setIndex(0)}
          title={'Account Details'}
          imagePath={globeImg}
        />
        {/* <SettingsTile
          onClick={() => setIndex(1)}
          title={'My Family'}
          imagePath={familyImg}
        />
        <SettingsTile
          onClick={() => setIndex(2)}
          title={'Medical Documents'}
          imagePath={medicalImg}
        /> */}
        <SettingsTile
          onClick={() => setIndex(3)}
          title={'Payment Details'}
          imagePath={paymentImg}
        />
        <SettingsTile
          onClick={() => setIndex(4)}
          title={'Shippment Details'}
          imagePath={paymentImg}
        />
      </SettingsContainer>
      <SettingsContainer title={'Account'}>
        {/* <SettingsTile
          onClick={() => setIndex(4)}
          title={'Appointments'}
          imagePath={appointmentsImg}
        /> */}
        <SettingsTile
          onClick={() => setIndex(5)}
          title={'Email Notifications'}
          imagePath={notificationImg}
        />
      </SettingsContainer>
      <SettingsContainer title={'Other'}>
        <SettingsTile
          onClick={() => setIndex(6)}
          title={'About Us'}
          imagePath={aboutImg}
        />
        <SettingsTile
          onClick={() => setIndex(7)}
          title={'Contact Us'}
          imagePath={contactImg}
        />
        <SettingsTile
          onClick={() => setIndex(8)}
          title={'Invite Your Friends'}
          imagePath={inviteImg}
        />
        <SettingsTile
          onClick={() => setIndex(9)}
          title={'Logout'}
          imagePath={logoutImg}
        />
      </SettingsContainer>
      {/* {index == 1 && <FamilyCard members={familyMembers} setMembers={setFamilyMembers} />} */}
      {index == 0 && <AccountDetailsCard />}
      {index == 2 && <MedicalCard />}
      {index == 3 && <PaymentCard />}
      {index == 4 && <ShippmentCard />}
      {index == 6 && <AboutUs></AboutUs>}
    </body>
  );
};
export default PatientAccountSettings;

const SettingsContainer = (props) => {
  return (
    <div className={classes.settingsContainer}>
      <div className={classes.settingsTitle}>{props.title}</div>
      {props.children}
    </div>
  );
};

const SettingsTile = (props) => {
  return (
    <div onClick={props.onClick} className={classes.settingsTile}>
      <img className={classes.tileIcon} active src={props.imagePath} />
      <span>{props.title}</span>
      <img src={chevronRight} />
    </div>
  );
};

const Greeting = (props) => {
  let name = `${props.name}`;
  name = name.toUpperCase();
  let joinedDate = new Date(props.joinedDate);
  joinedDate = `${joinedDate.getDate()}/${joinedDate.getMonth() + 1
    }/${joinedDate.getFullYear()}`;
  return (
    <div className={classes.greetingContainer}>
      <img src={props.imageUrl} />
      <div>
        <h1 className={classes.name}>{name}</h1>
        <div className={classes.subtitle}>
          Joined since <nbsp />
          <span style={{ color: '#232323' }}>{joinedDate}</span>
        </div>
      </div>
    </div>
  );
};

export const SideCard = (props) => {
  return <div className={classes.sideCard}>{props.children}</div>;
};
