import React, { useState } from 'react';
import { setUserRole } from '../../shared/DummyUsers';
import { useNavigate } from 'react-router-dom';

const PatientRegisterForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    dateOfBirth: '',
    gender: 'male',
    mobileNumber: '',
    emergencyContact: {
      fullName: '',
      phoneNumber: '',
      relation: '',
    },
  });

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
    try {
      const response = await fetch('http://localhost:4000/patients', {
        method: 'POST',
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Handle a successful response
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
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Email</label>
        <input
          type="text"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="text"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Date of Birth</label>
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Gender</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleInputChange}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
      <div>
        <label>Mobile Number</label>
        <input
          type="text"
          name="mobileNumber"
          value={formData.mobileNumber}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Emergency Contact:</label>
        <div>
          <label>Full Name</label>
          <input
            type="text"
            name="emergencyContact.fullName"
            value={formData.emergencyContact.fullName}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Mobile Number</label>
          <input
            type="text"
            name="emergencyContact.phoneNumber"
            value={formData.emergencyContact.phoneNumber}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Relation</label>
          <input
            type="text"
            name="emergencyContact.relation"
            value={formData.emergencyContact.relation}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <button type="submit">Register</button>
    </form>
  );
};

export default PatientRegisterForm;
