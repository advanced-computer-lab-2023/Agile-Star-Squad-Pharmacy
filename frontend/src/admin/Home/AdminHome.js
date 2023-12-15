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
  const [selectedRow, setSelectedRow] = useState({});

  
  useEffect(() => {
    fetchPatients();
    fetchPharmacists();
    fetchAdmins();
  }, []);
  const refreshUserData = () => {
    setUsers([]);
    fetchPatients();
    fetchPharmacists();
    fetchAdmins();
  };

 


  useEffect(() => {
    const fetchData = async () => {
      // Fetch data here
      try {
        await fetchPendingRequests();

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
      const response = await axios.get('http://localhost:4000/packages/');
      const packagesData = response.data; // Assuming the packages are directly in the data property
      setPackages(packagesData);
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };
  const [revenueData, setRevenueData] = useState([]);
  const [weeklySalesData, setWeeklySalesData] = useState({
    currentWeekSales: [],
    prevWeekSales: [],
  });

  useEffect(() => {
    const fetchWeeklySalesData = async () => {
      try {
        const response = await fetch('http://localhost:4000/admins/weeklySales');
        const data = await response.json();
        setWeeklySalesData(data.data);
        console.log(data.data);
      } catch (error) {
        console.error('Error fetching weekly sales data:', error);
      }
    };

    fetchWeeklySalesData();
  }, []);

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
  const showDetails = (request) => {
    if (request && request.id) {
      setSelectedRequest(request);
    } else {
      console.error('Invalid or undefined request object:', request);
    }
  };

  const editHandler = () => {
    // Navigate to the "Packages Page" when the "Edit" button is clicked
    navigate('/packages');
  };

  const closeModal = () => {
    setSelectedRequest(null);
  };

  const showRequestModal = (request) => {
    setSelectedRequest(request);
  };

  const showUserModal = (user) => {
    setSelectedUser(user);
    // Scroll to the top of the page
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // You can adjust the behavior as needed
    });
  };

  const exitRequestModal = () => {
    setSelectedRequest(null);
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
  const formatDefaultDate = () => {
    const currentDate = new Date();
    const oneDayAgo = new Date(currentDate);
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
  
    const options = { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    
    return oneDayAgo.toLocaleDateString('en-US', options);
  };
  
  

  const logout = () => {
    userLogout();
    navigate('/');
  };

  const changePasswordHandler = () => {
    navigate('/changePassword');
  };
 

  const fetchTotalSales = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/admins/totalSalesForDay`); 
      const totalSales = response.data.data.totalSales;
  
      // Now you can use the 'totalSales' data in your component
      console.log('Total Sales for the Month:', totalSales );
      setSales(totalSales);
    } catch (error) {
      console.error('Error fetching total sales:', error.message);
    }
  };
  
  
  // Call the function when needed, such as when the component mounts
  useEffect(() => {
    fetchTotalSales();
  }, []);

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


    
  const fetchPatients = () => {
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
              mobileNumber: patient['mobileNumber'],
              emergencyNumber: patient['emergencyNumber'],
              role: 'Patient',
            };
          }),
        ]);
      });
  };
  
  const fetchPharmacists = () => {
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
              educationalBackground: pharmacist['educationalBackground'],
              role: 'Pharmacist',
            };
          }),
        ]);
      });
  };
  
  const fetchAdmins = () => {
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
  


  return (
    <div>
      <AdminNavBar/>
    <Container className={styles.sales} >
    <h2 className={styles.salesTitle}>Sales Report</h2>
    <section className={styles.salesSec}>
    <img
              src={sale}
              alt=""
              width= "43.333"
              height= "35.435"
              className={styles.salesImg}
              id="logo"
            />
            <div className={styles.amount}>${sales}</div>
      <h4 className={styles.salesText}>Total Sales</h4>
    </section>
    </Container>
    <Container className={styles.requests}>
  <h2 className={styles.ReqTitle}>Requests</h2>
  <div className="container">
    <div className="row">
      <table className="table table-hover">
        <tbody>
          {requests.map((request) => (
            <tr key={request.id} onClick={() => showDetails(request)}>
              <td className={styles.req}>
                <img src={req} alt="req" />
              </td>
              <td className={styles.bold}>
      {request.name} 
      <div className={styles.small}>
      {calculateAge(request.dateOfBirth)},   { formatDefaultDate(request.creationDate ? new Date(request.creationDate) : undefined)}


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
              <button className={styles.editButton} onClick={editHandler}>
                More
              </button>
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
        currentWeekSales={weeklySalesData.currentWeekSales}
        prevWeekSales={weeklySalesData.prevWeekSales}
      /></div>
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
              <th className={styles.userTitle}>Speciality</th>
              <th className={styles.userTitle}>Affiliation</th>
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
          {selectedUser && (
        <UserDetails
          data={selectedUser}
          exit={exitUserModal}
          onDelete={deleteUser}
        />
      )}
        {showUser && <UserDetails data={selectedUser} exit={exitUserModal} onDelete={deleteUser} />}
          

     
      <Link to="/admin/manage">
        <button>Manage Users</button>
      </Link>
      <Link to="/pharmacy/home">
        <button>Go to Pharmacy</button>
      </Link>
      <button onClick={logout}>Logout</button>
      <button onClick={changePasswordHandler}>change password</button>
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
