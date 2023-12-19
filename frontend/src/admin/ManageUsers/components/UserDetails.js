import Modal from '../../../shared/components/Modal/Modal';
import ReactDOM from "react-dom";
import React from 'react';
import styles from './RequestDetails.module.css';

const UserDetails = (props) => {
  const onDelete = () => {
    props.onDelete(props.data['username']);
    props.exit();
  }

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
        <div>
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
        <div className={styles.dateField}>
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
                        <div className={styles.headers}>Documents</div>
                        <div className={styles.images}>

                        
                        
            {/* ID Image */}
            <div className={styles.spacing}>
              <span className={styles.smallText}>ID Image</span>
              <br />
              {props.data['idImage'] && (
                props.data['idImage'].includes('pdf') ? (
                  <a href={props.data['idImage']} target="_blank" rel="noopener noreferrer">Download PDF</a>
                ) : (
                  <img width={130} src={props.data['idImage']} alt="ID Image" />
                )
              )}
            </div>

            {/* Medical License */}
            <div className={styles.spacing}>
              <span className={styles.smallText}>Medical License</span>
              <br />
              {props.data['medicalLicense'] && (
                props.data['medicalLicense'].includes('pdf') ? (
                  <a href={props.data['medicalLicense']} target="_blank" rel="noopener noreferrer">Download PDF</a>
                ) : (
                  <img width={130} src={props.data['medicalLicense']} alt="Medical License" />
                )
              )}
            </div>

            {/* Medical Degree */}
            <div className={styles.spacing}>
              <span className={styles.smallText}>Medical Degree</span>
              <br />
              {props.data['medicalDegree'] && (
                props.data['medicalDegree'].includes('pdf') ? (
                  <a href={props.data['medicalDegree']} target="_blank" rel="noopener noreferrer">Download PDF</a>
                ) : (
                  <img width={130} src={props.data['medicalDegree']} alt="Medical Degree" />
                )
              )}
                        </div>
                        </div>
        {/* <div>
          <span><h4>Username</h4></span>
          <span>{props.data['username']}</span>
        </div>
        <div>
          <span><h4>Name</h4></span>
          <span>{props.data['name']}</span>
        </div>
        <div>
          <span><h4>Email</h4></span>
          <span>{props.data['email']}</span>
        </div>
        <div>
          <span><h4>Date of Birth</h4></span>
          <span>{props.data['dateOfBirth']}</span>
        </div>
        <div>
          <span><h4>Hourly Rate</h4></span>
          <span>{props.data['hourlyRate']}</span>
        </div>
        <div>
          <h4>Affiliation</h4>
          <span>{props.data['affiliation']}</span>
        </div>
        <div>
          <span><h4>Educational Background</h4></span>
          <span>{props.data['educationalBackground']}</span>
        </div> */}
      </React.Fragment>
    );
  }

  return ReactDOM.createPortal(
    <Modal exit={props.exit}>
      {userDetails()}
      <ActionButtons onDelete={onDelete} />
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
