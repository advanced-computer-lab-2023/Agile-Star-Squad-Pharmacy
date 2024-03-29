import 'bootstrap/dist/css/bootstrap.min.css';
// import InputField from '../../shared/components/InputField/InputField';
import React, { useContext, useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserContext from '../../user-store/user-context';
import { Link } from 'react-router-dom';
import NavBar from '../../shared/components/NavBar/NavBar';
import img from './medicine.png';
import tick from './tick.png';
import cart from './cartMazen.png';
import line from './line.png';
import cross from './cross.png';
import CartContext from './cart/Cart';
import AddMedicine from '../../pharmacist/pages/AddMedicine';
import { toastMe, toastMeSuccess } from '../../shared/util/functions';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MedicineDetails = (props) => {
  const user = useContext(UserContext);
  const cartCtx = useContext(CartContext);
  const location = useLocation();
  const [allMedicines, setAllMedicine] = useState([]);
  const [relatedMedicines, setRelatedMedicines] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [stateData, setStateData] = useState(location.state);
  const navigate = useNavigate();

  console.log(stateData);
  const stockColor = stateData.quantity !== 0 ? '#00B517' : '#ff0000';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:4000/pharmacy', {
        method: 'GET',
        headers: { 'Content-type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();

      const medicineJson = result.data.Medicine;
      setAllMedicine(
        medicineJson.map((m) => {
          return {
            id: m._id,
            cartQuantity: 1,
            ...m,
          };
        })
      );
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    filterRelatedMedicines();
  }, [allMedicines, location.state]);

  const filterRelatedMedicines = () => {
    if (stateData && stateData.activeIngredient) {
      const filteredMedicines = allMedicines.filter(
        (medicine) =>
          medicine.activeIngredient === stateData.activeIngredient &&
          medicine.id !== stateData.id
      );
      setRelatedMedicines(filteredMedicines);
    }
  };

  const exitEditForm = (medicine) => {
    setShowEdit(false);
    if (medicine.name != null) {
      setStateData(medicine);
    }
  };

  /////////////////////////////
  const addItem = (e) => {
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
    toastMeSuccess(`Added ${stateData.name} successfully`);
  };

  const toMedicineDetails = (medicine) => {
    //navigate('/medicine', { state: medicine });
    setStateData(medicine);
  };

  return (
    <div style={{ height: '100vh' }}>
      {showEdit && <AddMedicine medicine={stateData} exit={exitEditForm} />}
      <NavBar />

      <div
        style={{
          marginTop: '2%',
          display: 'flex',
          alignItems: 'center',
          height: 'auto',
        }}
      >
        <div className="col-5 d-flex justify-content-center align-items-center">
          <img
            src={stateData.image}
            alt="Medicine Image"
            style={{
              maxWidth: '100%',
              maxHeight: '300px',
              width: 'auto',
              height: 'auto',
            }}
          />
        </div>
        <div className="col-1 d-flex flex-column justify-content-start align-items-start"></div>
        <div
          className="col-3 d-flex flex-column justify-content-start align-items-start"
          style={{ marginTop: '-10%' }}
        >
          <div
            style={{
              marginTop: '39%',
              fontWeight: '600',
              fontSize: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {stateData.name}
            {user.role == 'patient' && (
              <div
                style={{
                  color: stockColor,
                  fontSize: '16px',
                  marginLeft: '-10%',
                }}
                className="row-4 d-flex flex-row"
              >
                <img src={stateData.quantity !== 0 ? tick : cross} />
                <nbsp />
                {stateData.quantity !== 0 ? 'In Stock' : 'Out of Stock'}
              </div>
            )}
          </div>
          <div
            style={{
              marginTop: '15%',
              marginBottom: '6%',
              color: '#505050',
              fontSize: '16px',
            }}
          >
            Price: {stateData.price} L.E.
          </div>

          <img src={line} alt="line" style={{ marginBottom: '9%' }} />
          <div
            style={{ color: '#505050', marginBottom: '14%', fontSize: '16px' }}
          >
            Description: {stateData.description}
          </div>
          <div style={{ color: '#505050', fontSize: '16px' }}>
            Medicinal Use: {stateData.medicinalUse}
          </div>

          {user.role == 'pharmacist' && (
            <>
              <div
                style={{
                  position: 'absolute',
                  top: '120px',
                  right: '60px',
                  background: '#3182CE',
                  borderRadius: '10px',
                  color: 'white',
                  padding: '5px 25px',
                  cursor: 'pointer',
                  fontWeight: '500',
                }}
                onClick={() => setShowEdit(true)}
              >
                Edit
              </div>
            </>
          )}
          
          {(user.role == 'pharmacist' || user.role == 'admin') && (
            <>
              <div style={{ color: '#505050', fontSize: '16px' }}>
                Sales: {stateData.sales}
                <br />
                Quantity: {stateData.quantity}
              </div>
            </>
          )}


          <img src={line} alt="line" style={{}} />
          <div style={{ fontWeight: '500' }}>
            Other Medicines With Similar Active Ingredients:
          </div>
          <div>
            {relatedMedicines.map((medicine) =>
              medicine.isOtc && !medicine.archived ? (
                <img
                  key={medicine.id}
                  src={medicine.image}
                  alt={medicine.name}
                  style={{ cursor: 'pointer' }}
                  width={'80px'}
                  onClick={() => toMedicineDetails(medicine)}
                />
              ) : null
            )}
          </div>
        </div>
        {user.role == 'patient' && (
          <div className="col-2 d-flex flex-column">
            <button
              style={{
                marginTop: '-80%',
                width: '185px',
                height: '49px',
                color: stateData.quantity !== 0 ? 'white' : 'black',
                backgroundColor: stateData.quantity !== 0 ? '#3182CE' : 'grey',
                borderRadius: '9px',
              }}
              onClick={addItem}
              disabled={stateData.quantity !== 0 ? false : true}
            >
              <img
                src={cart}
                alt="cart"
                style={{ marginRight: '10%', marginBottom: '2%' }}
              />
              Add to Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicineDetails;
