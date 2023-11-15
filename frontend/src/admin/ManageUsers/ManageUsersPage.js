import { useEffect, useState } from 'react';
import DataTable from '../../shared/components/DataTable/DataTable';
import RequestDetails from './components/RequestDetails';
import AdminForm from './components/AdminForm';
import UserDetails from './components/UserDetails';

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [isUserTab, setUserTab] = useState(true);
  const [showRequest, setShowRequest] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});

  useEffect(() => {
    fetchPatients();
    fetchPharmacists();
    fetchAdmins();
    fetchRequests();
  }, []);

  const userCols = [
    { field: 'username', headerName: 'Username' },
    { field: 'name', headerName: 'Name' },
    { field: 'mobileNumber', headerName: 'Mobile Number' },
    { field: 'role', headerName: 'Role' },
  ];

  const requestCols = [
    { field: 'username', headerName: 'Username' },
    { field: 'name', headerName: 'Name' },
    { field: 'email', headerName: 'Email' },
    { field: 'status', headerName: 'Status' },
  ];

  const fetchPatients = () => {
    fetch('http://localhost:4000/patients/').then(async (response) => {
      const json = await response.json();
      const patientsJson = json.data.patients;
      setUsers((val) => [
        ...val,
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
    fetch('http://localhost:4000/pharmacist/').then(async (response) => {
      const json = await response.json();
      const pharmacistsJson = json.data.Pharmacists;
      setUsers((val) => [
        ...val,
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
            // mobileNumber: pharmacist['mobileNumber'] ?? '-',
            role: 'Pharmacist',
          };
        }),
      ]);
    });
  };

  const fetchAdmins = () => {
    fetch('http://localhost:4000/admins/').then(async (response) => {
      const json = await response.json();
      const adminsJson = json.data.admins;
      setUsers((val) => [
        ...val,
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

  const fetchRequests = () => {
    fetch('http://localhost:4000/admins/requests').then(async (response) => {
      const json = await response.json();
      const requestsJson = json.data.requests;
      setRequests((val) => [
        ...val,
        ...requestsJson.map((request) => {
          return {
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
          };
        }),
      ]);
    });
  };

  const showRequestModal = (selectedRow) => {
    setSelectedRow(selectedRow);
    setShowRequest(true);
  };

  const showUserModal = (selectedRow) => {
    setSelectedRow(selectedRow);
    setShowUser(true);
  };

  const exitRequestModal = () => {
    setShowRequest(false);
  };

  const exitUserModal = () => {
    setShowUser(false);
  };

  const exitAdminModal = () => {
    setShowAdminForm(false);
  };

  const refreshUserData = () => {
    setUsers([]);
    fetchPatients();
    fetchPharmacists();
    fetchAdmins();
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

  return (
    <div className="center">
      {showRequest && (
        <RequestDetails onStatusChange={statusChangeHandler} data={selectedRow} exit={exitRequestModal} />
      )}
      {showAdminForm && (
        <AdminForm exit={exitAdminModal} refresh={refreshUserData} />
      )}
      {showUser && (
        <UserDetails
          data={selectedRow}
          exit={exitUserModal}
          onDelete={deleteUser}
        />
      )}
      <div>
        <span>
          <button onClick={() => setUserTab(true)}>User</button>
        </span>
        <span>
          <button onClick={() => setUserTab(false)}>Requests</button>
        </span>
      </div>
      {isUserTab && <h2>Users</h2>}
      {!isUserTab && <h2>Requests</h2>}

      {isUserTab && (
        <DataTable columns={userCols} rows={users} onRowClick={showUserModal} />
      )}
      {!isUserTab && (
        <DataTable
          columns={requestCols}
          rows={requests}
          onRowClick={showRequestModal}
        />
      )}

      <div>
        <button onClick={() => setShowAdminForm(true)}>Add New Admin</button>
      </div>
    </div>
  );
};

export default ManageUsersPage;
