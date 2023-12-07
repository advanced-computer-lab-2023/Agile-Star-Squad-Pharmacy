import InputField from '../../shared/components/InputField/InputField';
import { useContext, useState } from 'react';
import ReactDOM from 'react-dom';
import Modal from '../../shared/components/Modal/Modal';
import { useNavigate } from 'react-router-dom';
import '../../shared/components/InputField/InputField.css';
import UserContext from '../../user-store/user-context';


const AddAddress = (props) => {
  const user = useContext(UserContext);
  const patientId = user.userId;
  const navigate = useNavigate();

    const [formData, setFormData] = useState({
      country: '',
      city: '',
      street: '',
    });
    const handleChange = (event, country) => {
        const value = event.target.value;
        setFormData((prevFormData) => ({
          ...prevFormData,
          [country]: value,
        }));
      };

      const onAdd = async () => {
      
        const { country, city, street } = formData;
        if (country && city && street) {
          const requestOptions = {
            method: 'POST',
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
            body: JSON.stringify(formData),
            credentials: 'include',
          };
          fetch(
            `http://localhost:4000/address/${patientId}/`,
            requestOptions,
          );
          alert('Address added successfully');
          navigate(-1);
        } else {
          alert('Please fill in all required fields');
        }
      };

      return ReactDOM.createPortal(
        <Modal exit={props.exit}>
            <h2>Add Address</h2>
          <InputField
            label="Country"
            name="country"
            value={formData.country}
            onChange={(event) => handleChange(event, 'country')}
          />
           <InputField
            label="City"
            name="city"
            value={formData.city}
            onChange={(event) => handleChange(event, 'city')}
          />
           <InputField
            label="Street"
            name="street"
            value={formData.street}
            onChange={(event) => handleChange(event, 'street')}
          />
          <div className="d-flex justify-content-end mt-5">
        <button className="formButtons" onClick={onAdd}>
          <span>Add</span>
        </button>
      </div>
             </Modal>,
    document.getElementById('backdrop-root'),
  );
}

export default AddAddress;