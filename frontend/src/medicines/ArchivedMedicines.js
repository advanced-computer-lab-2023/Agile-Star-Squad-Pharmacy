import React, { useState, useEffect } from 'react';
import styles from './ArchivedMedicines.module.css';
import NavBar from '../shared/components/NavBar/NavBar';
import axios from 'axios';
import { toastMeError } from '../shared/util/functions';

const ArchivedMedicines = () => {
  const [archivedMedicines, setArchivedMedicines] = useState([]);
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [medicineName, setMedicineName] = useState('');
  const [originalMedicines, setOriginalMedicines] = useState([]);

  useEffect(() => {
    // Fetch archived medicines and update the state
    const fetchArchivedMedicines = async () => {
      // Replace the following line with your logic to fetch archived medicines
      const response = await axios
        .get('http://localhost:4000/medicine', {
          withCredentials: true,
        })
        .catch((err) => {
          console.error(err);
        });
      setArchivedMedicines(response.data.data.medicines);
      setOriginalMedicines(response.data.data.medicines);
    };
    fetchArchivedMedicines();
  }, []); //

  const handleCheckboxChange = (id) => {
    setSelectedMedicines((prevSelected) => {
      console.log(selectedMedicines);
      if (prevSelected.includes(id)) {
        // If already selected, remove it
        return prevSelected.filter((selectedId) => selectedId !== id);
      } else {
        // If not selected, add it
        return [...prevSelected, id];
      }
    });
  };

  const handleMedicineNameChange = (e) => {
    setMedicineName(e.target.value);
  };

  const handleSearchMedicineName = () => {
    if (medicineName === '') {
      // If empty, set the displayed medicines back to the original list
      setArchivedMedicines(originalMedicines);
    } else {
      // Filter medicines based on the medicineName state
      const filteredMedicines = originalMedicines.filter((medicine) =>
        medicine.name.toLowerCase().includes(medicineName.toLowerCase())
      );

      // Update the state with the filtered medicines
      setArchivedMedicines(filteredMedicines);
    }
  };

  const unarchiveHandler = async () => {
    try {
      if (selectedMedicines.length === 0) {
        //alert('Please select at least one medicine to unarchive.');
        toastMeError(`Please select at least one medicine to unarchive.`);
        return;
      }

      const unarchiveRequests = selectedMedicines.map(async (id) => {
        console.log(id);
        const response = await fetch(
          `http://localhost:4000/medicine/unarchive/${id}`,
          {
            method: 'PATCH',
            headers: { 'Content-type': 'application/json' },
          },
          { credentials: 'include' }
        );

        console.log(response.data);
      });

      // Wait for all requests to complete
      await Promise.all(unarchiveRequests);

      const updatedResponse = await axios.get(
        'http://localhost:4000/medicine',
        {},
        {
          withCredentials: true,
        }
      );

      setArchivedMedicines(updatedResponse.data.data.medicines);
      setOriginalMedicines(updatedResponse.data.data.medicines);
      console.log(archivedMedicines);
      setSelectedMedicines([]);
    } catch (error) {
      console.error('Error unarchiving medicines:', error);
    }
  };

  const handleEnter = (event) => {
    if (event.key == "Enter") {
      handleSearchMedicineName();
    }
  }

  return (
    <>
      <div>
        <NavBar />
      </div>
      <div className={styles.container}>
        <h1 className={styles.title}>Archived Medicines</h1>
        <div className={styles.searchAndUnarchiveContainer}>
          <div className={styles.searchContainer}>
            <button
              className={styles.searchButton}
              onClick={handleSearchMedicineName}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="35"
                height="36"
                viewBox="0 0 35 36"
                fill="none"
              >
                <g filter="url(#filter0_d_969_2522)">
                  <path
                    d="M20.3802 16.7389H19.8506L19.6629 16.549C20.0819 16.0382 20.388 15.4367 20.5596 14.7873C20.7311 14.1379 20.7637 13.4567 20.655 12.7926C20.34 10.837 18.7848 9.27536 16.9078 9.03618C16.248 8.94858 15.5778 9.02055 14.9485 9.24658C14.3192 9.47261 13.7475 9.84671 13.2772 10.3403C12.8069 10.8338 12.4504 11.4337 12.235 12.0941C12.0196 12.7544 11.951 13.4578 12.0345 14.1502C12.2624 16.1199 13.7506 17.7519 15.6141 18.0825C16.247 18.1965 16.8961 18.1622 17.5149 17.9823C18.1337 17.8023 18.707 17.481 19.1937 17.0414L19.3747 17.2383V17.7941L22.2236 20.7837C22.4985 21.0721 22.9476 21.0721 23.2224 20.7837C23.4973 20.4953 23.4973 20.024 23.2224 19.7356L20.3802 16.7389ZM16.3582 16.7389C14.689 16.7389 13.3416 15.325 13.3416 13.5734C13.3416 11.8218 14.689 10.4079 16.3582 10.4079C18.0273 10.4079 19.3747 11.8218 19.3747 13.5734C19.3747 15.325 18.0273 16.7389 16.3582 16.7389Z"
                    fill="#3D64FD"
                  />
                </g>
                <defs>
                  <filter
                    id="filter0_d_969_2522"
                    x="-5.29412"
                    y="-5.47059"
                    width="46.5882"
                    height="46.5882"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                  >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dy="2.82353" />
                    <feGaussianBlur stdDeviation="5.64706" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0.85098 0 0 0 0 0.85098 0 0 0 0 0.85098 0 0 0 0.32 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow_969_2522"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_dropShadow_969_2522"
                      result="shape"
                    />
                  </filter>
                </defs>
              </svg>
            </button>
            <input
              className={styles.searchBar}
              type="text"
              placeholder="Medicine Name"
              value={medicineName}
              onKeyDown={handleEnter}
              onChange={handleMedicineNameChange}
            />
          </div>
          <button className={styles.unarchiveButton} onClick={unarchiveHandler}>
            Unarchive
          </button>
        </div>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead className={styles.tableHead}>
              <tr>
                <th>Select</th>
                <th>Medicine Name</th>
                <th>Price</th>
                <th>Sales</th>
                <th>Quantity</th>
                <th>Medicinal Use</th>
              </tr>
            </thead>
            <tbody>
              {archivedMedicines.map((medicine) =>
                medicine.archived ? (
                  <tr key={medicine.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedMedicines.includes(medicine._id)}
                        onChange={() => handleCheckboxChange(medicine._id)}
                      />
                    </td>
                    <td>{medicine.name}</td>
                    <td>{medicine.price}</td>
                    <td>{medicine.sales}</td>
                    <td>{medicine.quantity}</td>
                    <td>{medicine.medicinalUse}</td>
                  </tr>
                ) : null
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ArchivedMedicines;
