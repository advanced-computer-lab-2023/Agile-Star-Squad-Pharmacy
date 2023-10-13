import React from "react";
// import PharmacyHome from "./pharmacy/pages/pharmacyHomePharmacist";
import AddMedicineForm from "./shared/components/FormElements/addMedicineForm";
// import PharmacyHomePharmacist from "./pharmacy/pages/pharmacyHomePharmacist";
import PharmacyHomePatient from "./pharmacy/pages/pharmacyHomePatient";
import PharmacistRequestForm from "./shared/components/FormElements/pharmacistRequestForm";

function App() {
  return <PharmacistRequestForm />;
  return <PharmacyHomePatient />;
  // return <PharmacyHomePharmacist />;
  // return <AddMedicineForm />;
}

export default App;
