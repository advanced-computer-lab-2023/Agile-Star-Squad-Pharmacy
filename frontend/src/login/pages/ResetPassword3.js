import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../components/login.module.css';
import logo from '../images/logo.svg';
import img from '../images/Bandage.png';
import InputField from '../components/InputField/InputField';
import Button from '../components/Button/Button';


const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
  
    const handleResendVerification = (e) => {
      
    };
  
    const handleVerificationCancel = () => {
      navigate('/');
    };
  
    return (
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-5">
              <div className={styles.logo}>
                <img src={logo} alt="logo" />
              </div>
              <img className={styles.bandage} src={img} alt="login" />
            </div>
  
            <div className="col-md-7" id={styles.rightCol}>
              <div className={styles.titleResetPass}>
                <p>
                  <strong>Link Expired</strong>
                </p>
              </div>
              <div className={styles.p2}>
                <p>
                  <strong>
                  Your link has expired, because you haven't used it. Reset password link expires in every 24 hours and can be used only once. You can create one by clicking the button below.

                  </strong>
                </p>
              </div>
              <Button
              style={{ width: '400px', height: '40.541px' }}
              onClick={handleResendVerification}
              name="Request reset password link"
            />
            <Button
              style={{
                backgroundColor: 'white',
                color: '#193842',
                borderStyle: 'none',
              }}
              onClick={handleVerificationCancel}
              name="Cancel"
            />
            </div>
          </div>
        </div>
    );
  };
  
  export default ResetPassword;