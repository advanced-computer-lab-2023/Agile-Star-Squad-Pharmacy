import React, { useState } from "react";
import {Link} from 'react-router-dom'
import classes from "../components/signupOptions.module.css";
import logo from '../images/logo.png';

const SignupOptions = () => {
    const [buttonText, setButtonText] = useState('Join the platform');
    const [buttonColor, setButtonColor] = useState('#ccc');
    const [signupLink, setSignupLink] = useState('');
    const [isPatientSelected, setIsPatientSelected] = useState(false);
    const [isPharmacistSelected, setIsPharmacistSelected] = useState(false);

    const handlePatientClick = () => {
        setButtonText('Join as a patient');
        setButtonColor('#193842'); // Darker blue color
        setSignupLink('/patient/register');
        setIsPatientSelected(true);
        setIsPharmacistSelected(false);
    };

    const handlePharmacistClick = () => {
        setButtonText('Request to join as a pharmacist');
        setButtonColor('#193842'); // Darker blue color
        setSignupLink('/pharmacist/register');
        setIsPatientSelected(false);
        setIsPharmacistSelected(true);
    };

    const handleButtonClick = () => {
        // Navigate to the selected page using history.push
        window.location.href = signupLink;
    };

    return <div>
        <div className={classes.logoContainer}>
            <Link to={'/admin/home'} className="navbar-brand">
              PHARMA
            </Link>
          </div>
        <div className={classes.bigContainer}>
            <label className={classes.LabelTextStyle}>Join as a Patient or Pharmacist</label>

            <div
                className={`${classes.leftSmallContainer} ${isPatientSelected ? classes.selected : ''}`}
                onClick={handlePatientClick}>
                <p className={classes.textStyle}>
                    I am a patient, looking for professional help
                </p>
            </div>

            <div
                className={`${classes.rightSmallContainer} ${isPharmacistSelected ? classes.selected : ''}`}
                onClick={handlePharmacistClick}>
                <p className={classes.textStyle}>
                    I am a pharmacist, and I am happy to help
                </p>

            </div>
            <button
                className={classes.button}
                style={{ backgroundColor: isPatientSelected || isPharmacistSelected ? buttonColor : '#ccc' }}
                disabled={!isPatientSelected && !isPharmacistSelected}
                onClick={handleButtonClick}>
                {buttonText}
            </button>

            <div className={classes.p1}>
                <p className={classes.textStyle}>Already have an account?<a href="/login" className={classes.login}> Login</a></p>

            </div>
        </div>
    </div>
}

export default SignupOptions;