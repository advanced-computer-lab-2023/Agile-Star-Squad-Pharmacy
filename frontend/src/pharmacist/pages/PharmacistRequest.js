import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import storage from '../../index';
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

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
  const [idImageForm, setIdImage] = useState("");
  const [pharmacyLicenseForm, setLicenseImage] = useState("");
  const [pharmacyDegreeForm, setDegreeImage] = useState("");


  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const onIdImageChange = (file) => {
    setIdImage(file);
  }

  const onPharmacyLicenseChange = (file) => {
    setLicenseImage(file);
  }

  const onPharmacyDegreeChange = (file) => {
    setDegreeImage(file);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    let idDownloadUrl;
    let licenseDownloadUrl;
    let degreeDownloadUrl;

    if (idImageForm !== "") {
      const idImageRef = ref(storage, `${idImageForm.name}`);
      await uploadBytesResumable(idImageRef, idImageForm).then(async (snapshot) => {
        idDownloadUrl = await getDownloadURL(snapshot.ref);
      });
    }

    if (pharmacyLicenseForm !== "") {
      const pharmacyLicenseRef = ref(storage, `${pharmacyLicenseForm.name}`);
      await uploadBytesResumable(pharmacyLicenseRef, pharmacyLicenseForm).then(async (snapshot) => {
        licenseDownloadUrl = await getDownloadURL(snapshot.ref)
      });
    }

    if (pharmacyDegreeForm !== "") {
      const pharmacyDegreeRef = ref(storage, `${pharmacyDegreeForm.name}`);
      await uploadBytesResumable(pharmacyDegreeRef, pharmacyDegreeForm).then(async (snapshot) => {
        degreeDownloadUrl = await getDownloadURL(snapshot.ref)
      });
    }
    
    setIdImage(idDownloadUrl);
    setLicenseImage(licenseDownloadUrl);
    setDegreeImage(degreeDownloadUrl);

    const data = {
      "username": formData.username,
      "name": formData.name,
      "email": formData.email,
      "password": formData.password,
      "dateOfBirth": formData.dateOfBirth,
      "hourlyRate": formData.hourlyRate,
      "affiliation": formData.affiliation,
      "educationalBackground": formData.educationalBackground,
      "idImage": idImageForm,
      "pharmacyLicense": pharmacyLicenseForm,
      "pharmacyDegree": pharmacyDegreeForm
    }

    try {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
        body: JSON.stringify(data),
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
  const {idImage} = idImageForm;
  const {pharmacyDegree} = pharmacyDegreeForm;
  const {pharmacyLicense} = pharmacyLicenseForm;

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
      <div>
        <label>ID</label>
        <input
          type="file"
          name="idImage"
          value={idImage}
          onChange={onIdImageChange}
        />
      </div>
      <div>
        <label>Medical License</label>
        <input
          type="file"
          name="medicalLicense"
          value={pharmacyLicense}
          onChange={onPharmacyLicenseChange}
        />
      </div>
      <div>
        <label>Medical Degree</label>
        <input
          type="file"
          name="medicalDegree"
          value={pharmacyDegree}
          onChange={onPharmacyDegreeChange}
        />
      </div>
      <button type="submit">Request registration</button>
    </form>
  );
};

export default PharmacistRequestForm;
