import React, { useState, useEffect } from "react";
import medicinalUseEnum from "../../shared/util/medicinalUseEnum";

const PharmacyHome = () => {
  const [medicineList, setMedicineList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);

  const [nameField, setNameField] = useState("");

  const [medicinalUse, setMedicinalUse] = useState("");

  const [newPrice, setNewPrice] = useState("");
  const [newDescription, setNewDescription] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:4000/pharmacy", {
          method: "GET",
          headers: { "Content-type": "application/json" },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();

        const Medicine = result.data.Medicine;
        setMedicineList(Medicine);
        setFilteredList(
          Medicine.map((m) => {
            return {
              image: m.image,
              description: m.description,
              price: m.price,
              sales: m.sales,
              quantity: m.quantity,
            };
          })
        );
      } catch (error) {
        console.error("Error fetching data:", error);
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
  const editHandler = (event)=>{
    event.preventDefault();
    const requestOptions={
      method:"PATCH",
      headers: { "Content-type": "application/json; charset=UTF-8", },
      body: JSON.stringify({newPrice,newDescription})
  };
  fetch('http://localhost:4000/medicine/id', requestOptions)
}


const newPriceTextFieldHandler = event => {
  setNewPrice(    
     event.target.value
  )
}
const newDescriptionTextFieldHandler = event => {
  setNewDescription(
       event.target.value
  )
}
  



  const borderStyle = {
    border: "1px solid #ccc",
    padding: "10px",
    margin: "10px",
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
      </form>
      {filteredList.map((item, index) => (
        <div key={index} style={borderStyle}>
          <img
            src={item.image}
            alt={item.description}
            style={{ width: "500px", height: "auto" }}
          />
          <p>Description: {item.description}</p>
          <p>Price: {item.price}</p>
          {/* if(pharmacist){ */}
          <p>Sales: {item.sales}</p>
          <p>Quantity: {item.quantity}</p>
          
          
          <hr />
          <form onSubmit={editHandler}>
          <label>New Price</label>
            <input type='text'  onChange={newPriceTextFieldHandler} />  
            
          <label>New Description</label>
            <input type='text'  onChange={newDescriptionTextFieldHandler} />  
          <hr />
          <button type="submit" >Edit</button>   
          </form>
          {/* } */}
        </div>
      ))}
    </React.Fragment>
  );
};

export default PharmacyHome;
