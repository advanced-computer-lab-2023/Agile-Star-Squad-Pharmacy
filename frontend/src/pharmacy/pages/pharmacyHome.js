import React, { useState, useEffect } from "react";

const PharmacyHome = () => {
  const [medicineList, setMedicineList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);

  const [nameField, setNameField] = useState("");

  const [medicinalUse, setMedicinalUse] = useState("");

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

        const data = await response.json();
        setMedicineList(data.data.Medicine);
        setFilteredList(data.data.Medicine);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  const medicinalUseOptions = []; // fill options based on medicinalUse enum
  for (let i = 0; i < 10; i++) {
    medicinalUseOptions.push(
      <option key={i} value={`option${i + 1}`}>
        Option {i + 1}
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
      medicineList.filter(
        (m) =>
          m.name.includes(nameField) && m.medicinalUse.includes(medicinalUse)
      )
    );
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
          <option value="a">a</option>
          <option value="b">b</option>
        </select>
        <button type="submit">SUBMIT</button>
        <hr />
      </form>
      {JSON.stringify(filteredList)}
    </React.Fragment>
  );
};

export default PharmacyHome;
