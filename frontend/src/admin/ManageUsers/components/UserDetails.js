import Modal from '../../../shared/components/Modal/Modal';
import ReactDOM from "react-dom";
import React from 'react';
import styles from './UserDetails.module.css';

const UserDetails = (props) => {
  // const onDelete = () => {
  //   props.onDelete(props.data['username']);
  //   props.exit();
  // }

  function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const userDetails = () => {
    const role = props.data.role;
    console.log(role)
    if (role === 'Patient') {
      return getPatientBody();
    } else if (role === 'Admin') {
      return getAdminBody();
    } else if (role === 'Pharmacist') {
      return getPharmacistBody();
    }
  }

  const getPatientBody = () => {
    console.log(props.data)
    return (
      <React.Fragment>
        <div className={styles.topBorder}></div>
        <div className={styles.userTitle}>Patient Info</div>
        <div className={styles.nameField}>
          <span><h4>Username</h4></span>
          <span>{props.data['username']}</span>
        </div>
        <div className={styles.fieldGroup}>
          <div className={styles.nameField}>
            <span className={styles.smallText}>Name</span>
            <div className={styles.formControl}>{props.data['name']}</div>
          </div>
          <div className={styles.field}>
            <span className={styles.smallText}>Email</span>
            <div className={styles.formControl}>{props.data['email']}</div>
          </div>
        </div>
        <div className={styles.fieldGroup}>
          <div className={styles.field}>
            <span className={styles.smallText}>Username</span>
            <div className={styles.formControl}>{props.data['username']}</div>
          </div>
          <div className={styles.dateField}>
            <span className={styles.smallText}>Date of Birth</span>
            <div className={styles.formControl}>{formatDate(new Date(props.data['dateOfBirth']))}</div>
          </div>
        </div>
        <div className={styles.fieldGroup}>
          <div className={styles.field}>
            <span className={styles.smallText}>Gender</span>
            <div className={styles.formControl}>{props.data['gender']}</div>
          </div>
          <div className={styles.dateField}>
            <span className={styles.smallText}>Mobile Number</span>
            <div className={styles.formControl}>{props.data['mobileNumber']}</div>
          </div>
        </div>
        <div className={styles.field}>
          <span className={styles.smallText}>Emergency Number</span>
          <div className={styles.formControl}>{props.data['emergencyNumber']}</div>
        </div>
      </React.Fragment>
    );
  }

  const getAdminBody = () => {
    return (
      <React.Fragment>
        <div className={styles.topBorder}></div>
        <div className={styles.userTitle}>Admin Info</div>
        <div className={styles.fieldGroup}>
          <div className={styles.field}>
            <span className={styles.smallText}>Username</span>
            <div className={styles.formControl}>{props.data['username']}</div>
          </div>
          <div className={styles.dateField}>
            <span className={styles.smallText}>Email</span>
            <div className={styles.formControl}>{props.data['email']}</div>
          </div>
        </div>
        
      </React.Fragment>
    );
  }

  const getPharmacistBody = () => {
    return (
      <React.Fragment>
        <div className={styles.topBorder}></div>
        <div className={styles.userTitle}>Pharmacist Info</div> 
        <div className={styles.personal}>
                        <div className={styles.headers}>Personal Details</div>
                            <div className={styles.fieldGroup}>
                                <div className={styles.nameField}>
                                    <span className={styles.smallText}>Name</span>
                                    <div className={styles.formControl}>{props.data['name']}</div>
                                </div>
                                <div className={styles.field}>
                                    <span className={styles.smallText}>Email</span>
                                    <div className={styles.formControl}>{props.data['email']}</div>
                                </div>
                            </div>
                            <div className={styles.fieldGroup}>
                                <div className={styles.field}>
                                    <span className={styles.smallText}>Username</span>
                                    <div className={styles.formControl}>{props.data['username']}</div>
                                </div>
                                <div className={styles.dateField}>
                                    <span className={styles.smallText}>Date of Birth</span>
                                    <div className={styles.formControl}>{formatDate(new Date(props.data['dateOfBirth']))}</div>
                                </div>
                            </div>
                            </div>
                              {/* Professional Information */}
                        <div className={styles.professional}>
                        <div className={styles.headers}>Professional Details</div>
                        <div className={styles.fieldGroup}>
                            <div>
                                <span className={styles.smallText}>Affiliation</span>
                                <div className={styles.formControl}>{props.data['affiliation']}</div>
                            </div>
                            <div>
                                <span className={styles.smallText}>Educational Background</span>
                                <div className="formControl">{props.data['educationalBackground']}</div>
                            </div>
                            </div>
                        </div>
    
      </React.Fragment>
    );
  }

  return ReactDOM.createPortal(
    <Modal exit={props.exit}>
      {userDetails()}
      {/* <ActionButtons onDelete={onDelete} /> */}
    </Modal>, document.getElementById("backdrop-root")
  );
}

const ActionButtons = (props) => {
  return (
    <div className="d-flex justify-content-end mt-5">
      {/* <button className="formButtons formDeleteButton" onClick={props.onDelete}>Delete</button> */}
    </div>
  );
};

export default UserDetails;
