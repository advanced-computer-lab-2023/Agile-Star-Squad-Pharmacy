import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './login.module.css';
import InputField from './InputField/InputField';
import Button from './Button/Button';

function Component3() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    navigate('/');
  };

  return (
    <div className="col-md-7" id={styles.rightCol}>
      <div className={styles.title}>
        <p>
          <strong>PASSWORD UPDATED</strong>
        </p>
      </div>
      <div className={styles.p4}>
        <p>
          <strong>Your password has been updated!</strong>
        </p>
      </div>
      <Button
        style={{ width: '300px', height: '40.541px', marginBottom: '-40px' }}
        onClick={handleLogin}
        name="LOGIN"
      />
    </div>
  );
}

export default Component3;