import React, { useContext, useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserContext from '../../user-store/user-context';
import AdminNavBar from '../ManageUsers/components/AdminNavBar';
import { Table, Button, Container } from 'react-bootstrap';
import classes from './AdminHome.module.css';
import axios from 'axios';
import sale from '../sales.png';
import req from '../req.png';
import x from '../X.png';
import check from '../check.png';

const AdminHome = (props) => {
  const navigate = useNavigate();
  const userLogout = useContext(UserContext).logout;
  const [sales, setSales] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(12); // Default to January

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

  
  useEffect(() => {
    const fetchData = async () => {
      // Fetch data here
      try {
        // Fetch patients, doctors, admins, and other necessary data
        // await fetchPatients();
        // await fetchAdmins();
        await fetchPendingRequests();
        // await fetchPackages();

        // Set dataLoaded to true after fetching all data
        setDataLoaded(true);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts

  useEffect(() => {
    // If data has been loaded, simulate a click on the "Patients" button
    if (dataLoaded) {
      handleRoleButtonClick('patient');
    }
  }, [dataLoaded]);
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

  const handleRoleButtonClick = (role) => {
    filterUsersByRole(role);
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
  };

  const fetchPendingRequests = async () => {
    try {
      const response = await axios.get('http://localhost:4000/admins/requests');
      const pendingRequests = response.data.data.requests.filter(
        (request) => request.status === 'Pending'
      );
      setRequests(pendingRequests);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    }
  };

  const filterUsersByRole = (role) => {
    let filtered = [];

    switch (role) {
      case 'patient':
        filtered = users.filter((user) => user.role === 'Patient');
        break;
      case 'doctor':
        filtered = users.filter((user) => user.role === 'Doctor');
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

  const fetchPatients = async () => {
    try {
      const response = await fetch('http://localhost:4000/patients/');
      const json = await response.json();
      const patientsJson = json.data.patients;
      setUsers((prevUsers) => [
        ...prevUsers.filter((user) => user.role !== 'Patient'), // Remove existing patients
        ...patientsJson.map((patient) => ({
          id: patient['_id'],
          username: patient['username'],
          name: patient['name'],
          email: patient['email'],
          dateOfBirth: patient['dateOfBirth'],
          creationDate: patient['creationDate'],
          gender: patient['gender'],
          mobileNumber: patient['mobileNumber'],
          emergencyContact: patient['emergencyContact'],
          doctor: patient['doctor'],
          familyMembers: patient['familyMembers'],
          role: 'Patient',
          package: patient['package'], // Add this line to include package information
        })),
      ]);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };


  const fetchAdmins = async () => {
    try {
      const response = await fetch('http://localhost:4000/admins/');
      const json = await response.json();
      const adminsJson = json.data.admins;
      setUsers((prevUsers) => [
        ...prevUsers.filter((user) => user.role !== 'Admin'), // Remove existing admins
        ...adminsJson.map((admin) => ({
          id: admin['_id'],
          username: admin['username'],
          name: '-',
          mobileNumber: '-',
          role: 'Admin',
        })),
      ]);
    } catch (error) {
      console.error('Error fetching admins:', error);
    }
  };

  const refreshUserData = () => {
    setUsers([]);
  };
  
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       await fetchPendingRequests();
  //       await fetchPatients();
  //       await fetchAdmins();
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };
  
  //   fetchData();
  // }, [refreshUserData]);

  const deleteUser = (username) => {
    const user = users.find((value) => value.username === username);
    if (user.role === 'Patient') {
      fetch(`http://localhost:4000/patients/${user.id}`, { method: 'DELETE' });
    } else if (user.role === 'Doctor') {
      fetch(`http://localhost:4000/doctors/${user.id}`, { method: 'DELETE' });
    } else if (user.role === 'Admin') {
      fetch(`http://localhost:4000/admins/${user.id}`, { method: 'DELETE' });
    }
    setUsers(users.filter((val) => val.username !== username));
    refreshUserData();
  };

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
            credentials: 'include'
        };

        const response = await fetch(
            'http://localhost:4000/admins/requests',
            requestOptions
        );

        if (response.ok) {
            // Handle a successful response
            alert('Doctor accepted successfully!');
            setStatus('Accepted');
            statusChangeHandler(props.id,'Accepted');
           
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
            credentials: 'include'
        };
        const response = await fetch(
            'http://localhost:4000/admins/requests',
            requestOptions
        );

        if (response.ok) {
            // Handle a successful response
            alert('Doctor rejected!');
            setStatus('Rejected');
            statusChangeHandler(props.id,'Rejected');     
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
  const handleDeleteClick = (event, username) => {
    // Prevent the event from propagating to the parent row and triggering showUserModal
    event.stopPropagation();
  
    // Call your delete function here
    deleteUser(username);
  };
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
  const handleMonthChange = (event) => {
    const month = parseInt(event.target.value, 10);
    setSelectedMonth(month);
  };

  const fetchTotalSales = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/admins/totalSales${selectedMonth}`); 
      const totalSales = response.data.data.totalSales;
  
      // Now you can use the 'totalSales' data in your component
      console.log('Total Sales for the Month:', totalSales +" month"+selectedMonth);
      setSales(totalSales);
    } catch (error) {
      console.error('Error fetching total sales:', error.message);
    }
  };
  
  
  // Call the function when needed, such as when the component mounts
  useEffect(() => {
    fetchTotalSales();
  }, []);

  return (
    <div>
      <AdminNavBar/>
    <Container className={classes.sales} >
    <h2 className={classes.salesTitle}>Sales Report</h2>
    <section className={classes.salesSec}>
    <img
              src={sale}
              alt=""
              width= "43.333"
              height= "35.435"
              className={classes.salesImg}
              id="logo"
            />
            <div className={classes.amount}>${sales}</div>
      <h4 className={classes.salesText}>Total Sales</h4>
    </section>
    </Container>
    <Container className={classes.requests}>
  <h2 className={classes.ReqTitle}>Requests</h2>
  <div className="container">
    <div className="row">
      <table className="table table-hover">
        <tbody>
          {requests.map((request) => (
            <tr key={request.id} onClick={() => showDetails(request)}>
              <td className={classes.req}>
                <img src={req} alt="req" />
              </td>
              <td className={classes.bold}>
      {request.name} - {request.affiliation}
      <div className={classes.small}>
      {request.speciality}-{calculateAge(request.dateOfBirth)},   { formatDefaultDate(request.creationDate ? new Date(request.creationDate) : undefined)}


      </div>
    </td>
              {status.toLowerCase() === 'pending' && (
                <ActionButtons reject={() => reject(request)} accept={() => accept(request)} />
              )}
              <td className={`${classes.rejectReq} ${classes.borderBottom}`}>
                <img
                  src={x}
                  alt="req-rej"
                  className={classes.rej}
                  onClick={(e) => {
                    selectedRequest &&
                      selectedRequestRef.current &&
                      selectedRequestRef.current.reject(request);
                    e.stopPropagation(); // Stop event propagation
                    reject(request);
                  }}
                />
              </td>
              <td className={`${classes.acceptReq} ${classes.borderBottom}`}>
                <img
                  src={check}
                  width="25"
                  height="25"
                  alt="req-acc"
                  className={classes.acc}
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
      <h1>Welcome to Admin Home</h1>
      <Link to="/admin/manage">
        <button>Manage Users</button>
      </Link>
      <Link to="/pharmacy/home">
        <button>Go to Pharmacy</button>
      </Link>
      <button onClick={logout}>Logout</button>
      <button onClick={changePasswordHandler}>change password</button>
    </div>
      //   <select value={selectedMonth} onChange={handleMonthChange}>
      //   <option value={1}>January</option>
      //   <option value={2}>February</option>
      //   <option value={3}>March</option>
      //   <option value={4}>April</option>
      //   <option value={5}>May</option>
      //   <option value={6}>June</option>
      //   <option value={7}>July</option>
      //   <option value={8}>Aug</option>
      //   <option value={9}>Sept</option>
      //   <option value={10}>Oct</option>
      //   <option value={11}>Nov</option>
      //   <option value={12}>Dec</option>
      //   {/* Add more options for each month */}
      // </select>
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
