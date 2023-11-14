import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import styles from './Orders.module.css';
import { useNavigate } from 'react-router-dom';
import UserContext from '../../../user-store/user-context';

const Order = () => {
  const user = useContext(UserContext);
  const patientId = user.userId;
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await axios
        .get(`http://localhost:4000/orders/patient/${patientId}`, {withCredentials: true})
        .catch((err) => {
          console.error(err);
        });
      setOrders(res.data);
    };
    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/orders/${id}`, {withCredentials: true});
      setOrders((prev) => prev.filter((order) => order._id != id));
    } catch (error) {
      console.error(error);
    }
  };

  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    const fetchMedicines = async () => {
      const res = await axios
        .get(`http://localhost:4000/medicine`, {withCredentials: true})
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

  const toPrevious = () => {
    navigate(-1);
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Orders</h1>
      <button onClick={toPrevious}>Back</button>
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
