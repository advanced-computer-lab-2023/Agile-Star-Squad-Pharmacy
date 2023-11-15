import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../components/login.module.css';
import InputField from '../components/InputField/InputField';
import Button from '../components/Button/Button';
import axios from 'axios';
import UserContext from '../../user-store/user-context';

function ChangePassword() {
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');

  const handleCancel = () => {
    navigate('/');
  };

  const handleNewPassword = (e) => {
    setNewPassword(e.target.value);
  };
  const handleRetypePassword = (e) => {
    setRetypePassword(e.target.value);
  };

  const isPasswordValid = () => {
    // Password validation checks
    const lengthCheck = newPassword.length >= 8;
    const uppercaseCheck = /[A-Z]/.test(newPassword);
    const lowercaseCheck = /[a-z]/.test(newPassword);
    const specialCharOrDigitCheck = /[0-9!@#$%^&*]/.test(newPassword);

    return (
      lengthCheck && uppercaseCheck && lowercaseCheck && specialCharOrDigitCheck
    );
  };

  const handleSubmit = async (e) => {
    if (newPassword === retypePassword) {
      if (isPasswordValid()) {
        const response = await axios
          .patch(`http://localhost:4000/auth/resetPassword/${userCtx.userId}`, {
            password: newPassword,
          })
          .catch((err) => {
            console.log(err);
          });
        navigate('/');
      } else {
        alert('Your password does not match the criteria');
      }
    } else {
      setNewPassword('');
      setRetypePassword('');
      alert('Passwords do not match');
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
      <div className={styles.component2Buttons}>
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
          onClick={handleCancel}
          name="Cancel"
        />
      </div>
    </div>
  );
}
export default ChangePassword;
