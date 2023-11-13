import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './login.module.css';
import InputField from './InputField/InputField';
import Button from './Button/Button';
import axios from 'axios';

function Component2({ setTab3, email }) {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [id, setId] = useState('');

  const handleEmailCancel = () => {
    navigate('/');
  };

  const handleNewPassword = (e) => {
    setNewPassword(e.target.value);
  };
  const handleRetypePassword = (e) => {
    setRetypePassword(e.target.value);
  }

  const isPasswordValid = () => {
    // Password validation checks
    const lengthCheck = newPassword.length >= 8;
    const uppercaseCheck = /[A-Z]/.test(newPassword);
    const lowercaseCheck = /[a-z]/.test(newPassword);
    const specialCharOrDigitCheck = /[0-9!@#$%^&*]/.test(newPassword);


    return (
      lengthCheck &&
      uppercaseCheck &&
      lowercaseCheck &&
      specialCharOrDigitCheck
    );
  };


  const handleSubmit = async (e) => {
    if ((newPassword === retypePassword)) {
      if (isPasswordValid()) {
        const user = await axios
          .get(`http://localhost:4000/resetPassword/${email}`)
          .then((res) => {
            setId(res.data.data.user._id);
          });

        console.log(id);
        console.log(newPassword);

        fetch(`http://localhost:4000/resetPassword/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ newPassword: newPassword }), // Convert data to JSON format
          mode: 'no-cors',
        })
          .catch((error) => {
            console.error('Error:', error);
          });


        setTab3(true);
      }
      else {
        alert("Your password does not match the criteria");
      }
    } else {
      setNewPassword('');
      setRetypePassword('');
      alert("Passwords do not match");
    }
  };



  return (
    <div className="col-md-7" id={styles.rightCol}>
      <div className={styles.title2}>
        <p>
          <strong>NEW CREDENTIALS</strong>
        </p>
      </div>
      <div className={styles.p1}>
        <ul className={styles.rules}>
          <strong>
            <li>Password must be at least 8 characters long.</li>
            <li>Password must contain at least one upper case.</li>
            <li>One lower case letter.</li>
            <li>
              Password must contain at least one number or special character
            </li>
          </strong>
        </ul>
      </div>
      <InputField
        style={{ width: '500px', height: '28px' }}
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={handleNewPassword}
      />
      <InputField
        style={{ width: '500px', height: '28px' }}
        type="password"
        placeholder="Re-type Password"
        value={retypePassword}
        onChange={handleRetypePassword}
      />
      <Button
        style={{ width: '300px', height: '40.541px', marginTop: '-40px' }}
        onClick={handleSubmit}
        name="Submit"
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
  );
}
export default Component2;
