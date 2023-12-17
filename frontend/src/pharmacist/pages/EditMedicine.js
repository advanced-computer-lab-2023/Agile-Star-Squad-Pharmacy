import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import medicinalUseEnum from '../../shared/util/MedicinalUseEnum';
import Modal from '../../shared/components/Modal/Modal';
import styles from '../components/AddMedicine.module.css';
import axios from 'axios';

const EditMedicine = () => {
  const location = useLocation();
  const { medicine } = location.state || {};
  const [name, setName] = useState(medicine.name || '');
  const [ingredients, setIngredients] = useState(medicine.activeIngredient);
  const [price, setPrice] = useState(medicine.price || 0);
  const [quantity, setQuantity] = useState(medicine.quantity || 0);
  const [sales, setSales] = useState(medicine.sales || 0);

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

  const handleArchive = async () => {
    const id = medicine.id;
    const response = await axios
      .patch(`http://localhost:4000/medicine/archive/${id}`, {
        withCredentials: true,
      })
      .then(() => alert('Medicine has been archived'))
      .catch((err) => {
        console.error(err);
      });
  };

  const handleSave = async () => {
    const id = medicine.id;
    const dataToUpdate = {};

    if (name) {
      dataToUpdate.name = name;
    }

    if (ingredients) {
      // Convert ingredients to an array
      dataToUpdate.activeIngredients = ingredients
        .split(',')
        .map((ingredient) => ingredient.trim());
    }

    if (price) {
      dataToUpdate.price = price;
    }

    if (quantity) {
      dataToUpdate.quantity = quantity;
    }

    if (sales) {
      dataToUpdate.sales = sales;
    }

    await axios
      .patch(`http://localhost:4000/medicine/${id}`, dataToUpdate, {
        withCredentials: true,
      })
      .then(() => alert('Medicine updated successfully'))
      .catch((err) => {
        console.error(err);
      });
  };
  return (
    <Modal>
      <div className={styles.titleContainer}>
        <h2 className={styles.addMedicineText}>Edit Medicine</h2>
      </div>
      <div>
        <label className={styles.label}>Medicine Name</label>
        <input
          className={styles.input}
          value={name}
          type="text"
          onChange={handleNameChange}
          required
        />
      </div>
      <div>
        <label className={styles.label}>
          Active Ingredients &nbsp;
        </label>
        <input
          className={styles.input}
          value={ingredients}
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
            value={price}
            type="text"
            onChange={handlePriceChange}
            required
          />
        </div>
        <div className={styles.inlineItem}>
          <label className={styles.label}>Profit (L.E.)</label>
          <input
            className={styles.input}
            value={sales}
            type="text"
            onChange={handleSalesChange}
            required
          />
        </div>
        <div className={styles.inlineItem}>
          <label className={styles.label}>Quantity</label>
          <input
            className={styles.input}
            value={quantity}
            type="text"
            onChange={handleQuantityChange}
            required
          />
        </div>
      </div>
      <label className={styles.label}>Image</label>
      <div className={styles.imageAndChangeContainer}>
        <div className={styles.imageContainer}>
          <img
            className={styles.imageContainer}
            src={medicine.image}
            alt="Image"
          />
        </div>
        <button className={styles.changeButton}>Change</button>
      </div>
      <div className={styles.saveButtonContainer}>
        <div>
          <button onClick={handleArchive} className={styles.archiveButton}>
            ARCHIVE
          </button>
        </div>
        <div>
          <button onClick={handleSave} className={styles.saveButton}>
            SAVE
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditMedicine;
