import Modal from '../../../shared/components/Modal/Modal';
import ReactDOM from "react-dom";

const RequestDetails = (props) => {

    const onAccept = () => {

    }

    const onReject = () => {

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
                <span><h4>Specialty</h4></span>
                <span>{props.data['specialty']}</span>
            </div>
            <div>
                <span><h4>Status</h4></span>
                <span>{props.data['status']}</span>
            </div>
            {props.data['status'] === 'pending' && <ActionButtons onReject={onReject} onAccept={onAccept}/>}
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