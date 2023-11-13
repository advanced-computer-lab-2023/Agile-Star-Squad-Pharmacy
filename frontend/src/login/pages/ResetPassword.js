import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../components/login.module.css';
import logo from '../images/logo.svg';
import img from '../images/Bandage.png';
import Component0 from '../components/Component0';
import Component1 from '../components/Component1';
import Component2 from '../components/Component2';
import Component3 from '../components/Component3';

const ResetPassword = () => {
  const [tab, setTab] = useState(false);
  const [tab2, setTab2] = useState(false);
  const [tab3, setTab3] = useState(false);
  const [email , setEmail] = useState('');

  return (
    <body>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-5">
            <div className={styles.logo}>
              <img src={logo} alt="logo" />
            </div>
            <img className={styles.bandage} src={img} alt="login" />
          </div>
          {!tab && (<Component0 setTab={setTab} setEmail2={setEmail} />)}
          {tab && (!tab2 && (<Component1 setTab2={setTab2} email={email}/>)) }
          {tab2 && (!tab3 && (<Component2 setTab3={setTab3} email={email}/>))}
          {tab3 && (<Component3/>)}
          
        </div>
      </div>
    </body>
  );
  };

export default ResetPassword;
