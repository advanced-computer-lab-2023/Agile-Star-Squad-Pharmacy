import React, { Component } from "react";

class PatientRegisterForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      name: "",
      email: "",
      password: "",
      dateOfBirth: "",
      gender: "male",
      mobileNumber: "",
      emergencyContact: {
        fullName: "",
        phoneNumber: "",
        relation: "",
      },
    };
  }

  handleUsernameChange = (event) => {
    this.setState({
      username: event.target.value,
    });
  };

  handleNameChange = (event) => {
    this.setState({
      name: event.target.value,
    });
  };

  handleEmailChange = (event) => {
    this.setState({
      email: event.target.value,
    });
  };

  handlePasswordChange = (event) => {
    this.setState({
      password: event.target.value,
    });
  };

  handleDateOfBirthChange = (event) => {
    this.setState({
      dateOfBirth: event.target.value,
    });
  };

  handleGenderChange = (event) => {
    this.setState({
      gender: event.target.value,
    });
  };

  handleMoibleNumberChange = (event) => {
    this.setState({
      mobileNumber: event.target.value,
    });
  };

  handleEmergencyFullNameChange = (event) => {
    this.setState({
      emergencyContact: {
        ...this.state.emergencyContact,
        fullName: event.target.value,
      },
    });
  };

  handleEmergencyNumberChange = (event) => {
    this.setState({
      emergencyContact: {
        ...this.state.emergencyContact,
        phoneNumber: event.target.value,
      },
    });
  };

  handleEmergencyRelationChange = (event) => {
    this.setState({
      emergencyContact: {
        ...this.state.emergencyContact,
        relation: event.target.value,
      },
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const requestOptions = {
      method: "POST",
      headers: { "Content-type": "application/json; charset=UTF-8" },
      body: JSON.stringify(this.state),
    };
    fetch("http://localhost:4000/patients", requestOptions);
  };

  render() {
    const {
      username,
      name,
      email,
      password,
      dateOfBirth,
      gender,
      mobileNumber,
      emergencyContact,
    } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={this.handleUsernameChange}
          />
        </div>
        <div>
          <label>Name</label>
          <input type="text" value={name} onChange={this.handleNameChange} />
        </div>
        <div>
          <label>Email</label>
          <input type="text" value={email} onChange={this.handleEmailChange} />
        </div>
        <div>
          <label>Password</label>
          <input
            type="text"
            value={password}
            onChange={this.handlePasswordChange}
          />
        </div>
        <div>
          <label>Date of Birth</label>
          <input
            type="date"
            value={dateOfBirth}
            onChange={this.handleDateOfBirthChange}
          />
        </div>
        <div>
          <label>Gender</label>
          <select type="text" value={gender} onChange={this.handleGenderChange}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label>Moible Number</label>
          <input
            type="text"
            value={mobileNumber}
            onChange={this.handleMoibleNumberChange}
          />
        </div>
        <div>
          <label>Emergency Contact:</label>
          <div>
            <label>Full Name</label>
            <input
              type="text"
              value={emergencyContact.fullName}
              onChange={this.handleEmergencyFullNameChange}
            />
          </div>
          <div>
            <label>Moible Number</label>
            <input
              type="text"
              value={emergencyContact.phoneNumber}
              onChange={this.handleEmergencyNumberChange}
            />
          </div>
          <div>
            <label>Relation</label>
            <input
              type="text"
              value={emergencyContact.relation}
              onChange={this.handleEmergencyRelationChange}
            />
          </div>
        </div>
        <button type="submit">Register</button>
      </form>
    );
  }
}

export default PatientRegisterForm;
