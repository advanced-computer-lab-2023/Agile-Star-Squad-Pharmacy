import React, { useContext, useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import YearlySalesChart from '../ManageUsers/components/YearlySalesChart';
import styles from '../Home/AdminHome.module.css';
import UserContext from '../../user-store/user-context';
import AdminNavBar from '../ManageUsers/components/AdminNavBar';
import arrowUp from '../arrow-up.png';
import arrowDown from '../arrow-down.png';
import axios from 'axios';

const SalesReport = () => {
    const [currentYearSales, setCurrentYearSales] = useState([]);
    const [prevYearSales, setPrevYearSales] = useState([]);
    const [percentageChange, setPercentageChange] = useState(0);
    const [changeSign, setChangeSign] = useState('');
    const [orders, setOrders] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [medicines, setMedicines] = useState([]);
    const userCtx = useContext(UserContext);
    const totalOrders= recentOrders.length;
    const [pastYearProfit,setPastYearProfit]=useState(0);
    const [curYearProfit,setCurYearProfit]=useState(0);
   
    
    
    const sumSales = (sales) => {
      // Use reduce to sum up all numbers in the sales array
      const totalSales = sales.reduce((sum, value) => sum + value, 0);
      return totalSales;
    };
    const curYearRevenue = Math.round((curYearProfit) * 0.8);
    const pastYearRevenue = Math.round((pastYearProfit) * 0.8); 
    
   
    
    // Fetch all orders
    const fetchAllOrders = async () => {
      try {
        const response = await fetch('http://localhost:4000/admins/orders');
        const data = await response.json();
        const fetchedOrders = data.data.orders;
        setOrders(fetchedOrders);
        return fetchedOrders;
      } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
      }
    };
    
    

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


 console.log(orders);
  const getMedicineById = (id) => {
    const medicine = medicines.find((medicine) => medicine._id === id);
    return medicine
      ? { name: medicine.name, image: medicine.image }
      : { name: 'Unknown', image: 'Unknown' };
      
  };
  const calculateProfit = (orders) => {
    const currentDate = new Date();
    const lastYear = currentDate.getFullYear() - 1;
    const thisYear = currentDate.getFullYear();
  
    // Filter orders for the past year
    const pastYearOrders = orders.filter((order) => {
      const orderYear = new Date(order.issueDate).getFullYear();
      return orderYear === lastYear;
    });
  
    const curYearOrders = orders.filter((order) => {
      const orderYear = new Date(order.issueDate).getFullYear();
      return orderYear === thisYear;
    });
  
    // Calculate total profit for the past year
    const totalProfitPast = pastYearOrders.reduce((total, order) => {
      return (
        total +
        order.medicineList.reduce((medTotal, medicine) => {
          // Check if the medicine has profit information
          const medProfit = medicine.profit !== undefined ? medicine.profit : 0;
          return medTotal + medProfit * medicine.count;
        }, 0)
      );
    }, 0);
  
    // Calculate total profit for the current year
    const totalProfitCurr = curYearOrders.reduce((total, order) => {
      return (
        total +
        order.medicineList.reduce((medTotal, medicine) => {
          // Check if the medicine has profit information
          const medProfit = medicine.profit !== undefined ? medicine.profit : 0;
          return medTotal + medProfit * medicine.count;
        }, 0)
      );
    }, 0);
  
    setCurYearProfit(totalProfitCurr);
    setPastYearProfit(totalProfitPast);
  };
  
  console.log(curYearProfit+"kkk"+pastYearProfit);
  
  const calculatePercentageChange = (previousValue, currentValue) => {
    if (previousValue === 0) {
      return currentValue > 0 ? 100 : 0;
    }
    const percentageChange = ((currentValue - previousValue) / Math.abs(previousValue)) * 100;
    return parseFloat(percentageChange.toFixed(2));
  };
  

  const revenuePercentageChange = calculatePercentageChange(pastYearRevenue, curYearRevenue);
  const profitPercentageChange = calculatePercentageChange(pastYearProfit, curYearProfit);

   const getRecentOrders = (allOrders, allMedicines) => {
  const currentDate = new Date();
  const twoWeeksAgo = new Date(currentDate.getTime() - 14 * 24 * 60 * 60 * 1000);

  const recentOrders = allOrders
    .filter((order) => {
      const issueDate = new Date(order.issueDate);
      return issueDate >= twoWeeksAgo;
    })
    .map((order) => {
      const itemCount = order.medicineList.reduce((total, medicine) => total + medicine.count, 0);

      // Get names of all medicines in the order
      const medicineNames = order.medicineList.map((medicine) => {
        // Use the getMedicineById function to get the name
        return getMedicineById(medicine.medicineId);
      });

      return {
        ...order,
        itemCount,
        medicineNames,
      };
    });

  return recentOrders;
};



    const calculateSalesForYearAndLastYear = (orders) => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const lastYear = currentYear - 1;
      
        // Initialize arrays for each month
        const salesForThisYearByMonth = Array(12).fill(0);
        const salesForLastYearByMonth = Array(12).fill(0);
      
        // Calculate sales for this year and last year by month
        orders.forEach((order) => {
          const orderDate = new Date(order.issueDate);
          const orderYear = orderDate.getFullYear();
          const orderMonth = orderDate.getMonth();
      
          if (orderYear === currentYear) {
            salesForThisYearByMonth[orderMonth] += order.totalCost;
          } else if (orderYear === lastYear) {
            salesForLastYearByMonth[orderMonth] += order.totalCost;
          }
        });
      
        // Calculate percentage change
        const percentageChange = (
          (salesForThisYearByMonth.reduce((total, value) => total + value, 0) -
            salesForLastYearByMonth.reduce((total, value) => total + value, 0)) /
          salesForLastYearByMonth.reduce((total, value) => total + value, 0)
        ) * 100;
      
        // Determine the sign for the percentage change
        const changeSign = percentageChange > 0 ? '+' : percentageChange < 0 ? '-' : '';
      
        return {
          salesForThisYearByMonth,
          salesForLastYearByMonth,
          percentageChange,
          changeSign,
        };
      };
      
      // ...
      
    
useEffect(() => {
    // Fetch orders and calculate sales for this year and last year
    const fetchOrders = async () => {
      const fetchedOrders = await fetchAllOrders(); // Assuming you have fetchAllOrders function
      const {
        salesForThisYearByMonth,
        salesForLastYearByMonth,
        percentageChange: calculatedPercentageChange,
        changeSign: calculatedChangeSign,
      } = calculateSalesForYearAndLastYear(fetchedOrders);
   
  
      calculateProfit(orders);
      setCurrentYearSales(salesForThisYearByMonth);
      setPrevYearSales(salesForLastYearByMonth);
      setPercentageChange(calculatedPercentageChange);
      setChangeSign(calculatedChangeSign);
      const recentOrders = getRecentOrders(fetchedOrders);
      setRecentOrders(recentOrders);
    };
  
    fetchOrders();
  }, []);
  
    return(
        <>
        <AdminNavBar/>
        <div >
        <Container className={styles.rev}>
        <h2 className={styles.salesT}>Revenue</h2>
        <h2 className={styles.change}>{revenuePercentageChange} %</h2> 
        <h2 className={styles.cur}>{curYearRevenue}</h2>
        <h4 className={styles.prev}>{pastYearRevenue}  last year  </h4>
        <img src={arrowUp} className={styles.arrow}></img> 
        </Container>
        <Container className={styles.profit}>
        
        <h2 className={styles.salesT}>Profit</h2>
        <h2 className={styles.cur}>{curYearProfit} </h2>
        <h4 className={styles.prev}>{pastYearProfit} last year</h4>
        <h2 className={styles.change}>{profitPercentageChange} %</h2>
        {profitPercentageChange > 0 ? (
 <img src={arrowUp} className={styles.arrow}></img>
) : (
  <img src={arrowDown} className={styles.arrow}></img>
)}

        
        </Container>
        <div className={styles.parentContainer}>
        <Container className={styles.yearly}>
          <h2 className={styles.salesT}>Sales in Year</h2>
          <div className={styles.chart}>
            <YearlySalesChart
              currentYearSales={currentYearSales}
              prevYearSales={prevYearSales}
            />
          </div>
        </Container>
        <Container className={styles.recentOrders}>
  <h2 className={styles.salesT}>Recent Orders</h2>
  <h2 className={styles.ordersT}>Total: {totalOrders} orders</h2>
  <table className={styles.orderTable}>
   
  <tbody>
  {recentOrders.map((order) => (
    <tr key={order._id}>
      <td>
        {/* Display image of the first medicine */}
        {order.medicineNames.length > 0 && (
          <div>
            <img
              src={order.medicineNames[0].image}
              alt={order.medicineNames  .name}
              className={styles.medicineImage}
            />
            <div>{order.itemCount}items</div>
          </div>
        )}
      </td>
      <td>
        
        {order.medicineNames.length > 0 && (
          <div>
            {order.medicineNames.map((medicine, index) => (
              <span key={index} className={styles.medicineName}>
                {medicine.name}
                {index < order.medicineNames.length - 1 && ', '}
              </span>
            ))}
          </div>
        )}
      </td>
      <td>${order.totalCost.toFixed(2)} L.E.</td>
    </tr>
  ))}
</tbody>


  </table>
</Container>
      </div>
      </div>
        </>
    );

}
export default  SalesReport;