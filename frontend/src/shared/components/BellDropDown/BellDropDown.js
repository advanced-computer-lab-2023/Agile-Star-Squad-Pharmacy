import React, { useContext, useState, useEffect } from 'react';
import bell from './bell.png';
import UserContext from '../../../user-store/user-context';
import img from './white.png';

const BellDropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const userCtx = useContext(UserContext);
  const userId = userCtx.userId;
  const [myNotifications, setMyNotifications] = useState([]);

  useEffect(() => {
    fetchMyNotifications();
  }, []);

  const fetchMyNotifications = () => {
    fetch(`http://localhost:4000/pharmacist/${userId}/notifications`, {
      credentials: 'include',
    }).then(async (response) => {
      const json = await response.json();
      const notificationsJson = json.data.notifications;
      setMyNotifications(
        notificationsJson.map((notification) => ({
          id: notification['_id'],
          ...notification,
        }))
      );
    });
  };
  const deleteNotification = (notificationId) => {
    fetch(
      `http://localhost:4000/pharmacist/${userId}/notifications/${notificationId}`,
      {
        method: 'DELETE',
        credentials: 'include',
      }
    )
      .then(() => {
        // Remove the deleted notification from the local state
        setMyNotifications((prevNotifications) =>
          prevNotifications.filter(
            (notification) => notification.id !== notificationId
          )
        );
      })
      .catch((error) => {
        console.error('Error deleting notification:', error);
      });
  };
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div style={{ position: 'relative' }}>
      <img
        src={bell}
        alt="Bell Icon"
        onClick={toggleDropdown}
        style={{ cursor: 'pointer', width: '65px' }}
      />
      {isDropdownOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%', // Position the dropdown below the bell icon
            left: 0,
            border: '1px solid #ccc',
            marginTop: '5px',
            zIndex: 1, // Ensure the dropdown is above other content
            backgroundImage: `url(${img})`,
            backgroundSize: 'cover',
            padding: '10px',
            width: '500%',
            maxHeight: '200px', // Set the maximum height for scrolling
            overflowY: 'auto', // Make the list scrollable
            borderRadius: '10px',
          }}
        >
          {/* Display fetched notifications dynamically */}
          <ul style={{ listStyle: 'none', padding: 0, width: '100%' }}>
            {myNotifications.map((notification) => (
              <li
                key={notification.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderBottom:
                    '0.25px solid var(--text-icons-faded-grey, #464a54)',
                }}
              >
                <span>
                  {userCtx.role === 'patient'
                    ? notification.patientMessage
                    : notification.doctorMessage}
                </span>
                <span
                  style={{
                    cursor: 'pointer',
                    color: 'red',
                    marginRight: '-5px',
                    marginTop: '-7px',
                  }}
                  onClick={() => deleteNotification(notification._id)}
                >
                  x
                </span>
                <hr></hr>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BellDropdown;
