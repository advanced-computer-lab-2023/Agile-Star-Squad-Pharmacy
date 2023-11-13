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

  const handleChangeEmail = (e) => {
    
  };

  const handleEmailCancel = () => {
    navigate('/');
  };

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

          <div className="col-md-7" id={styles.rightCol}>
            <div className={styles.titleResetPass}>
              <p>
                <strong>Forgot Password</strong>
              </p>
            </div>
            <div className={styles.p1}>
              <p>
                <strong>
                  You will receive an email with a link to reset your password.
                  Please check your inbox.
                </strong>
              </p>
            </div>
            <Button
              style={{ width: '300px', height: '40.541px', marginBottom:"-40px" }}
              onClick={handleChangeEmail}
              name="Change email ID"
            />
            <Button
              style={{ width: '300px', height: '40.541px' }}
              onClick={handleEmailCancel}
              name="Resend verification code"
            />
          </div>
        </div>
      </div>
    </body>
  );
};

export default ResetPassword;
