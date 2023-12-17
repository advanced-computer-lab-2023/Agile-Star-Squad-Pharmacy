import React, { useContext, useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import YearlySalesChart from '../ManageUsers/components/YearlySalesChart';
import styles from '../Home/AdminHome.module.css';

const SalesReport = (props) => {
    const [currentYearSales, setCurrentYearSales] = useState(0);
    const [prevYearSales, setPrevYearSales] = useState(0);
    const [percentageChange, setPercentageChange] = useState(0);
    const [changeSign, setChangeSign] = useState('');
    const [orders, setOrders] = useState([]);
  
    // Fetch all orders
    const fetchAllOrders = async () => {
      try {
        const response = await fetch('http://localhost:4000/admins/orders');
        const data = await response.json();
        const fetchedOrders = data.data.orders;
        setOrders(fetchedOrders);
        console.log(fetchedOrders);
        return fetchedOrders;
      } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
      }
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
      
          // Update state variables
          setCurrentYearSales(salesForThisYearByMonth);
          setPrevYearSales(salesForLastYearByMonth);
          setPercentageChange(calculatedPercentageChange);
          setChangeSign(calculatedChangeSign);
        };
      
        fetchOrders();
      }, []);
    console.log(currentYearSales+"ppppp"+prevYearSales+"lllll");
    return(
        <>
        <Container className={styles.rev}>

        </Container>
        <Container className={styles.revenue}>
        <h2 className={styles.revTitle}>Sales in Year</h2>
        <div className={styles.chart}>
        <YearlySalesChart
      currentYearSales={currentYearSales}
      prevYearSales={prevYearSales}
    />
    </div>
        </Container>
        </>
    );

}
export default  SalesReport;