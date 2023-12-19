import Modal from '../../../shared/components/Modal/Modal';
import Card from '../../../shared/components/Card/Card';
import ReactDOM from "react-dom";
import React from 'react';
import { useState } from 'react';
import styles from './RequestDetails.module.css';
import {  toastMeSuccess, toastMeError } from '../../../shared/util/functions';

const RequestDetails = (props) => {

    // const [formVisible, setFormVisible] = useState(true);

    const [status, setStatus] = useState(props.data['status']);
    // const closeForm = () => {
    //     setFormVisible(false);
    //   };

      function formatDate(date) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      }  

    const onAccept = async () => {
        try {

            const requestOptions = {
                method: 'POST',
                headers: { 'Content-type': 'application/json; charset=UTF-8' },
                body: JSON.stringify({ ...props.data }),
            };

            const response = await fetch(
                'http://localhost:4000/admins/requests',
                requestOptions
            );

            if (response.ok) {
                // Handle a successful response
                // alert('Pharmacist accepted successfully!');
                toastMeSuccess('Pharmacist accepted successfully!');
                setStatus('Accepted');
                // props.onStatusChange(props.data['id'], 'Accepted');
            } else {
                // Handle errors if the server response is not ok
                // alert('Accepting request Failed!');
                toastMeError('Accepting request Failed!');
            }
        } catch (error) {
            // Handle network errors
            // alert('Network error: ' + error.message);
        }
    }

    const onReject = async () => {
        try {
            const requestOptions = {
                method: 'PATCH',
                headers: { 'Content-type': 'application/json; charset=UTF-8' },
                body: JSON.stringify({ ...props.data }),
            };
            const response = await fetch(
                'http://localhost:4000/admins/requests',
                requestOptions
            );

            if (response.ok) {
                // Handle a successful response
                toastMeSuccess('Pharmacist rejected!');
                setStatus('Rejected');
                // props.onStatusChange(props.data['id'], 'Rejected');
            } else {
                // Handle errors if the server response is not ok
                toastMeError('Rejecting request Failed!');
            }
        } catch (error) {
            // Handle network errors
            alert('Network error: ' + error.message);
        }
    }   
    const RequestDetails = () => {
     return (
      <React.Fragment>
        <>
      {  (
        <>
         
         
           
                        <div className={styles.topBorder}></div>
                        <div className={styles.doctor}>Pharmacist Request</div> 
                     
                        <div className={styles.personal}>
                        <div className={styles.headersPers}>Personal Details</div>
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
                        <div className={styles.headersProf}>Professional Details</div>
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
                        <div className={styles.headersDoc}>Documents</div>
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
              <span className={styles.smallText}>Pharmacy License</span>
              <br />
              {props.data['pharmacyLicense'] && (
                props.data['pharmacyLicense'].includes('pdf') ? (
                  <a href={props.data['pharmacyLicense']} target="_blank" rel="noopener noreferrer">Download PDF</a>
                ) : (
                  <img width={130} src={props.data['pharmacyLicense']} alt="Medical License" />
                )
              )}
            </div>

            {/* Medical Degree */}
            <div className={styles.spacing}>
              <span className={styles.smallText}>Pharmacy Degree</span>
              <br />
              {props.data['pharmacyDegree'] && (
                props.data['pharmacyDegree'].includes('pdf') ? (
                  <a href={props.data['pharmacyDegree']} target="_blank" rel="noopener noreferrer">Download PDF</a>
                ) : (
                  <img width={130} src={props.data['pharmacyDegree']} alt="Medical Degree" />
                )
              )}
                        </div>
                        {status.toLowerCase() === 'pending' && <ActionButtons onReject={onReject} onAccept={onAccept} />}
                               
                            </div>
        </>
      )}
    </>
    </React.Fragment>
  );};

  return ReactDOM.createPortal(
    <Modal exit={props.exit}>
      {RequestDetails()}
      {/* <ActionButtons onDelete={onDelete} /> */}
    </Modal>, document.getElementById("backdrop-root")
  );
}

const ActionButtons = (props) => {
    return (
   
           <div  className={styles.buttonPos}>
            <button className={styles.reject} onClick={props.onReject}>Reject</button>
            <button className={styles.accept} onClick={props.onAccept}>
                {!props.isLoading && <span>Accept</span>}
                {props.isLoading && <div className="loader" />}
            </button>
        </div>
       
    );
};

export default RequestDetails;