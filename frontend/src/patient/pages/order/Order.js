import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import styles from './Orders.module.css';
import { useNavigate } from 'react-router-dom';
import UserContext from '../../../user-store/user-context';
import NavBar from '../../../shared/components/NavBar/NavBar';
import ConfirmationModal from '../../../shared/components/ConfirmationModal/ConfirmationModal';

const Order = () => {
  const user = useContext(UserContext);
  const patientId = user.userId;
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [orders, setOrders] = useState([]);
  const [id, setId] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await axios
        .get(`http://localhost:4000/orders/patient/${patientId}`, {
          withCredentials: true,
        })
        .catch((err) => {
          console.error(err);
        });
      setOrders(res.data);
    };
    fetchOrders();
  }, []);

  const handleCancel = async () => {
    console.log(id);
    try {
      await axios.delete(`http://localhost:4000/orders/${id}`, {
        withCredentials: true,
      });
      setOrders((prev) => prev.filter((order) => order._id != id));
      setShowConfirmModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    const fetchMedicines = async () => {
      const res = await axios
        .get(`http://localhost:4000/medicine`, { withCredentials: true })
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
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <>
      {showConfirmModal && (
        <ConfirmationModal
          exit={() => {
            setShowConfirmModal(false);
          }}
          text={'Cancel order'}
          confirm={handleCancel}
        />
      )}
      <div>
        <a className={styles.backArrow} href="/HomePage">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="23"
            height="14"
            viewBox="0 0 23 14"
            fill="none"
          >
            <path
              d="M1.59583 1.53345L11.9077 11.9807L22.2571 1.57064"
              stroke="black"
              strokeOpacity="0.6"
              strokeWidth="2.04827"
            />
          </svg>
        </a>
        <NavBar />
      </div>
      <div className={styles.container}>
        <h1 className={styles.title}>Orders</h1>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead className={styles.tableHead}>
              <tr>
                <th>Order ID</th>
                <th>Medicine Image</th>
                <th>Medicine Name</th>
                <th>Quantity</th>
                <th>Issue Date</th>
                <th>Delivery Date</th>
                <th>Total Cost</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) =>
                order.medicineList.map((medicine, index) => (
                  <tr>
                    {index === 0 && ( // Display Action only once for multiple medicines in the same order
                      <td rowSpan={order.medicineList.length}>
                        <td>{order._id}</td>
                      </td>
                    )}
                    <td>
                      <img
                        src={
                          medicines.find((m) => m._id === medicine.medicineId)
                            ?.image
                        }
                        alt={getMedicineById(medicine.medicineId)}
                        width="50"
                        height="50"
                      />
                    </td>
                    <td>{getMedicineById(medicine.medicineId)}</td>
                    <td>{medicine.count}</td>
                    <td>{formatDate(order.issueDate)}</td>
                    <td>{formatDate(order.deliveryDate)}</td>
                    {index === 0 && ( // Display Action only once for multiple medicines in the same order
                      <td rowSpan={order.medicineList.length}>
                        <td>{order.totalCost}</td>
                      </td>
                    )}
                    <td>{order.status}</td>
                    {index === 0 && ( // Display Action only once for multiple medicines in the same order
                      <td rowSpan={order.medicineList.length}>
                        <button
                          className={styles.button}
                          onClick={(id) => {
                            setId(order._id);
                            setShowConfirmModal(true);
                          }}
                        >
                          Cancel
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Order;
