import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../images/logo.svg';
import img from '../images/login-image.png';
import styles from '../components/login.module.css';
import InputField from '../components/InputField/InputField';
import React, { useEffect, useState } from 'react';
import Button from '../components/Button/Button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = (props) => {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  let page;

  useEffect(() => {
    // Function to get the cookie by name
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);

      if (parts.length === 2) return parts.pop().split(';').shift();
    };

    // Check if the token exists in cookies
    const jwtCookie = getCookie('jwt');

    if (jwtCookie) {
      setToken(jwtCookie);
    }
  }, []);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/auth/${username}/${password}`,
        { withCredentials: true }
      );
      const { role, userId } = response.data.data;
      // Store the token in state or wherever you manage your application state
      props.setUser({ role, userId });
      // You may also want to store the token in a more persistent way (e.g., localStorage)

      navigate('/');
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-7">
          <div className={styles.logo}>
            <img src={logo} alt="logo" />
          </div>
          <img className={styles.stethoscope} src={img} alt="login" />
        </div>

        <div className="col-md-5" id={styles.rightCol}>
          <div className={styles.title}>
            <p>
              <strong>Nice To See You Again</strong>
            </p>
          </div>
          <InputField
            type="text"
            placeholder="Username"
            onChange={handleUsernameChange}
            value={username}
          />
          <InputField
            type="password"
            placeholder="Password"
            onChange={handlePasswordChange}
            value={password}
          />
          <div className={styles.forgetPassword}>
            <a className={styles.forgetPass} href="/resetPassword">
              Forget Password
            </a>
          </div>
          <div className={styles.buttonAndText}>
            <Button onClick={handleSubmit} name="Sign In" />
            <div className={styles.createAccount}>
              <p>
                Don't have an account?{' '}
                <a className={styles.signupLink} href="#">
                  Sign Up Now
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
