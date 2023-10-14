import InputField from '../../../shared/components/InputField/InputField';
import {useState} from 'react';
import ReactDOM  from 'react-dom';
import Modal from '../../../shared/components/Modal/Modal';

const AdminForm = (props) => {
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setLoading] = useState(false);


    const onUsernameChange = (event) => {
        setUsername(event.target.value);
    };
    const onNameChange = (event) => {
        setName(event.target.value);
    };
    const onPasswordChange = (event) => {
        setPassword(event.target.value);
    };


    const onAdd = async () => {
        setLoading(true);
        const data = {
            "username": username,
            "name": name,
            "password": password,
        };

        const requestOptions = {
            method: 'POST',
            headers: { "Content-type": "application/json; charset=UTF-8", },
            body: JSON.stringify(data)
        };
        fetch(`http://localhost:4000/admins`, requestOptions).then(() => props.refresh());

        props.exit();
    }

    return ReactDOM.createPortal(
        <Modal exit={props.exit}>
            <InputField label="Username" value={username} onChange={onUsernameChange} />
            <InputField label="Name" value={name} onChange={onNameChange} />
            <InputField label="Password" value={password} onChange={onPasswordChange} />

            <NewButton onAdd={onAdd} isLoading={isLoading} />


        </Modal>, document.getElementById("backdrop-root"));
}

export default AdminForm;

const NewButton = (props) => {
    return (
        <div className="d-flex justify-content-end mt-5">
            <button className="formButtons" onClick={props.onAdd}>
                {!props.isLoading && <span>Add</span>}
                {props.isLoading && <div className="loader" />}
            </button>
        </div>
    );
};