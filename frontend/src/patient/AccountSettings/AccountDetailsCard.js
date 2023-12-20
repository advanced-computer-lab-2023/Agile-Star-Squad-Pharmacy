import { useEffect, useState, useContext } from 'react';
import { SideCard } from './Account';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
//import styles from '../components/login.module.css';
import classes from './PaymentCard.module.css';
import axios from 'axios';
import UserContext from '../../user-store/user-context';
import { toastMeError, toastMeSuccess } from '../../shared/util/functions';

  const AccountDetailsCard = (props) => {
    const navigate = useNavigate();
    const [tab, setTab] = useState(0);
    const [name, setName] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const patient = useContext(UserContext);

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

  const handleNewPassword = (e) => {
    setNewPassword(e.target.value);
  };

const fetchName = () =>{
    fetch(`http://localhost:4000/patients/${patient.userId}`, {
        credentials: 'include',
      }).then(async (response) => {
        const json = await response.json();
          setName(json.data.patient.name);
    
      });
}
useEffect(()=>{fetchName()},[]);


const handleSubmit = async (e) => {
    
      if (isPasswordValid()){
        const response = await axios
          .patch(`http://localhost:4000/auth/resetPassword/${patient.userId}`, {
            password: newPassword,
          })
          .catch((err) => {
            console.log(err);
          });
        console.log(response);
        toastMeSuccess('Your password has been changed successfully');
        navigate('/');}
        else {
          toastMeError('Your password does not match the criteria');
        }
    
  }


  return (
    <SideCard>
      <div className={classes.sideCardTitle}>Account Details</div>
      <div className="d-flex align-items-center mt-3 mx-5 justify-content-between">
      </div>
      <div className={classes.inputLabel}>Name: <span style={{fontSize:'14px',color:'black'}}> {name}
        </span></div>
      
      <div style={{fontSize:'12px',marginTop: '5%',color:'red'}}>
        <ul >
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
      <div style ={{marginBottom:'5%',marginTop:'-6%'}}>
          <div className={classes.inputLabel}>New Password</div>
          <div className="d-flex align-items-center">
            <input onChange={handleNewPassword}
            type='password'
              //value={gender}
            //  onChange={(e) => setCvv(e.target.value)}
              className={`${classes.input} w-50`}
            />
          </div>
        </div>
      <div>
      <div className="d-flex justify-content-between">
        { <button className={classes.saveButton} onClick={handleSubmit} >
          Save
        </button> }
      </div>
      </div>
    </SideCard>
  );
};

export default AccountDetailsCard;

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    width: '130px',
    height: '60px',
    backgroundColor: '#E2E8F0',
    border: 'none',
    borderRadius: '5px',
    textAlign: 'start',
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: '#193842',
  }),
  indicatorSeparator: () => ({}),
  menu: (provided) => ({
    ...provided,
    borderRadius: '20px',
  }),
  option: (provided, state) => ({
    ...provided,
    borderRadius: '14px',
    fontSize: '14px',
    fontWeight: state.isFocused ? '500' : '400',
    color: state.isFocused ? 'black' : '#666666',
    textAlign: 'left',
    backgroundColor: 'transparent',
  }),
  singleValue: (provided) => ({
    ...provided,
    fontSize: '12px',
    fontWeight: '500',
    color: '#2D3748',
    whiteSpace: 'wrap',
  }),
  valueContainer: (provided) => ({
    ...provided,
    backgroundColor: 'transparent',
  }),
  menuList: (base) => ({
    ...base,
    '::-webkit-scrollbar': {
      width: '3px',
      height: '0px',
    },
    '::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '::-webkit-scrollbar-thumb': {
      background: '#888',
      borderRadius: '3px',
    },
    '::-webkit-scrollbar-thumb:hover': {
      background: '#555',
    },
  }),
};
