import React, { useState } from 'react';
import { setUserRole } from '../../shared/DummyUsers';
import { useNavigate, Link } from 'react-router-dom';
import classes from './patientRegister.module.css';
import medicines from './Medicines.png';
import Select from 'react-select';
import { useEffect } from 'react';

const PatientRegisterForm = () => {
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('User role after setting:', userRole);
  }, [userRole]);

  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    gender: 'male',
    mobileNumber: '',
    nationalId: '',
    emergencyContact: {
      fullName: '',
      phoneNumber: '',
      relation: '',
    },
  });

  const [dobDay, setDOBDay] = useState('');
  const [dobMonth, setDOBMonth] = useState('');
  const [dobYear, setDOBYear] = useState('');

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: '#f5f5f5',
      border: 'none',
      borderBottom: '1px solid #E2E4E5',
      textAlign: 'start',
    }),

    placeholder: (provided, state) => ({
      ...provided,
      color: state.isFocused ? '#000' : '#888',
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      transition: 'transform 0.3s',
      transform: 'rotate(0deg)',
      borderLeft: 'none',
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
    value: (provided) => ({
      ...provided,
      borderRadius: '20px',
      backgroundColor: 'transparent',
    }),
    singleValue: (provided) => ({
      ...provided,
      fontSize: '14px',
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
  const dayOptions = () => {
    let days = [];
    for (let i = 1; i <= 31; i++) {
      days.push({ value: i, label: i });
    }
    return days;
  };

  const monthOptions = () => {
    let months = [];
    for (let i = 1; i <= 12; i++) {
      months.push({ value: i, label: i });
    }
    return months;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name.startsWith('emergencyContact.')) {
      const fieldName = name.split('.')[1];
      setFormData({
        ...formData,
        emergencyContact: {
          ...formData.emergencyContact,
          [fieldName]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      username: formData.username,
      name: formData.name,
      email: formData.email,
      password: formData.password,
      dateOfBirth: new Date(`${dobDay.value}/${dobMonth.value}/${dobYear}`),
      Gender: formData.gender,
      mobileNumber: formData.mobileNumber,
      nationalId: formData.nationalId,
      emergencyContact: {
        fullName: formData.emergencyContact.fullName,
        phoneNumber: formData.emergencyContact.phoneNumber,
        relation: formData.emergencyContact.relation,
      },
    };

    try {
      const response = await fetch('http://localhost:4000/patients', {
        method: 'POST',
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Handle a successful response
        alert('Registration Successful!');
        setUserRole('patient');
        navigate('/pharmacy/home');
      } else {
        // Handle errors if the server response is not ok
        alert('Registration Failed!');
      }
    } catch (error) {
      // Handle network errors
      alert('Network error: ' + error.message);
    }
  };

  return (
    <body className={classes.background}>
      <div className="d-flex">
        <div className={`${classes.mainBackground} col-5`}>
          <div className={classes.logoContainer}>
            <Link to={'/pharmacy/home'} className="navbar-brand">
              PHARMA
            </Link>
          </div>
          <img
            src={medicines}
            alt="Medicines"
            className={classes.medicinesImage}
          />
        </div>
        <div className={`${classes.secondBackground} col-7`}>
          {
            <div className={classes.customText}>
              <div className="d-flex flex-column justify-content space-around">
                <p className={classes.p1}>Create Account</p>
                <form className={classes.formContainer} onSubmit={handleSubmit}>
                  <input
                    className={classes.textBox}
                    type="text"
                    name="username"
                    value={formData.username}
                    placeholder="Username"
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    className={classes.textBox}
                    type="text"
                    name="name"
                    value={formData.name}
                    placeholder="Full Name"
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    className={classes.textBox}
                    type="text"
                    name="email"
                    value={formData.email}
                    placeholder="Email"
                    onChange={handleInputChange}
                    required
                  />

                  <input
                    className={classes.textBox}
                    type="text"
                    name="password"
                    value={formData.password}
                    placeholder="Password"
                    onChange={handleInputChange}
                    required
                  />
                  <div className="d-flex">
                    <Select
                      className="daySelect"
                      value={dobDay}
                      styles={customStyles}
                      options={dayOptions()}
                      placeholder={'DD'}
                      onChange={(value) => setDOBDay(value)}
                      required
                    />
                    <Select
                      className="daySelect"
                      value={dobMonth}
                      styles={customStyles}
                      options={monthOptions()}
                      placeholder={'MM'}
                      onChange={(value) => setDOBMonth(value)}
                      required
                    />
                    <input
                      className="daySelect numField"
                      value={dobYear}
                      type="number"
                      id="dobYear"
                      name="year"
                      placeholder="YYYY"
                      onChange={(e) => setDOBYear(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <select
                      className={classes.textBox}
                      name="gender"
                      value={formData.gender}
                      placeholder="Gender"
                      onChange={handleInputChange}
                      required
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div className={classes.combine1}>
                    <input
                      className={classes.textBox}
                      type="text"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      placeholder="Mobile Number"
                      onChange={handleInputChange}
                      required
                    />
                    <input
                      className={classes.textBox}
                      type="text"
                      name="nationalId"
                      value={formData.nationalId}
                      placeholder="National ID"
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <p className={classes.p2}>Emergency Contact:</p>
                  <div className={classes.combine1}>
                    <input
                      className={classes.textBox}
                      type="text"
                      name="emergencyContact.fullName"
                      placeholder="Full Name"
                      value={formData.emergencyContact.fullName}
                      onChange={handleInputChange}
                      required
                    />
                    <input
                      className={classes.textBox}
                      type="text"
                      name="emergencyContact.phoneNumber"
                      placeholder="Phone Number"
                      value={formData.emergencyContact.phoneNumber}
                      onChange={handleInputChange}
                      required
                    />
                    <input
                      className={classes.textBox}
                      type="text"
                      name="emergencyContact.relation"
                      placeholder="Relation"
                      value={formData.emergencyContact.relation}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <button className={classes.button} type="submit">
                    <div className={classes.buttonText}> Register</div>
                  </button>
                </form>
              </div>
            </div>
          }
        </div>
      </div>
    </body>
  );
};

export default PatientRegisterForm;
