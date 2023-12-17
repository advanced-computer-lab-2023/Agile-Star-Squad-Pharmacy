import React, { useState } from 'react';
import medicinalUseEnum from '../../shared/util/MedicinalUseEnum';
import Modal from '../../shared/components/Modal/Modal';
import styles from '../components/AddMedicine.module.css';
import axios from 'axios';

const AddMedicine = () => {
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [sales, setSales] = useState(0);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleActiveIngredientsChange = (event) => {
    setIngredients(event.target.value);
  };

  // const handleDescriptionChange = (event) => {
  //   this.setState({
  //     description: event.target.value,
  //   });
  // };

  const handlePriceChange = (event) => {
    setPrice(event.target.value);
  };
  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
  };

  const handleSalesChange = (event) => {
    setSales(event.target.value);
  };

  const handleSave = async () => {
    // Check if any of the required fields is empty
    if (!name || !ingredients || !price || !quantity || !sales) {
      alert('Please fill in all the fields before saving.');
      return;
    }

    const response = await axios
      .post(
        'http://localhost:4000/medicine',
        {
          name,
          activeIngredients: ingredients,
          price,
          quantity,
          sales,
        },
        { withCredentials: true }
      )
      .then(() => {
        alert('Medicine added successfully');
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <Modal>
      <div className={styles.titleContainer}>
        <h2 className={styles.addMedicineText}>Add Medicine</h2>
      </div>
      <div>
        <label className={styles.label}>Medicine Name</label>
        <input
          className={styles.input}
          type="text"
          onChange={handleNameChange}
          required
        />
      </div>
      <div>
        <label className={styles.label}>Active Ingredients &nbsp;</label>
        <input
          className={styles.input}
          type="text"
          onChange={handleActiveIngredientsChange}
          required
        />
      </div>
      <div className={styles.inlineContainer}>
        <div className={styles.inlineItem}>
          <label className={styles.label}>Sale Price</label>
          <input
            className={styles.input}
            type="text"
            onChange={handlePriceChange}
            required
          />
        </div>
        <div className={styles.inlineItem}>
          <label className={styles.label}>Profit (L.E.)</label>
          <input
            className={styles.input}
            type="text"
            onChange={handleSalesChange}
            required
          />
        </div>
        <div className={styles.inlineItem}>
          <label className={styles.label}>Quantity</label>
          <input
            className={styles.input}
            type="text"
            onChange={handleQuantityChange}
            required
          />
        </div>
      </div>
      <label className={styles.label}>Image</label>
      <div className={styles.imageAndChangeContainer}>
        <div className={styles.imageContainer2}>
          <svg
            style={{ marginTop: '10%' }}
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="34"
            viewBox="0 0 40 34"
            fill="none"
          >
            <path
              d="M20.9065 8.37525L20.9956 8.40056L21.0017 8.39393C21.2673 8.42371 21.5294 8.26915 21.6109 8.00725C22.2708 5.89536 24.3537 4.41276 26.6813 4.41276C26.9882 4.41276 27.2497 4.17394 27.2497 3.86429C27.2497 3.55463 26.9882 3.31582 26.6813 3.31582C23.7673 3.31582 21.3122 5.16416 20.5228 7.6907C20.4298 7.98795 20.6099 8.29099 20.9065 8.37525Z"
              fill="#193842"
              stroke="#F9FFF9"
              stroke-width="0.3"
            />
            <path
              d="M32.5378 23.3893H30.0277C29.7967 23.3893 29.6093 23.2109 29.6093 22.9909C29.6093 22.7708 29.7967 22.5924 30.0277 22.5924H32.5378C35.9978 22.5924 38.8131 19.911 38.8131 16.6154C38.8131 13.3198 35.9978 10.6384 32.5378 10.6384H32.4774C32.3561 10.6384 32.2407 10.5883 32.1612 10.5009C32.0817 10.4135 32.0459 10.2977 32.0632 10.1833C32.1006 9.93509 32.1194 9.68576 32.1194 9.44299C32.1194 6.58684 29.6795 4.26288 26.6808 4.26288C25.5142 4.26288 24.4016 4.61012 23.4633 5.2673C23.2571 5.4116 22.9643 5.34756 22.845 5.13153C20.1876 0.311806 13.2467 -0.335434 9.64815 3.85731C8.13224 5.62365 7.53662 7.92137 8.0139 10.1608C8.06649 10.4081 7.86777 10.6387 7.60391 10.6387H7.43627C3.97621 10.6387 1.16097 13.3201 1.16097 16.6157C1.16097 19.9113 3.97621 22.5927 7.43627 22.5927H9.94636C10.1774 22.5927 10.3647 22.7711 10.3647 22.9912C10.3647 23.2112 10.1774 23.3896 9.94636 23.3896H7.43627C3.51477 23.3896 0.324219 20.3507 0.324219 16.6157C0.324219 12.9853 3.33813 10.0128 7.10786 9.84882C6.75375 7.52545 7.43089 5.18189 9.0003 3.35297C12.853 -1.13633 20.2365 -0.633136 23.3577 4.37275C24.3534 3.77818 25.4928 3.46627 26.6806 3.46627C30.3137 3.46627 33.1926 6.41152 32.9407 9.85254C36.6757 10.0521 39.6496 13.009 39.6496 16.6154C39.6496 20.3507 36.4591 23.3893 32.5376 23.3893L32.5378 23.3893Z"
              fill="#193842"
            />
            <path
              d="M9.32266 22.766C9.32266 28.3486 14.0887 32.8778 19.9316 32.8778C25.7746 32.8778 30.5406 28.3485 30.5406 22.766C30.5406 17.1834 25.7746 12.6542 19.9316 12.6542C14.0886 12.6542 9.32266 17.1834 9.32266 22.766ZM10.4596 22.766C10.4596 17.8023 14.7019 13.7513 19.9316 13.7513C25.1613 13.7513 29.4037 17.8022 29.4037 22.766C29.4037 27.7297 25.1613 31.7807 19.9316 31.7807C14.702 31.7807 10.4596 27.7297 10.4596 22.766Z"
              fill="#193842"
              stroke="#F9FFF9"
              stroke-width="0.3"
            />
            <path
              d="M19.6664 26.776C19.6664 27.0267 19.8777 27.2177 20.1227 27.2177C20.3676 27.2177 20.579 27.027 20.579 26.776V19.1911C20.579 18.9404 20.3677 18.7494 20.1227 18.7494C19.8777 18.7494 19.6664 18.9404 19.6664 19.1911V26.776Z"
              fill="#193842"
              stroke="#483EA8"
              stroke-width="0.3"
            />
            <path
              d="M22.252 21.8403C22.3415 21.9255 22.4578 21.9672 22.572 21.9672L19.9052 18.9854L19.8018 18.8768L19.8017 18.8769L17.3515 21.2105C17.1698 21.3836 17.1698 21.6673 17.3515 21.8403C17.529 22.0094 17.8141 22.0096 17.9916 21.8403C17.9916 21.8403 17.9916 21.8403 17.9916 21.8403C17.9917 21.8403 17.9917 21.8403 17.9917 21.8403L20.1218 19.8114L22.252 21.8403Z"
              fill="#193842"
              stroke="#483EA8"
              stroke-width="0.3"
            />
          </svg>
          <p className={styles.dragAndDrop}>Drag & drop files or Browse</p>
          <p className={styles.supportedFormats}>
            Supported formats: JPEG, PNG
          </p>
        </div>
      </div>
      <div className={styles.saveButtonContainer2}>
        <button onClick={handleSave} className={styles.saveButton}>
          SAVE
        </button>
      </div>
    </Modal>
  );
};

export default AddMedicine;
