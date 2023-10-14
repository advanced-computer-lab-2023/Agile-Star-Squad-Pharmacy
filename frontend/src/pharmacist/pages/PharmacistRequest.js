import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PharmacistRequestForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    dateOfBirth: '',
    hourlyRate: '',
    affiliation: '',
    educationalBackground: '',
  });

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
        body: JSON.stringify(formData),
      };
      const response = await fetch(
        'http://localhost:4000/pharmacist',
        requestOptions
      );

      if (response.ok) {
        // Handle a successful response
        alert('Request is pending...');
        navigate('/');
      } else {
        // Handle errors if the server response is not ok
        alert('Registration Failed!');
      }
    } catch (error) {
      // Handle network errors
      alert('Network error: ' + error.message);
    }
  };

  const {
    username,
    name,
    email,
    password,
    dateOfBirth,
    hourlyRate,
    affiliation,
    educationalBackground,
  } = formData;

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={username}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={name}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Email</label>
        <input
          type="text"
          name="email"
          value={email}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="text"
          name="password"
          value={password}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Date of Birth</label>
        <input
          type="date"
          name="dateOfBirth"
          value={dateOfBirth}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Hourly Rate</label>
        <input
          type="text"
          name="hourlyRate"
          value={hourlyRate}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Affiliation</label>
        <input
          type="text"
          name="affiliation"
          value={affiliation}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Educational Background</label>
        <input
          type="text"
          name="educationalBackground"
          value={educationalBackground}
          onChange={handleInputChange}
        />
      </div>
      <button type="submit">Request registration</button>
    </form>
  );
};

export default PharmacistRequestForm;
