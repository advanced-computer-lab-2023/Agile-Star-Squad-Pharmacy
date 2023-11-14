import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Orders.module.css';

const Order = () => {
  const patientId = '6521fc7bb512c918531f7e0b';
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await axios
        .get(`http://localhost:4000/orders/patient/${patientId}`)
        .catch((err) => {
          console.error(err);
        });
      setOrders(res.data);
    };
    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/orders/${id}`);
      setOrders((prev) => prev.filter((order) => order._id != id));
    } catch (error) {
      console.error(error);
    }
  };

  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    const fetchMedicines = async () => {
      const res = await axios
        .get(`http://localhost:4000/medicine`)
        .catch((err) => {
          console.error(err);
        });
      setMedicines(res.data.data.medicines);
    };
    fetchMedicines();
  }, []);

  const getMedicineById = (id) => {
    const medicine = medicines.find((medicine) => {
      return medicine._id === id;
    });
    return medicine ? medicine.name : 'Unknown';
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Orders</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Medicine Name</th>
            <th>Medicine Image</th>
            <th>Quantity</th>
            <th>Issue Date</th>
            <th>Delivery Date</th>
            <th>Total Cost</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>
                {order.medicineList.map((medicine) => (
                  <div key={medicine.id}>
                    {getMedicineById(medicine.medicineId)}
                  </div>
                ))}
              </td>
              <td>
                {order.medicineList.map((medicine) => (
                  <div key={medicine.id}>
                    <img
                      src={
                        medicines.find((m) => m._id === medicine.medicineId)
                          ?.image
                      }
                      alt={getMedicineById(medicine.id)}
                      width="50"
                      height="50"
                    />
                  </div>
                ))}
              </td>
              <td>
                {order.medicineList.map((medicine) => (
                  <div key={medicine.medicineId}>{medicine.count}</div>
                ))}
              </td>
              <td>{order.issueDate}</td>
              <td>{order.deliveryDate}</td>
              <td>{order.totalCost}</td>
              <td>{order.status}</td>
              <td>
                <button
                  className={styles.button}
                  onClick={() => handleDelete(order._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Order;
