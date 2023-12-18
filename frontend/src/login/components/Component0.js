import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './login.module.css';
import InputField from './InputField/InputField';
import Button from './Button/Button';
import axios from 'axios';
import img from '../images/Bandage.png';
import { Link } from 'react-router-dom';

function Component0({ setTab, setEmail2 }) {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleRequestLink = async (e) => {
    if (email === '') {
      return alert('Please provide your email');
    }
    try {
      const response = await axios.post(
        `http://localhost:4000/auth/resetPassword/${email}`,
        {
          withCredentials: true,
        }
      );
      setTab(true);

      console.log('Password updated:', response.data);
    } catch (error) {
      // Handle errors here
      console.error('Axios Error:', error);
      console.error('Error Message:', error.message);
    }
  };

  const handleInput = (e) => {
    setEmail(e.target.value);
    setEmail2(e.target.value);
  };
  const handleEmailCancel = () => {
    navigate('/');
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
            <p className={styles.text}>
              <strong>Forgot Password</strong>
            </p>
          </div>
          <div className={styles.providEmail}>
            <p className={styles.text}>
              <strong>
                Provide your account's email for which you want to reset your
                password
              </strong>
            </p>
          </div>
          <InputField
            style={{ width: '500px', height: '28px', marginTop: '20px' }}
            type="email"
            placeholder="Email Address"
            onChange={handleInput}
          />
          <div className={styles.component0Buttons}>
            <Button
              style={{ width: '400px', height: '40.541px' }}
              onClick={handleRequestLink}
              name="Request OTP"
            />
            <Button
              style={{
                backgroundColor: 'white',
                color: '#193842',
                borderStyle: 'none',
              }}
              onClick={handleEmailCancel}
              name="Cancel"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Component0;
