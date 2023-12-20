import InputField from '../../../shared/components/InputField/InputField';
import {useState} from 'react';
import ReactDOM  from 'react-dom';
import Modal from '../../../shared/components/Modal/Modal';
import Card from '../../../shared/components/Card/Card';
import styles from './AdminForm.module.css';
import { toastMeError, toastMeSuccess } from '../../../shared/util/functions';

const AdminForm = ( { onSubmitSuccess } ) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [formVisible, setFormVisible] = useState(true); // Track form visibility



    const onUsernameChange = (event) => {
        setUsername(event.target.value);
    };
   
    const onPasswordChange = (event) => {
        setPassword(event.target.value);
    };
    const onEmailChange = (event) => {
        setEmail(event.target.value);
    };


    const onAdd = async () => {
        // Check if any of the input fields is empty
        if (!username || !password || !email) {
          toastMeError('Please fill in all the fields.');
          return;
        }
      
        setLoading(true);
        const data = {
          username: username,
          password: password,
          email: email,
        };
      
        try {
          const requestOptions = {
            method: 'POST',
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
            body: JSON.stringify(data),
          };
      
          // Make the API call
          const response = await fetch(`http://localhost:4000/admins`, requestOptions);
      
          console.log('Response status:', response.status);
      
          if (response.ok) {
            const responseData = await response.json();
            console.log('Response data:', responseData);
      
            toastMeSuccess('Admin added successfully!');
            onSubmitSuccess();
           
          } else {
            toastMeError('Failed to add admin. Please try again.');
          }
        } catch (error) {
          console.error('Error adding admin:', error);
          toastMeError('An error occurred. Please try again.');
        } finally {
          setLoading(false);
        }
      };
      

      return (
        <>
        <div id="form">
          {formVisible && (
            <Card className={`${styles.addForm}`}>
              <div className={styles.topBorder}></div>
              <div className={styles.title}>Add Admin</div>
              <form  onSubmit={onAdd} className={styles.form}>
              <div className={styles.fieldGroup}>
        <div className={styles.nameField}>
          <span className={styles.smallText}>Email</span>
          <input
            key={'name'}
            type="text"
            className="form-control"
            value={email}
            onChange={onEmailChange}
            required
          />
        </div>  
        <div className={styles.field}>
          <span className={styles.smallText}>Username</span>
          <input
            type="text"
            className="form-control"
            required
            value={username}
            onChange={onUsernameChange}
          />
        </div>
      </div>
      <div className={styles.fieldGroup}>
        <div className={styles.field}>
          <span className={styles.smallText}>Password</span>
          <input
            type="text"
            className="form-control"
            required
            value={password}
            onChange={onPasswordChange}
          />
        </div>
        
      </div>
    
                <button className={styles.addButton} type="submit">
                  ADD
                </button>
              </form>
            </Card>
          )}
          </div>
        </>
      );
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