import React, { useState, useEffect, useContext } from 'react';
import medicinalUseEnum from '../../shared/util/MedicinalUseEnum';
import { useNavigate } from 'react-router-dom';
import { DUMMY_USER } from '../../shared/DummyUsers';
import CartContext, {
  CartContextProvider,
} from '../../patient/pages/cart/Cart';

const PharmacyHomePharmacist = () => {
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
  const editHandler = async (event, id) => {
    event.preventDefault();
    const requestOptions = {
      method: 'PATCH',
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
      body: JSON.stringify({ price: newPrice, description: newDescription }),
    };
    const updatedMedicine = await fetch(
      `http://localhost:4000/medicine/${id}`,
      requestOptions
    );
    const medicineJson = await updatedMedicine.json();

    let newMedicine = await medicineJson.data.medicine;
    newMedicine = { ...newMedicine, id: newMedicine._id };
    const allMedicines = [];
    const filteredMedicines = [];

    for (const medicine of filteredList) {
      if (medicine.id === id) {
        allMedicines.push(newMedicine);
      } else {
        allMedicines.push(medicine);
      }
    }

    for (const medicine of filteredList) {
      if (medicine.id === id) {
        filteredMedicines.push(newMedicine);
      } else {
        filteredMedicines.push(medicine);
      }
    }

    setMedicineList(allMedicines);
    setFilteredList(filteredMedicines);
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
    navigate('/patient/pages/Cart');
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
  };

  return (
    <React.Fragment>
      <form onSubmit={onSubmitHandler}>
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
        <button type="submit">SUBMIT</button>
        {DUMMY_USER.role == 'patient' ? (
          <button onClick={redirectToCartPage}>My Cart</button>
        ) : null}
        <hr />
        {DUMMY_USER.role == 'pharmacist' ? (
          <button onClick={addNewMedicineHandler}>ADD MEDICINE</button>
        ) : null}
      </form>
      {filteredList.map((item, index) => (
        <div key={item.id} style={borderStyle}>
          <img
            src={item.image}
            alt={item.description}
            style={{ width: '500px', height: 'auto' }}
          />
          <p>Name: {item.name}</p>
          <p>Description: {item.description}</p>
          <p>Price: {item.price}</p>

          {DUMMY_USER.role == 'patient' ? (
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

          {DUMMY_USER.role == 'pharmacist' ? (
            <React.Fragment>
              <p>Sales: {item.sales}</p>
              <p>Quantity: {item.quantity}</p>
              <hr />
              <form onSubmit={(event) => editHandler(event, item.id)}>
                <label>New Price</label>
                <input type="text" onChange={newPriceTextFieldHandler} />

                <label>New Description</label>
                <input type="text" onChange={newDescriptionTextFieldHandler} />
                <hr />
                <button type="submit">Edit</button>
              </form>
            </React.Fragment>
          ) : null}
        </div>
      ))}
    </React.Fragment>
  );
};

export default PharmacyHomePharmacist;
