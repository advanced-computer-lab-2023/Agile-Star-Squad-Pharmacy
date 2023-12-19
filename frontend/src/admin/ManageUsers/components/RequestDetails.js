import Modal from '../../../shared/components/Modal/Modal';
import Card from '../../../shared/components/Card/Card';
import ReactDOM from "react-dom";
import { useState } from 'react';
import styles from './RequestDetails.module.css';
import { toastMe, toastMeSuccess, toastMeError } from '../../../shared/util/functions';

const RequestDetails = (props) => {

    const [formVisible, setFormVisible] = useState(true);

    const [status, setStatus] = useState(props.data['status']);
    const closeForm = () => {
        setFormVisible(false);
      };

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
                props.onStatusChange(props.data['id'], 'Accepted');
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
                alert('Pharmacist rejected!');
                setStatus('Rejected');
                props.onStatusChange(props.data['id'], 'Rejected');
            } else {
                // Handle errors if the server response is not ok
                alert('Rejecting request Failed!');
            }
        } catch (error) {
            // Handle network errors
            alert('Network error: ' + error.message);
        }
    }   
     return (
        <>
      {formVisible && (
        <>
          <div className={styles.overlay} onClick={closeForm}></div>
          <div id="form" className={styles.formContainer}>
            <Card className={`${styles.addForm} ${styles.scrollable}`}>
                        <div className={styles.topBorder}></div>
                        <div className={styles.doctor}>Pharmacist Request</div> 
                        <form className={styles.form}>
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
                        {status.toLowerCase() === 'pending' && <ActionButtons onReject={onReject} onAccept={onAccept} />}
                               
                            </div>
                        </form>
                        </Card>
          </div>
        </>
      )}
    </>
  );

    // return ReactDOM.createPortal(
    //     <Modal exit={props.exit} >
    //         <div style={{overflow: 'auto' ,maxHeight: '85vh'}}>
    //         <div>
    //             <span><h4>Username</h4></span>
    //             <span>{props.data['username']}</span>
    //         </div>
    //         <div>
    //             <span><h4>Name</h4></span>
    //             <span>{props.data['name']}</span>
    //         </div>
    //         <div>
    //             <span><h4>Date of Birth</h4></span>
    //             <span>{props.data['dateOfBirth']}</span>
    //         </div>
    //         <div>
    //             <span><h4>Hourly Rate</h4></span>
    //             <span>{props.data['hourlyRate']}</span>
    //         </div>
    //         <div>
    //             <h4>Affiliation</h4>
    //             <span>{props.data['affiliation']}</span>
    //         </div>
    //         <div>
    //             <span><h4>Educational Background</h4></span>
    //             <span>{props.data['educationalBackground']}</span>
    //         </div>
    //         <div>
    //             <span><h4>Status</h4></span>
    //             <span>{status}</span>
    //         </div>
    //         <div>
    //             <span>ID Image</span>
    //             {props.data['idImage'].includes('pdf') ? (
    //                 <a href={props.data['idImage']} target="_blank" rel="noopener noreferrer">View PDF</a>
    //             ) : (
    //                 <img src={props.data['idImage']} alt="ID Image" />
    //             )}
    //         </div>
    //         <div>
    //             <span><h4>Pharmacist License</h4></span>
    //             {props.data['pharmacyLicense'].includes('pdf') ? (
    //                 <a href={props.data['pharmacyLicense']} target="_blank" rel="noopener noreferrer">Download PDF</a>
    //             ) : (
    //                 <img src={props.data['pharmacyLicense']} alt="Pharmacist License" />
    //             )}
    //         </div>
    //         <div>
    //             <span><h4>Pharmacist Degree</h4></span>
    //             {props.data['pharmacyDegree'].includes('pdf') ? (
    //                 <a href={props.data['pharmacyDegree']} target="_blank" rel="noopener noreferrer">Download PDF</a>
    //             ) : (
    //                 <img src={props.data['pharmacyDegree']} alt="Pharmacist Degree" />
    //             )}
    //         </div>
    //        {status.toLowerCase() === 'pending' && <ActionButtons onReject={onReject} onAccept={onAccept} />}
    //        </div>
    //     </Modal>, document.getElementById("backdrop-root")
    // );
}

const ActionButtons = (props) => {
    return (
        <div className="d-flex justify-content-end mt-5">
            {/* <button className="formButtons formDeleteButton" onClick={props.onReject}>Reject</button>
            <button className="formButtons" onClick={props.onAccept}>
                {!props.isLoading && <span>Accept</span>}
                {props.isLoading && <div className="loader" />}
            </button> */}
        </div>
    );
};

export default RequestDetails;