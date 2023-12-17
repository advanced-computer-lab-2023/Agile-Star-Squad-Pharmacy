import React, { useState, useEffect, useContext } from 'react';
import medicinalUseEnum from '../../shared/util/MedicinalUseEnum';
import { useNavigate } from 'react-router-dom';
import CartContext from '../../patient/pages/cart/Cart';
import UserContext from '../../user-store/user-context';
import NavBar from '../../shared/components/NavBar/NavBar';
import axios from 'axios';

const PharmacyHomePharmacist = () => {
  const userCtx = useContext(UserContext);

  const [medicineList, setMedicineList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);

  const [nameField, setNameField] = useState('');
  const [medicinalUse, setMedicinalUse] = useState('');

  const [newPrice, setNewPrice] = useState('');
  const [newDescription, setNewDescription] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('http://localhost:4000/pharmacy', {
          method: 'GET',
          headers: { 'Content-type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();

        const Medicine = result.data.Medicine;
        setMedicineList(
          Medicine.map((m) => {
            return {
              id: m._id,
              cartQuantity: 1,
              ...m,
            };
          })
        );
        setFilteredList(
          Medicine.map((m) => {
            return {
              id: m._id,
              name: m.name,
              image: m.image,
              description: m.description,
              activeIngredient: m.activeIngredient,
              price: m.price,
              sales: m.sales,
              cartQuantity: 1,
              quantity: m.quantity,
              archived: m.archived,
            };
          })
        );
        fetchCart(
          Medicine.map((m) => {
            return {
              id: m._id,
              name: m.name,
              image: m.image,
              description: m.description,
              price: m.price,
              sales: m.sales,
              cartQuantity: 1,
              quantity: m.quantity,
            };
          })
        );
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  const fetchCart = async (medicines) => {
    if (cartCtx.length == 0 && userCtx.role === 'patient') {
      const response = await fetch(
        `http://localhost:4000/patients/${userCtx.userId}/cart`,
        { credentials: 'include' }
      );
      const cartJson = await response.json();
      const cart = cartJson.cart;
      console.log(response);
      cart.forEach((item) => {
        const medicine = medicines.find(
          (medicineItem) => medicineItem.id == item.id
        );
        cartCtx.initItem({
          id: item.id,
          image: medicine.image,
          name: medicine.name,
          description: medicine.description,
          price: medicine.price,
          quantity: +item.quantity,
        });
      });
    }
  };

  const medicinalUseOptions = []; // fill options based on medicinalUse enum
  for (const use of medicinalUseEnum) {
    medicinalUseOptions.push(
      <option key={use} value={use}>
        {use}
      </option>
    );
  }

  const searchByNameHandler = (event) => {
    setNameField(event.target.value);
  };

  const dropDownHandler = (event) => {
    setMedicinalUse(event.target.value);
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();

    setFilteredList(
      medicineList
        .filter(
          (m) =>
            m.name.includes(nameField) && m.medicinalUse.includes(medicinalUse)
        )
        .map((m) => {
          return {
            image: m.image,
            name: m.name,
            description: m.description,
            price: m.price,
            sales: m.sales,
            quantity: m.quantity,
          };
        })
    );
  };
  const editHandler = async (medicine) => {
    navigate('/medicine/edit', { state: { medicine } });
  };
  const newPriceTextFieldHandler = (event) => {
    setNewPrice(event.target.value);
  };
  const newDescriptionTextFieldHandler = (event) => {
    setNewDescription(event.target.value);
  };

  const borderStyle = {
    border: '1px solid #ccc',
    padding: '10px',
    margin: '10px',
  };

  const navigate = useNavigate();

  const addNewMedicineHandler = () => {
    navigate('/medicine/add');
  };

  const redirectToCartPage = () => {
    navigate('/cart');
  };

  const goToArchivedMedicinesPage = () => {
    navigate('/archivedMedicines');
  };

  const cartCtx = useContext(CartContext);

  // const [quantity, setQuantity] = useState(1);

  const onChange = (value) => {
    setFilteredList(
      filteredList.map((m) => {
        if (m.id === value.target.id) {
          return {
            ...m,
            cartQuantity: value.target.value,
          };
        } else {
          return m;
        }
      })
    );

    // setQuantity(value.target.value);
  };

  const addItem = (medicine, e) => {
    e.preventDefault();
    cartCtx.addItem({
      id: medicine.id,
      image: medicine.image,
      name: medicine.name,
      price: medicine.price,
      description: medicine.description,
      price: medicine.price,
      quantity: +medicine.cartQuantity,
    });
    alert('Medicine added to cart successfully!');

    // call to the backend to add an item
  };

  const logout = () => {
    userCtx.logout();
    navigate('/');
  };
  const goToOrdersHandler = () => {
    navigate(`/order`);
  };

  const goToAddressHandler = () => {
    navigate(`/address/add`);
  };

  const changePasswordHandler = () => {
    navigate('/changePassword');
  };

  return (
    <React.Fragment>
      <NavBar />
      <br />
        <input
          type="text"
          id="textInput"
          name="userInput"
          placeholder="search by name"
          // value={nameField} // Set the input field value to the state
          onChange={searchByNameHandler}
        />
        <select value={medicinalUse} onChange={dropDownHandler}>
          <option value="">any</option>
          {medicinalUseOptions}
        </select>
        <button onClick={onSubmitHandler} type="submit">SUBMIT</button>
        {userCtx.role == 'patient' ? (
          <>
            <button onClick={redirectToCartPage}>My Cart</button>
            <button onClick={goToOrdersHandler}>Go to Orders</button>
            <button onClick={goToAddressHandler}>Add Address</button>
          </>
        ) : null}
        <hr />
        {userCtx.role == 'pharmacist' ? (
          <div>
            <button onClick={addNewMedicineHandler}>ADD MEDICINE</button>
            <button onClick={goToArchivedMedicinesPage}>
              Archived Medicines
            </button>
          </div>
        ) : null}
        <button onClick={logout}>logout</button>
        <button onClick={changePasswordHandler}>change password</button>
      {filteredList.map((item, index) =>
        // Check if the medicine is not archived before rendering
        !item.archived ? (
          <div key={item.id} style={borderStyle}>
            <img
              src={item.image}
              alt={item.description}
              style={{ width: '500px', height: 'auto' }}
            />
            <p>Name: {item.name}</p>
            <p>Description: {item.description}</p>
            <p>Price: {item.price}</p>

            {userCtx.role === 'patient' ? (
              <div>
                <input
                  type="number"
                  id={item.id}
                  value={item.cartQuantity}
                  onChange={onChange}
                  min="1"
                  label="Amount"
                />

                <button onClick={(e) => addItem(item, e)} type="submit">
                  + Add
                </button>
              </div>
            ) : null}

            {userCtx.role === 'pharmacist' ? (
              <React.Fragment>
                <p>Sales: {item.sales}</p>
                <p>Quantity: {item.quantity}</p>
                <hr />
                <button onClick={() => editHandler(item)} type="submit">
                  Edit
                </button>
              </React.Fragment>
            ) : null}
          </div>
        ) : null
      )}
    </React.Fragment>
  );
};

export default PharmacyHomePharmacist;
