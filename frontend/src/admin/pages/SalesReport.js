import React, { useContext, useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import YearlySalesChart from '../ManageUsers/components/YearlySalesChart';
import styles from '../ManageUsers/components/SalesReport.module.css';
import UserContext from '../../user-store/user-context';
import AdminNavBar from '../ManageUsers/components/AdminNavBar';
import arrowUp from '../arrow-up.png';
import arrowDown from '../arrow-down.png';
import arrows from '../arrows.png';
import axios from 'axios';
import Navbar from '../../shared/components/NavBar/NavBar';

const SalesReport = () => {
    const [currentYearSales, setCurrentYearSales] = useState([]);
    const [prevYearSales, setPrevYearSales] = useState([]);
    const [percentageChange, setPercentageChange] = useState(0);
    const [monthlyProfit, setMonthlyProfit] = useState(0);
    const [monthlySales, setMonthlySales] = useState(0);
    const [changeSign, setChangeSign] = useState('');
    const [orders, setOrders] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [medicines, setMedicines] = useState([]);
    const userCtx = useContext(UserContext);
    const totalOrders= recentOrders.length;
    const [pastYearProfit,setPastYearProfit]=useState(0);
    const [curYearProfit,setCurYearProfit]=useState(0);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // Initialize with the current month
    const curYearRevenue = Math.round((curYearProfit) * 0.8);
    const pastYearRevenue = Math.round((pastYearProfit) * 0.8); 
    const [selectedMonthO, setSelectedMonthO] = useState(new Date().getMonth());
    const [selectedMonthOrders, setSelectedMonthOrders] = useState([]);
    const [loading, setLoading] = useState(true); // New loading state
    
   
    
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
    
    

    const fetchMedicines = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/medicine`, { withCredentials: true });
        setMedicines(res.data.data.medicines);
      } catch (err) {
        console.error(err);
      }
    };

  const getMedicineById = (id) => {
    const medicine = medicines.find((medicine) => medicine._id === id);
    return medicine
      ? { name: medicine.name, image: medicine.image }
      : { name: 'Unknown', image: 'Unknown' };
      
  };
  
  const calculateProfit = async (orders) => {
    try {
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
    } catch (error) {
      console.error('Error calculating profit:', error);
      // Handle error if needed
    }
  };

  
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
      return issueDate.getMonth() === selectedMonthO;
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
      
      const calculateSalesAndProfit = async (orders, selectedMonth) => {
        try {
          const currentDate = new Date();
          const thisYear = currentDate.getFullYear();
    
          // Filter orders for the selected month and current year
          const selectedMonthOrders = orders.filter((order) => {
            const orderMonth = new Date(order.issueDate).getMonth();
            const orderYear = new Date(order.issueDate).getFullYear();
            return orderYear === thisYear && orderMonth === selectedMonth;
          });
    
          // Calculate total sales and profit for the selected month and current year
          const totalSalesSelectedMonth = selectedMonthOrders.reduce(
            (total, order) => total + order.totalCost,
            0
          );
    
          const totalProfitSelectedMonth = selectedMonthOrders.reduce((totalProfit, order) => {
            return (
              totalProfit +
              order.medicineList.reduce((medTotal, medicine) => {
                const medProfit = medicine.profit !== undefined ? medicine.profit : 0;
                return medTotal + medProfit * medicine.count;
              }, 0)
            );
          }, 0);
    
          return {
            totalSales: totalSalesSelectedMonth,
            totalProfit: totalProfitSelectedMonth,
          };
        } catch (error) {
          console.error('Error calculating sales and profit:', error);
          // Handle error if needed
        }
      };
    
      
      
    console.log(selectedMonth);
    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
  
          const fetchedOrders = await fetchAllOrders();
          await fetchMedicines();
  
          // Other logic can be placed here if needed
  
          // Calculate profits and update state
          await calculateProfit(fetchedOrders);
          const { totalSales, totalProfit } = await calculateSalesAndProfit(
            fetchedOrders,
            selectedMonth
          );
  
          // Update state with the calculated values
          setMonthlySales(totalSales);
          setMonthlyProfit(totalProfit);
  
          // Calculate sales for this year and last year
          const {
            salesForThisYearByMonth,
            salesForLastYearByMonth,
            percentageChange: calculatedPercentageChange,
            changeSign: calculatedChangeSign,
          } = calculateSalesForYearAndLastYear(fetchedOrders);
  
          // Update state with the calculated values
          setCurrentYearSales(salesForThisYearByMonth);
          setPrevYearSales(salesForLastYearByMonth);
          setPercentageChange(calculatedPercentageChange);
          setChangeSign(calculatedChangeSign);
  
          // Get recent orders and update state
          const recentOrdersData = getRecentOrders(fetchedOrders);
          setRecentOrders(recentOrdersData);
  
          setLoading(false);
        } catch (error) {
          console.error('Error fetching and processing data:', error);
          // Handle error if needed
          setLoading(false);
        }
      };
  
      fetchData();
    }, [selectedMonth]);
  
    return(
        <>
        {userCtx.role === 'admin' && <AdminNavBar />}
      {userCtx.role === 'pharmacist' && <Navbar />}
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
        <Container className={styles.monthly} >
          <select className={styles.pickMonth }value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))}>
           
    {Array.from({ length: 12 }, (_, i) => (
      <option key={i} value={i}>
        {new Date(0, i).toLocaleDateString('en-US', { month: 'long' })}
      </option>
    ))}
  </select>
  {/* <img src={arrows} className={styles.arrows}></img> */}
<h2 className={styles.salesT}>Monthly Profit</h2>
        <h2 className={styles.cur}>{monthlyProfit} </h2>
        <h2 className={styles.salesT}>Monthly Sales</h2>
        <h2 className={styles.cur}>{monthlySales} </h2>

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
          
  <h2 className={styles.salesT}>Monthly Orders</h2>
  <h2 className={styles.ordersT}>Total: {totalOrders} orders</h2>
  <select className={styles.pickMonthOrders }value={selectedMonthO} onChange={(e) => setSelectedMonthO(parseInt(e.target.value))}>
  {Array.from({ length: 12 }, (_, i) => (
      <option key={i} value={i}>
        {new Date(0, i).toLocaleDateString('en-US', { month: 'long' })}
      </option>
    ))}
  </select>
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