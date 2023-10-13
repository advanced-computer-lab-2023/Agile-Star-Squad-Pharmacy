import React, { useState, useEffect } from 'react';
import medicinalUseEnum from '../../shared/util/MedicinalUseEnum';
import { useNavigate } from 'react-router-dom';

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
              ...m,
            };
          })
        );
        setFilteredList(
          Medicine.map((m) => {
            return {
              id: m._id,
              image: m.image,
              description: m.description,
              price: m.price,
              sales: m.sales,
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
    medicinalUseOptions.push(<option value={use}>{use}</option>);
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

    const newMedicine = await medicineJson.data.medicine;
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
        <hr />
        {true ? ( //DUMMY_USER.role == 'pharmacist' ?
          <button onClick={addNewMedicineHandler}>ADD MEDICINE</button>
        ) : null}
      </form>
      {filteredList.map((item, index) => (
        <div key={index} style={borderStyle}>
          <img
            src={item.image}
            alt={item.description}
            style={{ width: '500px', height: 'auto' }}
          />
          <p>Description: {item.description}</p>
          <p>Price: {item.price}</p>
          {true ? ( //DUMMY_USER.role == 'pharmacist' ? (
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
