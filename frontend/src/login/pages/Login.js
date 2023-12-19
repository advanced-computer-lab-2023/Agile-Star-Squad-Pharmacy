import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../images/logo.svg';
import img from '../images/login-image.png';
import styles from '../components/login.module.css';
import InputField from '../components/InputField/InputField';
import React, { useContext, useEffect, useState } from 'react';
import Button from '../components/Button/Button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserContext from '../../user-store/user-context';
import { Link } from 'react-router-dom';

const Login = (props) => {
  const userCtx = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

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
      console.log(response);
      const { role, userId } = response.data.data;
      console.log('role', role);
      userCtx.login({ role, userId });
      navigate('/');
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div className="container-fluid" style={{ backgroundColor: '#96B7C7' }}>
      <div className="row" style={{ backgroundColor: '#96B7C7' }}>
        <div className="col-md-7">
          <div className={styles.logoContainer}>
            <Link to={'/admin/home'} className="navbar-brand">
              PHARMA
            </Link>
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
                  <Link to="/signupOptions">Sign Up Now</Link>
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
