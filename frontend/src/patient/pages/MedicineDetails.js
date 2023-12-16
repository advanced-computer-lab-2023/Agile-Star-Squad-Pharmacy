import 'bootstrap/dist/css/bootstrap.min.css';
// import InputField from '../../shared/components/InputField/InputField';
import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
// import UserContext from '../../user-store/user-context';
import { Link } from 'react-router-dom';
import NavBar from '../../shared/components/NavBar/NavBar';
import img from "./medicine.png";
import tick from "./tick.png";
import cart from "./cartMazen.png";
import line from "./line.png";







const MedicineDetails = (props) => {
    const location = useLocation();
    const stateData = location.state;
    const stockColor = stateData.inStock? "#00B517":"#ff0000" 
    return (
        <div style={{ height: "100vh" }}>
            <NavBar />

            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", height: "80vh" }}>
                <div className='col-5 d-flex justify-content-center align-items-center'>
                    <img src={img} alt="Medicine Image" />
                </div>
                <div className='col-1 d-flex flex-column justify-content-start align-items-start'></div>
                <div className='col-3 d-flex flex-column justify-content-start align-items-start'>
                    <div style={{ marginTop: "-20%", fontWeight: "600", fontSize: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        Medicine Name ya dala3 dalla3
                        <div style={{ color: {stockColor}, fontSize: '16px' ,marginLeft:"-65%"}} className='row-4 d-flex flex-row'>
                            <img src={stateData.inStock ? tick:cross}/> {stateData.inStock ? "In Stock":"Not available"}
                        </div>
                    </div>
                    <div style={{ marginTop: "35%", marginBottom: "6%", color: "#505050", fontSize: "16px" }}>Price: {stateData.price} L.E.</div>

                    <img src={line} alt="line" style={{ marginBottom: "9%" }} />
                    <div style={{ color: "#505050", marginBottom: "14%", fontSize: "16px" }}>Type: ARCTICMONKEYS</div>
                    <div style={{ color: "#505050", fontSize: "16px" }}>Medicinal Use: ARCTICMONKEYSUSE</div>
                    <img src={line} alt="line" style={{}} />
                </div>

                <div className='col-2 d-flex flex-column'>
                    <button style={{ marginTop: "-90%", width: "185px", height: "49px", color: "white", backgroundColor: "#3182CE", borderRadius: "9px" }}>
                        <img src={cart} alt="cart" style={{ marginRight: "10%", marginBottom: "2%" }} />Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MedicineDetails;
