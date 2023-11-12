import Modal from '../../../shared/components/Modal/Modal';
import ReactDOM from "react-dom";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const RequestDetails = (props) => {

    const [status, setStatus] = useState(props.data['status']);

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
                alert('Pharmacist accepted successfully!');
                setStatus('Accepted');
                props.onStatusChange(props.data['id'], 'Accepted');                
            } else {
                // Handle errors if the server response is not ok
                alert('Accepting request Failed!');
            }
        } catch (error) {
            // Handle network errors
            alert('Network error: ' + error.message);
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
            console.log(response);

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
    return ReactDOM.createPortal(
        <Modal exit={props.exit}>
            <div>
                <span><h4>Username</h4></span>
                <span>{props.data['username']}</span>
            </div>
            <div>
                <span><h4>Name</h4></span>
                <span>{props.data['name']}</span>
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
            </div>
            <div>
                <span><h4>Status</h4></span>
                <span>{status}</span>
            </div>
            {status.toLowerCase() === 'pending' && <ActionButtons onReject={onReject} onAccept={onAccept}/>}
        </Modal>, document.getElementById("backdrop-root")
    );
}


const ActionButtons = (props) => {
    return (
        <div className="d-flex justify-content-end mt-5">
            <button className="formButtons formDeleteButton" onClick={props.onReject}>Reject</button>
            <button className="formButtons" onClick={props.onAccept}>
                {!props.isLoading && <span>Accept</span>}
                {props.isLoading && <div className="loader" />}
            </button>
        </div>
    );
};

export default RequestDetails;