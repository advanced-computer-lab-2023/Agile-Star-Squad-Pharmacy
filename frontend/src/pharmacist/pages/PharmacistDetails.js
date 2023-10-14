import ReactDOM from "react-dom";
import React from "react";
import Modal from "../../shared/components/Modal/Modal";

const PharmacistDetails = (props) => {
  const onDelete = () => {
    props.onDelete(props.data["username"]);
    props.exit();
  };

  const PharmacistDetails = () => {
    return getPharmacistBody();
  };

  const getPharmacistBody = () => {
    return (
      <React.Fragment>
        <div>
          <span>
            <h4>Username</h4>
          </span>
          <span>{props.data["username"]}</span>
        </div>
        <div>
          <span>
            <h4>Name</h4>
          </span>
          <span>{props.data["name"]}</span>
        </div>
        <div>
          <span>
            <h4>Email</h4>
          </span>
          <span>{props.data["email"]}</span>
        </div>
        <div>
          <span>
            <h4>Date of Birth</h4>
          </span>
          <span>{props.data["dateOfBirth"]}</span>
        </div>
        <div>
          <h4>Hourly Rate</h4>
          <span>{props.data["hourlyRate"]}</span>
        </div>
        <div>
          <span>
            <h4>Affiliation</h4>
          </span>
          <span>{props.data["affiliation"]}</span>
        </div>
        <div>
          <span>
            <h4>Educational Background</h4>
          </span>
          <span>{props.data["educationalBackground"]}</span>
        </div>
      </React.Fragment>
    );
  };

  return ReactDOM.createPortal(
    <Modal exit={props.exit}>
      {PharmacistDetails()}
      <ActionButtons onDelete={onDelete} />
    </Modal>,
    document.getElementById("backdrop-root")
  );
};

const ActionButtons = (props) => {
  return (
    <div className="d-flex justify-content-end mt-5">
      {/* <button className="formButtons formDeleteButton" onClick={props.onDelete}>
        Delete
      </button> */}
    </div>
  );
};

export default PharmacistDetails;
