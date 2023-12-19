import ReactDOM from "react-dom"
import Modal from "../Modal/Modal"
import classes from "./ConfirmationModal.module.css"

const ConfirmationModal = (props) => {
    return ReactDOM.createPortal(
        <div>
            <div className={classes.backdrop} onClick={props.exit}></div>
            <div className={classes.modal}>
                <div className={classes.titleContainer}> Are you sure? </div>
                <div className={classes.description}>
                    {props.text}
                </div>
                <div className="d-flex justify-content-end w-100">
                    <div onClick={props.exit} className={classes.noButton}>No</div>
                    <div onClick={props.confirm} className={classes.yesButton}>Yes</div>
                </div>
            </div>
        </div>

        , document.getElementById("backdrop-root"))
}

export default ConfirmationModal;