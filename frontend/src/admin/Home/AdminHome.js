import React, { useContext, useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserContext from '../../user-store/user-context';
import AdminNavBar from '../ManageUsers/components/AdminNavBar';
import { Table, Button, Container } from 'react-bootstrap';
import styles from './AdminHome.module.css';
import axios from 'axios';
import sale from '../sales.png';
import req from '../req.png';
import x from '../X.png';
import check from '../check.png';
import RevenueChart from '../ManageUsers/components/RevenueChart';
import UserDetails from '../ManageUsers/components/UserDetails';
import AdminForm from '../ManageUsers/components/AdminForm';
import RequestDetails from '../ManageUsers/components/RequestDetails';

const AdminHome = (props) => {
  const navigate = useNavigate();
  const userLogout = useContext(UserContext).logout;
  const [sales, setSales] = useState([]);
 

  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState(props.data ? props.data['status'] : '');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const selectedRequestRef = useRef(null);
  const [packages, setPackages] = useState([]);
  const [showUser, setShowUser] = useState(false);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeRole, setActiveRole] = useState('patient');
  const [users, setUsers] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isUserTab, setUserTab] = useState(true);
  const [showRequest, setShowRequest] = useState(false);
  const [orders, setOrders] = useState([]);
  const [salesForDay, setSalesForDay] = useState(0);
  const [salesForYesterday, setSalesForYesterday] = useState(0);
  const [currentWeekSales, setCurrentWeekSales] = useState([]);
  const [prevWeekSales, setPrevWeekSales] = useState([]);
  const [percentageChange, setPercentageChange] = useState(0);
  const [changeSign, setChangeSign] = useState('');
  const [showRequestDetails, setShowRequestDetails] = useState(false);

  useEffect(() => {
    // If data has been loaded, simulate a click on the "Patients" button
    if (setUsers) {
      handleRoleButtonClick('patient');
    }
  }, [users]);

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


// Process orders to get sales for the day and yesterday
const calculateSalesForDayAndYesterday = (orders) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // Months are zero-based, so add 1
  const currentDay = currentDate.getDate();

  // Calculate sales for today
  const salesForToday = orders
    .filter((order) => {
      const orderDate = new Date(order.issueDate); // Assuming orders have an issueDate property
      return (
        orderDate.getDate() === currentDay &&
        orderDate.getMonth() + 1 === currentMonth &&
        orderDate.getFullYear() === currentYear
      );
    })
    .reduce((totalSales, order) => totalSales + order.totalCost, 0);

  // Calculate sales for yesterday
  const yesterday = new Date(currentDate);
  yesterday.setDate(currentDay - 1);
  const salesForYesterday = orders
    .filter((order) => {
      const orderDate = new Date(order.issueDate);
      return (
        orderDate.getDate() === yesterday.getDate() &&
        orderDate.getMonth() + 1 === yesterday.getMonth() + 1 &&
        orderDate.getFullYear() === yesterday.getFullYear()
      );
    })
    .reduce((totalSales, order) => totalSales + order.totalCost, 0);

  // Calculate percentage change
  const percentageChange = ((salesForToday - salesForYesterday) / salesForYesterday) * 100;

  // Determine the sign for the percentage change
  const changeSign = percentageChange > 0 ? '+' : percentageChange < 0 ? '-' : '';

  setSalesForDay(salesForToday);
  setSalesForYesterday(salesForYesterday);

  return { salesForToday, salesForYesterday, percentageChange, changeSign };
};


useEffect(() => {
  const fetchOrders = async () => {
    const fetchedOrders = await fetchAllOrders();
    calculateSalesForDayAndYesterday(fetchedOrders);
  };

  fetchOrders();
}, []);
useEffect(() => {
  // Fetch orders and calculate sales for the day and yesterday
  const fetchOrders = async () => {
    const fetchedOrders = await fetchAllOrders(); // Assuming you have fetchAllOrders function
    const {
      percentageChange: calculatedPercentageChange,
      changeSign: calculatedChangeSign,
    } = calculateSalesForDayAndYesterday(fetchedOrders);
    
    // Update state variables
    setPercentageChange(calculatedPercentageChange);
    setChangeSign(calculatedChangeSign);
  };

  fetchOrders();
}, []);

// Process orders to get weekly sales
const calculateWeeklySales = (orders) => {
  const currentDate = new Date();
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Start of the current week (Sunday)
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(currentDate);
  endOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 6); // End of the current week (Saturday)
  endOfWeek.setHours(23, 59, 59, 999);

  const startOfPrevWeek = new Date(startOfWeek);
  startOfPrevWeek.setDate(startOfWeek.getDate() - 7); // Start of the previous week (Sunday)
  const endOfPrevWeek = new Date(endOfWeek);
  endOfPrevWeek.setDate(endOfWeek.getDate() - 7); // End of the previous week (Saturday)

  const currentWeekSales = orders
    .filter((order) => {
      const orderDate = new Date(order.issueDate); // Assuming orders have an issueDate property
      return orderDate >= startOfWeek && orderDate <= endOfWeek;
    })
    .reduce((weeklySalesData, order) => {
      const orderDate = new Date(order.issueDate);
      const dayOfWeek = orderDate.getDay();

      weeklySalesData[dayOfWeek] = (weeklySalesData[dayOfWeek] || 0) + order.totalCost;
      return weeklySalesData;
    }, Array.from({ length: 7 }, () => 0));

  const prevWeekSales = orders
    .filter((order) => {
      const orderDate = new Date(order.issueDate); // Assuming orders have an issueDate property
      return orderDate >= startOfPrevWeek && orderDate <= endOfPrevWeek;
    })
    .reduce((prevWeekSalesData, order) => {
      const orderDate = new Date(order.issueDate);
      const dayOfWeek = orderDate.getDay();

      prevWeekSalesData[dayOfWeek] = (prevWeekSalesData[dayOfWeek] || 0) + order.totalCost;
      return prevWeekSalesData;
    }, Array.from({ length: 7 }, () => 0));

  setCurrentWeekSales(currentWeekSales);
  setPrevWeekSales(prevWeekSales);
  console.log(prevWeekSales+"  "+currentWeekSales);

  return { currentWeekSales, prevWeekSales };
};

useEffect(() => {
  const fetchData = async () => {
    try {
      const fetchedOrders = await fetchAllOrders();
      const { currentWeekSales, prevWeekSales } = calculateWeeklySales(fetchedOrders);

      // Do something with salesForDay, currentWeekSales, and prevWeekSales
    } catch (error) {
      // Handle errors
    }
  };

  fetchData();
}, []); // Empty dependency array means this effect runs once on mount

  
  useEffect(() => {
    const fetchData = async () => {
      // Fetch data here
      try {
        await fetchPatients();
        await fetchPharmacists();
        await fetchAdmins();
        await fetchPendingRequests();
        await fetchPackages();

        // Set dataLoaded to true after fetching all data
        setDataLoaded(true);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts


  useEffect(() => {
    selectedRequestRef.current = selectedRequest;
  }, [selectedRequest]);

  
  
  

  const fetchPackages = async () => {
    try {
      const response = await axios.get('http://localhost:3000/packages/');
      const packagesData = response.data; // Assuming the packages are directly in the data property
      setPackages(packagesData);
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };
  const [revenueData, setRevenueData] = useState([]);


  const fetchPendingRequests = async () => {
    try {
      const response = await axios.get('http://localhost:4000/admins/requests');
      const allRequests = response.data.data.requests;
      
      // Filter only pending requests
      const pendingRequests = allRequests.filter((request) => request.status === 'Pending');
  
      // Set pending requests to the state
      setRequests(pendingRequests.map((request) => ({
        id: request['_id'],
        username: request['username'],
        name: request['name'],
        email: request['email'],
        dateOfBirth: request['dateOfBirth'],
        hourlyRate: request['hourlyRate'],
        affiliation: request['affiliation'],
        educationalBackground: request['educationalBackground'],
        status: request['status'],
        idImage: request['idImage'],
        creationDate: request['creationDate'],
        pharmacyLicense: request['pharmacyLicense'],
        pharmacyDegree: request['pharmacyDegree'],
      })));
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    }
  };
  

  const statusChangeHandler = (id, status) => {
    setRequests(
      requests.map((request) => {
        if (request.id === id) {
          request.status = status;
        }
        return request;
      })
    );
  } 

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };
  

  const accept = async (props) => {
      try {

          const requestOptions = {
              method: 'POST',
              headers: { 'Content-type': 'application/json; charset=UTF-8' },
              body: JSON.stringify({ ...props }),
          };

          const response = await fetch(
              'http://localhost:4000/admins/requests',
              requestOptions
          );

          if (response.ok) {
              // Handle a successful response
              alert('Pharmacist accepted successfully!');
              setStatus('Accepted');
              props.onStatusChange(props.id, 'Accepted');
          } else {
              // Handle errors if the server response is not ok
              alert('Accepting request Failed!');
          }
      } catch (error) {
          // Handle network errors
          alert('Network error: ' + error.message);
      }
  }

  const reject = async (props) => {
      try {
          const requestOptions = {
              method: 'PATCH',
              headers: { 'Content-type': 'application/json; charset=UTF-8' },
              body: JSON.stringify({ ...props }),
          };
          const response = await fetch(
              'http://localhost:4000/admins/requests',
              requestOptions
          );

          if (response.ok) {
              // Handle a successful response
              alert('Pharmacist rejected!');
              setStatus('Rejected');
              props.onStatusChange(props.id, 'Rejected');
          } else {
              // Handle errors if the server response is not ok
              alert('Rejecting request Failed!');
          }
      } catch (error) {
          // Handle network errors
          alert('Network error: ' + error.message);
      }
  }
 

  const editHandler = () => {
    // Navigate to the "Packages Page" when the "Edit" button is clicked
    navigate('/packages');
  };

 



  const showUserModal = (user) => {
    setSelectedUser(user);
    // Scroll to the top of the page
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // You can adjust the behavior as needed
    });
  };
  const showRequestModal = (request) => {
    setSelectedRequest(request);
    setShowRequest(true);
    // Additional logic as needed
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // You can adjust the behavior as needed
    });
  };
  
  const exitRequestModal = () => {
    setSelectedRequest(null); 
    setShowRequest(false);
  };
  

  const exitUserModal = () => {
    setSelectedUser(null);
  };
  function extractYearFromDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    return year;
  }
  const getYearColor = (year) => {
    if (year < 2000) {
      return {
        border: '1px solid #FFA500', // orange
        background: '#F0F9FF',
        color: '#FFA500',
      };
    } else if (year >= 2000 && year <= 2020) {
      return {
        border: '1px solid #0095FF',
        background: 'var(--colors-light-blue-50, #F0F9FF)',
      };
    } else if (year === 2021) {
      return {
        border: '1px solid #884DFF', // purple
        background: '#FBF1FF',
        color: '#884DFF',
      };
    } else if (year === 2022) {
      return {
        border: '1px solid #FFD700', // yellow
        background: '#FEF6E6',
        color: '#FFD700',
      };
    } else if (year === 2023) {
      return {
        border: '1px solid #00E58F', // green
        background: '#F0FDF4',
        color: '#00E58F',
      };
    } else {
      // default blue
      return {
        border: '1px solid #0095FF',
        background: '#F0F9FF',
        color: '#0095FF',
      };
    }
  };

  const formatDate = (date) => {
    // Check if date is a valid Date object
    if (!(date instanceof Date) || isNaN(date)) {
      return "";
    }
    console.log(date+'qqqqqqqqqqqqqqqq')
  
    const options = { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  
    return date.toLocaleDateString('en-US', options);
  };
  
  
  

  const logout = () => {
    userLogout();
    navigate('/');
  };

  const changePasswordHandler = () => {
    navigate('/changePassword');
  };
 



  const handleRoleButtonClick = (role) => {
    filterUsersByRole(role);
  };
  const filterUsersByRole = (role) => {
    let filtered = [];

    switch (role) {
      case 'patient':
        filtered = users.filter((user) => user.role === 'Patient');
        break;
      case 'pharmacist':
        filtered = users.filter((user) => user.role === 'Pharmacist');
        break;
      case 'admin':
        filtered = users.filter((user) => user.role === 'Admin');
        break;
      default:
        filtered = users.filter((user) => user.role === 'Patient');
        break;
    }

    setFilteredUsers(filtered);
    setActiveRole(role); // Set the active role for styling
  };
  useEffect(() => {
    filterUsersByRole(activeRole);
  }, [activeRole]);


    
  const fetchPatients = async() => {
    fetch('http://localhost:4000/patients/')
      .then(async (response) => {
        const json = await response.json();
        const patientsJson = json.data.patients;
        setUsers((val) => [
          ...val.filter((user) => user.role !== 'Patient'), // Remove existing patients
          ...patientsJson.map((patient) => {
            return {
              id: patient['_id'],
              username: patient['username'],
              name: patient['name'],
              email: patient['email'],
              dateOfBirth: patient['dateOfBirth'],
              gender: patient['gender'],
              creationDate: patient['creationDate'],
              mobileNumber: patient['mobileNumber'],
              emergencyNumber: patient['emergencyNumber'],
              role: 'Patient',
            };
          }),
        ]);
      });
  };
  
  const fetchPharmacists = async () => {
    fetch('http://localhost:4000/pharmacist/')
      .then(async (response) => {
        const json = await response.json();
        const pharmacistsJson = json.data.Pharmacists;
        setUsers((val) => [
          ...val.filter((user) => user.role !== 'Pharmacist'), // Remove existing pharmacists
          ...pharmacistsJson.map((pharmacist) => {
            return {
              id: pharmacist['_id'],
              username: pharmacist['username'],
              name: pharmacist['name'],
              email: pharmacist['email'],
              dateOfBirth: pharmacist['dateOfBirth'],
              hourlyRate: pharmacist['hourlyRate'],
              affiliation: pharmacist['affiliation'],
              creationDate: pharmacist['creationDate'],
              educationalBackground: pharmacist['educationalBackground'],
              role: 'Pharmacist',
            };
          }),
        ]);
      });
  };
  
  const fetchAdmins = async () => {
    fetch('http://localhost:4000/admins/')
      .then(async (response) => {
        const json = await response.json();
        const adminsJson = json.data.admins;
        setUsers((val) => [
          ...val.filter((user) => user.role !== 'Admin'), // Remove existing admins
          ...adminsJson.map((admin) => {
            return {
              id: admin['_id'],
              username: admin['username'],
              creationDate: admin['creationDate'],
              email: admin['email'],
              name: '-',
              mobileNumber: '-',
              role: 'Admin',
            };
          }),
        ]);
      });
  };
const handleDeleteClick = (e, username) => {
  e.stopPropagation(); // Stop event propagation to prevent triggering row click

  // Call the deleteUser function or your logic for deletion
  deleteUser(username);
};
const handleSalesClick = () =>{
  navigate('/SalesReport');
}

  
  const deleteUser = (username) => {
    const user = users.find((value) => value.username === username);
    if (user.role === 'Patient') {
      fetch(`http://localhost:4000/patients/${user.id}`, { method: 'DELETE' });
    } else if (user.role === 'Pharmacist') {
      fetch(`http://localhost:4000/pharmacist/${user.id}`, {
        method: 'DELETE',
      });
    } else if (user.role === 'Admin') {
      fetch(`http://localhost:4000/admins/${user.id}`, { method: 'DELETE' });
    }
    setUsers(users.filter((val) => val.username !== username));
  };
  const toggleAddForm = () => {
    setShowAdminForm((prevShowAddForm) => !prevShowAddForm);
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // You can adjust the behavior as needed
    });
  };
  
  const handleFormSubmitSuccess = () => {
    setShowAdminForm(false); // Close the form after successful submission
  };
  
  const exitAdminModal = () => {
    setShowAdminForm(false);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      const formElement = document.getElementById('form'); // Replace 'yourFormId' with the actual ID of your form
      if (formElement && !formElement.contains(event.target)) {
        setShowAdminForm(false); // Close the form when clicking outside of it
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setShowAdminForm]);

  
 console.log(selectedRequest+"reqqq");

  return (
    <div>
      <AdminNavBar/>
    <Container className={styles.sales} >
    <h2 className={styles.salesTitle} onClick={handleSalesClick}>Sales Report</h2>
    <section className={styles.salesSec} onClick={handleSalesClick}>
    <img
              src={sale}
              alt=""
              width= "43.333"
              height= "35.435"
              className={styles.salesImg}
              id="logo"
            />
            <div className={styles.amount}>${salesForDay}</div>
      <h4 className={styles.salesText}>Total Sales</h4>
      <h4 className={styles.yesterdaySales}>
      {percentageChange !== null && changeSign !== null && (
  <>
   {`${changeSign}${isNaN(percentageChange) ? '+0' : percentageChange >= 100 ? '100' : Math.abs(percentageChange).toFixed(2)}% from yesterday`}

  </>
)}

      </h4>
    </section>
    </Container>
    <Container className={styles.requests}>
  <h2 className={styles.ReqTitle}>Requests</h2>
  <div className="container">
    <div className="row">
      <table className="table table-hover">
        <tbody>
          {requests.map((request) => (
            <tr key={request.id}className={styles.customRow} onClick={() => showRequestModal(request)} >
              <td className={styles.req}>
                <img src={req} alt="req" />
              </td>
              <td className={styles.bold}>
      {request.name} 
      <div className={styles.small}>
      {calculateAge(request.dateOfBirth)},   { formatDate(request.creationDate )}


      </div>
    </td>
              {status.toLowerCase() === 'pending' && (
                <ActionButtons reject={() => reject(request)} accept={() => accept(request)} />
              )}
              <td className={`${styles.rejectReq} ${styles.borderBottom}`}>
                <img
                  src={x}
                  alt="req-rej"
                  className={styles.rej}
                  onClick={(e) => {
                    selectedRequest &&
                      selectedRequestRef.current &&
                      selectedRequestRef.current.reject(request);
                    e.stopPropagation(); // Stop event propagation
                    reject(request);
                  }}
                />
              </td>
              <td className={`${styles.acceptReq} ${styles.borderBottom}`}>
                <img
                  src={check}
                  width="25"
                  height="25"
                  alt="req-acc"
                  className={styles.acc}
                  onClick={(e) => {
                    selectedRequest &&
                      selectedRequestRef.current &&
                      selectedRequestRef.current.accept(request);
                    e.stopPropagation(); // Stop event propagation
                    accept(request);
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</Container>
<Container className={styles.packages}>
            <div className={styles.edit}>
              {/* <button className={styles.editButton} onClick={editHandler}>
                More
              </button> */}
            </div>
            <h2 className={styles.packageTitle}>Packages</h2>
            <div className="container">
              <div className="row">
                <Table  hover className="custom-table">
                  
                    <tr className={styles.packageTitles}>
                      <th >Package</th>
                      <th>Session Disc.</th>
                      <th>Medicine Disc.</th>
                      <th>Family Member Disc.</th>
                      <th>Price</th>
                    </tr>
                  
                  <tbody>
                    {packages.map((pkg) => (
                      <tr key={pkg._id} className="custom-row">
                        <td>{pkg.name}</td>
                        <td>{pkg.doctorSessionDiscount}%</td>
                        <td>{pkg.medicineDiscount}%</td>
                        <td>{pkg.familyMemberDiscount}%</td>
                        <td>{pkg.pricePerYear} LE</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </Container>
          <Container className={styles.revenue}>
          <h2 className={styles.revTitle}>Total Revenue</h2>
          <div className={styles.chart}>
          <RevenueChart
        currentWeekSales={currentWeekSales}
        prevWeekSales={prevWeekSales}
      />
      </div>
          </Container>
          <Container className={styles.users}>
          <div className={styles.filter}>
    {/* Buttons to filter user roles */}
    <button
      className={`${styles.filterButton} ${activeRole === 'patient' ? styles.active : ''}`}
      onClick={() => handleRoleButtonClick('patient')}
    >
      Patients
    </button>
    <button
      className={`${styles.filterButton} ${activeRole === 'pharmacist' ? styles.active : ''}`}
      onClick={() => handleRoleButtonClick('pharmacist')}
    >
      Pharmacists
    </button>
    <button
      className={`${styles.filterButton} ${activeRole === 'admin' ? styles.active : ''}`}
      onClick={() => handleRoleButtonClick('admin')}
    >
      Admins
    </button>
  </div>
  <div className="container">
  <div className="row">
  <Table   hover className={"custom-table"}>
  <tr>
  {activeRole === 'patient' && (
            <>
              <th className={styles.userTitle}>Name</th>
              <th className={styles.userTitle}>Subscription</th>
              <th className={styles.userTitle}>Email</th>
              <th className={styles.userTitle}>Member Since</th>
              {/* Add more patient-specific columns as needed */}
            </>
          )}
          {activeRole === 'pharmacist' && (
            <>
              <th className={styles.userTitle}>Name</th>
              <th className={styles.userTitle}>Affiliation</th>
              <th className={styles.userTitle}>Email</th>
              <th className={styles.userTitle}>Member Since</th>
              {/* Add more doctor-specific columns as needed */}
            </>
          )}
           {activeRole === 'admin' && (
            <>
              <th className={styles.userTitle}>Username</th>
              <th className={styles.userTitle}>Member Since</th>
            </>
          )}
          </tr>
          <tbody className={styles.userBody}>
  {filteredUsers.map((user) => (
    <tr key={user.id} className={styles.customRow} onClick={() => showUserModal(user)}>
      {/* Render user-specific cells based on the active role */}
      {activeRole === 'patient' && (
        <>
          <td className={styles.userInfo}>{user.name}</td>
          <td>{user.package ? user.package.name : 'No Subscription'}</td>
          <td>{user.email}</td>
          <td className={styles.userCell}>
            <div
              className={styles.userDate}
              style={getYearColor(extractYearFromDate(user.creationDate))}
            >
              {extractYearFromDate(user.creationDate)}
            </div>
          </td>
          {/* Add more patient-specific cells as needed */}
        </>
      )}
      {activeRole === 'pharmacist' && (
        <>
          <td className={styles.userInfo}>{user.name}</td>
          <td>{user.affiliation}</td>
          <td>{user.email}</td>
          <td className={styles.userCell}>
            <div
              className={styles.userDate}
              style={getYearColor(extractYearFromDate(user.creationDate))}
            >
              {extractYearFromDate(user.creationDate)}
            </div>
          </td>
          {/* Add more pharmacist-specific cells as needed */}
        </>
      )}
      {activeRole === 'admin' && (
        <>
          <td className={styles.userInfo}>{user.username}</td>
          <td className={styles.userCell}>
            <div
              className={styles.userDateAdmin}
              style={getYearColor(extractYearFromDate(user.creationDate))}
            >
              {extractYearFromDate(user.creationDate)}
            </div>
          </td>
        </>
      )}

      <td className={styles.userCell}>
        <button className={styles.deleteButton} onClick={(e) => handleDeleteClick(e, user.username)}>
            X
          </button>
      </td>
    </tr>
  ))}
</tbody>

  </Table>
  </div>
  </div>
          </Container>
          <Container className={styles.addAdmin}>
            <button className={styles.adminButton} onClick={toggleAddForm}>Add Admin</button>

          </Container>
          {selectedUser && (
        <UserDetails
          data={selectedUser}
          exit={exitUserModal}
          onDelete={deleteUser}
        />
      )}
      {showRequest &&(
        <RequestDetails
        data={selectedRequest}
        exit={exitRequestModal}
        />
      )}
      {showAdminForm &&(
        <div className={styles.overlay}>
        <AdminForm exit={exitAdminModal} refresh={fetchAdmins} onSubmitSuccess={handleFormSubmitSuccess} />
        </div>
      )}
      
       
      

     
      {/* <Link to="/admin/manage">
        <button>Manage Users</button>
      </Link>
      <Link to="/pharmacy/home">
        <button>Go to Pharmacy</button>
      </Link>
      <button onClick={logout}>Logout</button>
      <button onClick={changePasswordHandler}>change password</button> */}
    </div>
  );
};
// ActionButtons component
const ActionButtons = (props) => {
  return (
    <div className="d-flex justify-content-end mt-5">
      <button className="formButtons formDeleteButton" onClick={props.onReject}>
        Reject
      </button>
      <button className="formButtons" onClick={props.onAccept}>
        {!props.isLoading && <span>Accept</span>}
        {props.isLoading && <div className="loader" />}
      </button>
    </div>
  );
};


export default AdminHome;
