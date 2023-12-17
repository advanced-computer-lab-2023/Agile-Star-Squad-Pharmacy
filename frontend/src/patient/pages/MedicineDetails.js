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
import cross from "./cross.png";
import CartContext from "./cart/Cart";






const MedicineDetails = (props) => {
    const cartCtx = useContext(CartContext);
    const location = useLocation();
    const stateData = location.state;
    console.log(location);
    const stockColor = stateData.quantity!==0? "#00B517":"#ff0000";

    const addItem = (e) => {
        alert("Item added Successfully")
        e.preventDefault();
        cartCtx.addItem({
            id: stateData.id,
            image: stateData.image,
            name: stateData.name,
            price: stateData.price,
            description: stateData.description,
            price: stateData.price,
            quantity: +stateData.cartQuantity,
        });
    };
    return (
        <div style={{ height: "100vh" }}>
            <NavBar />

            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", height: "80vh" }}>
                <div className='col-5 d-flex justify-content-center align-items-center'>
                    <img src={stateData.image} alt="Medicine Image" />
                </div>
                <div className='col-1 d-flex flex-column justify-content-start align-items-start'></div>
                <div className='col-3 d-flex flex-column justify-content-start align-items-start'>
                    <div style={{ marginTop: "39%", fontWeight: "600", fontSize: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        {stateData.name}
                        <div style={{ color: stockColor, fontSize: '16px' ,marginLeft:"-10%"}} className='row-4 d-flex flex-row'>
                            <img src={stateData.quantity!==0 ? tick:cross}/> {stateData.quantity!==0 ? "In Stock":"Not available"}
                        </div>
                    </div>
                    <div style={{ marginTop: "15%", marginBottom: "6%", color: "#505050", fontSize: "16px" }}>Price: {stateData.price} L.E.</div>

                    <img src={line} alt="line" style={{ marginBottom: "9%" }} />
                    <div style={{ color: "#505050", marginBottom: "14%", fontSize: "16px" }}>Description: {stateData.description}</div>
                    <div style={{ color: "#505050", fontSize: "16px" }}>Medicinal Use: {stateData.medicinalUse}</div>
                    <img src={line} alt="line" style={{}} />
                </div>
                
                <div className='col-2 d-flex flex-column'>
                
                        <button style={{ marginTop: "-45%", width: "185px", height: "49px", color: stateData.quantity!==0 ?"white":"black", backgroundColor: stateData.quantity!==0 ? "#3182CE":"grey", borderRadius: "9px" }} onClick={addItem} disabled={stateData.quantity!==0 ?false:true} >
                        <img src={cart} alt="cart" style={{ marginRight: "10%", marginBottom: "2%" }} />Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MedicineDetails;
