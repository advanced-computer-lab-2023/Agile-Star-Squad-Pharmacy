import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './login.module.css';
import InputField from './InputField/InputField';
import Button from './Button/Button';
import OTP from './OTP/OTP';
import axios from 'axios';
import { Link } from 'react-router-dom';

let otpBackend = 0;

function Component1({ setTab2, email }) {
  const [otp, setOtp] = useState('');

  const handleVerifyCode = async (e) => {
    const response = await axios
      .get('http://localhost:4000/auth/resetPassword')
      .then((res) => {
        otpBackend = res.data.code;
        if (otpBackend == otp) {
          setTab2(true);
        } else {
          return alert('Incorrect OTP');
        }
      });
  };

  const handleOTPChange = (otpValue) => {
    setOtp(otpValue);
  };

  const handleResendCode = async (e) => {
    const response = await axios
      .post(`http://localhost:4000/auth/resetPassword/${email}`)
      .then((res) => {})
      .catch((err) => {
        alert(err.response.data.message);
      });
    alert('An OTP has been sent to your email!');
  };
  return (
    <div className="container-fluid" style={{ backgroundColor: '#96B7C7' }}>
      <div className="row" style={{ backgroundColor: '#96B7C7' }}>
        <div className="col-md-5">
          <div className={styles.logoContainer}>
            <Link to={'/admin/home'} className="navbar-brand">
              Pharma
            </Link>
          </div>
        </div>
        <div className="col-md-7" id={styles.rightCol}>
          <div className={styles.titleResetPass}>
            <p>
              <strong>Verify OTP</strong>
            </p>
          </div>
          <div className={styles.p3}>
            <p>
              <strong>Enter OTP (One-time password) sent to {email}</strong>
            </p>
          </div>
          <OTP onOTPChange={handleOTPChange} />
          <div className={styles.component1Buttons}>
            <Button
              style={{ width: '400px', height: '40.541px' }}
              onClick={handleVerifyCode}
              name="Verify Code"
            />
            <Button
              style={{
                backgroundColor: 'white',
                color: '#193842',
                borderStyle: 'none',
              }}
              onClick={handleResendCode}
              name="Resend Code"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Component1;
