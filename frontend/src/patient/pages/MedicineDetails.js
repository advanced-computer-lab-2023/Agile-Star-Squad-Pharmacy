import 'bootstrap/dist/css/bootstrap.min.css';
// import InputField from '../../shared/components/InputField/InputField';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import UserContext from '../../user-store/user-context';
import { Link } from 'react-router-dom';
import NavBar from '../../shared/components/NavBar/NavBar';
import img from "./medicine.png";


const MedicineDetails = (props) => {
    return (
        <div style={{height:"100vh"}}>
            <NavBar />
        
        <div style= {{display: "flex", flexDirection: "row", alignItems: "center", height:"80vh",marginTop:'18px'}}>
            <div className='col-5 d-flex justify-content-center align-items-center '>
            <img src={img} alt="Medicine Image" />
            </div>
            
        </div>
        </div>





    )
}
export default MedicineDetails;