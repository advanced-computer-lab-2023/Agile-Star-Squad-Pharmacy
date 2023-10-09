import React, { useState, useEffect } from "react";

const PharmacyHome = () => {
  const [medicineList, setMedicineList] = useState([]);

  let unfilteredList = [];

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
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  const onSubmitHandler = (event) => {
    event.preventDefault();
    //   (name, medicinalUse) => {

    const name = "ah";
    const medicinalUse = ["c"];

    let listToBeFiltered = medicineList.filter((m) => m.name.includes(name));

    const match = listToBeFiltered.filter((dbMedicine) =>
      dbMedicine.medicinalUse.find((dbUse) =>
        medicinalUse.find((use) => use === dbUse)
      )
    );

    const exactMatch = match.filter((dbMedicine) => {
      let isMatch = true;
      for (const use of medicinalUse) {
        if (!dbMedicine.medicinalUse.includes(use)) {
          isMatch = false;
          break;
        }
      }

      return isMatch;
    });

    const partialMatch = match.filter((p) => !exactMatch.includes(p));

    setMedicineList(partialMatch);
  };

  return (
    <React.Fragment>
      <form onSubmit={onSubmitHandler}>
        <button type="submit">SUBMIT</button>
      </form>
      {JSON.stringify(medicineList)}
    </React.Fragment>
  );
};

export default PharmacyHome;
