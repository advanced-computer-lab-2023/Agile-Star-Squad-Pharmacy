import React, { Component } from 'react'

class PharmacistRequestForm extends Component {

    constructor(props) {
        super(props)

        this.state = {
            username: '',
            name: '',
            email: '',
            password: '',
            dateOfBirth: '',
            hourlyRate: '',
            affiliation: '',
            educationalBackground: ''
        }
    }

    handleUsernameChange = event => {
        this.setState({
            username: event.target.value
        })
    }

    handleNameChange = event => {
        this.setState({
            name: event.target.value
        })
    }

    handleEmailChange = event => {
        this.setState({
            email: event.target.value
        })
    }

    handlePasswordChange = event => {
        this.setState({
            password: event.target.value
        })
    }

    handleDateOfBirthChange = event => {
        this.setState({
            dateOfBirth: event.target.value
        })
    }

    handleHourlyRateChange = event => {
        this.setState({
            hourlyRate: event.target.value
        })
    }

    handleAffiliationChange = event => {
        this.setState({
            affiliation: event.target.value
        })
    }

    handleEducationalBackgroundChange = event => {
        this.setState({
            educationalBackground: event.target.value
        })
    }
    // 
    //PharmacistSignup is temp till we make a request function
    //
    handleSubmit = event => {
        event.preventDefault()
        const requestOptions = {
            method: 'POST',
            headers: { "Content-type": "application/json; charset=UTF-8", },
            body: JSON.stringify(this.state)
        };
        fetch('http://localhost:4000/pharmacist', requestOptions)
   }



    render() {
        const { username, name, email, password, dateOfBirth, hourlyRate, affiliation, educationalBackground } = this.state
        return (
            <form onSubmit = {this.handleSubmit}>
                <div>
                    <label>Username</label>
                    <input type='text' value={username} onChange={this.handleUsernameChange} />
                </div>
                <div>
                    <label>Name</label>
                    <input type='text' value={name} onChange={this.handleNameChange} />
                </div>
                <div>
                    <label>Email</label>
                    <input type='text' value={email} onChange={this.handleEmailChange} />
                </div>
                <div>
                    <label>Password</label>
                    <input type='text' value={password} onChange={this.handlePasswordChange} />
                </div>
                <div>
                    <label>Date of Birth</label>
                    <input type='date' value={dateOfBirth} onChange={this.handleDateOfBirthChange} />
                </div>
                <div>
                    <label>Hourly Rate</label>
                    <input type='text' value={hourlyRate} onChange={this.handleHourlyRateChange} />
                </div>
                <div>
                    <label>Affiliation</label>
                    <input type='text' value={affiliation} onChange={this.handleAffiliationChange} />
                </div>
                <div>
                    <label>Educational Background</label>
                    <input type='text' value={educationalBackground} onChange={this.handleEducationalBackgroundChange} />
                </div>
                <button type= "submit">Request registeration</button>
            </form>
        )
    }
}

export default PharmacistRequestForm