import { useEffect, useState, useContext } from 'react';
import { SideCard } from './Account';
import Select from 'react-select';
import classes from './PaymentCard.module.css';
import axios from 'axios';
import UserContext from '../../user-store/user-context';
import { toastMeSuccess } from '../../shared/util/functions';

const citiesInEgypt = [
  {
    city: 'Cairo',
    districts: ['Nasr City', 'Maadi', 'Heliopolis', 'Mohandessin', 'Zamalek'],
  },
  {
    city: 'Alexandria',
    districts: ['Miami', 'Roushdy', 'Montaza', 'Sidi Bishr', 'Smouha'],
  },
  {
    city: 'Giza',
    districts: ['Agouza', 'Dokki', 'Mohandessin', 'Faisal', 'Haram'],
  },
];
const ShippmentCard = (props) => {
  const userCtx = useContext(UserContext);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedStreet, setSelectedStreet] = useState('');
  const [address, setAddress] = useState();

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
    setSelectedDistrict('');
  };

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
  };

  useEffect(() => {
    const fetchAddresses = async () => {
      const res = await axios
        .get(`http://localhost:4000/address/${userCtx.userId}`, {
          withCredentials: true,
        })
        .catch((err) => {
          console.error(err);
        });
      setAddresses(res.data.data.addresses);
      setSelectedAddressId(res.data.data.addresses[0]._id);
    };
    fetchAddresses();
  }, [selectedAddressId]);

  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId);
    if (addressId) {
      const foundAddress = addresses.find(
        (address) => address._id === addressId
      );
      setAddress(foundAddress);
      setSelectedCity(foundAddress.city);
      setSelectedDistrict(foundAddress.district);
      setSelectedStreet(foundAddress.street);
    } else {
      setSelectedCity('');
      // setSelectedDistrict(foundAddress.district)
      setSelectedStreet('');
    }
  };

  



  const onSave = async ()  => {
    // add to backend
    
  //  let address
  // e.preventDefault();
  let paymentIntentData = {
    country:'Egypt',
    city:selectedCity,
    district:selectedDistrict,
    street:selectedStreet,
    // patient:userCtx.userId
  };
 
  
  const response = await fetch(`http://localhost:4000/address/${userCtx.userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(paymentIntentData),
    credentials: 'include',
  });

  if (!response.ok) {
    
    throw new Error('Failed to send data to the server.');

  }
  toastMeSuccess('Address Added Successfully')

  
      
  //   const { country, city, street } = formData;
  //   if (country && city && street) {
  //     const requestOptions = {
  //       method: 'POST',
  //       headers: { 'Content-type': 'application/json; charset=UTF-8' },
  //       body: JSON.stringify(formData),
  //       credentials: 'include',
  //     };
  //     fetch(
  //       `http://localhost:4000/address/${patientId}/`,
  //       requestOptions,
  //     );
  //     alert('Address added successfully');
  //     navigate(-1);
  //   } else {
  //     alert('Please fill in all required fields');
  //   }
  // };

} 
      // axios.post(
      //   `http://localhost:4000/addresses/${userCtx.userId}`,
      //   {country:'Egypt',city:selectedCity,district:selectedDistrict,patient:userCtx.userid},
        
      // );

     

  return (
    <SideCard>
      <div className={classes.sideCardTitle}>Shippment Details</div>
      {/* <div className="d-flex align-items-center mt-3 mx-5 justify-content-between"> */}
        <div className={classes.inputLabel}>Use saved address</div>
    
        <select
      
     
      
           className={classes.input}
          onChange={(e) => handleAddressSelect(e.target.value)}
        >
          <option value="">Select an Address</option>
          {addresses.map((address) => (
            <option key={address._id} value={selectedAddressId}>
              <p>
                <strong> Country:</strong> {address.country}
              </p>
              <p>
                <strong> --- City:</strong> {address.city}
              </p>
              <p>
                <strong> --- Street:</strong> {address.street}
              </p>
            </option>
          ))} 
        </select>
      {/* </div> */}
      <div className={classes.inputLabel}> City:</div>
      <select
        className={classes.input}
        value={selectedCity}
        onChange={handleCityChange}
      >
        <option value="">Select a city</option>
        {citiesInEgypt.map((cityObj, index) => (
          <option key={index} value={cityObj.city}>
            {cityObj.city}
          </option>
        ))}
      </select>

      {selectedCity && (
        <div>
          <div className={classes.inputLabel}>District:</div>
          <select
            className={classes.input}
            value={selectedDistrict}
            onChange={handleDistrictChange}
          >
            <option value="">Select a district</option>
            {citiesInEgypt
              .find((cityObj) => cityObj.city === selectedCity)
              .districts.map((district, index) => (
                <option key={index} value={district}>
                  {district}
                </option>
              ))}
          </select>
        </div>
      )}
      <div className={classes.inputLabel}>Street:</div>
      
      <input
        type="text"
        className={classes.input}
        
        placeholder="Enter your Street"
        value={selectedStreet}
        onChange={(e) => setSelectedStreet(e.target.value)}
        // id="use-wallet"
      />
        {/* {!isAdding && (
          <button onClick={onDelete} className={classes.deleteButton}>
            Delete
          </button>
        )}
        <div /> */}
        <div className="d-flex justify-content-between">
      <button className={classes.saveButton} style={{marginTop:'10px'}} onClick={onSave}>
        Save
      </button>
      </div>
    </SideCard>
  );
};

export default ShippmentCard;

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    width: '130px',
    height: '60px',
    backgroundColor: '#E2E8F0',
    border: 'none',
    borderRadius: '5px',
    textAlign: 'start',
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: '#193842',
  }),
  indicatorSeparator: () => ({}),
  menu: (provided) => ({
    ...provided,
    borderRadius: '20px',
  }),
  option: (provided, state) => ({
    ...provided,
    borderRadius: '14px',
    fontSize: '14px',
    fontWeight: state.isFocused ? '500' : '400',
    color: state.isFocused ? 'black' : '#666666',
    textAlign: 'left',
    backgroundColor: 'transparent',
  }),
  singleValue: (provided) => ({
    ...provided,
    fontSize: '12px',
    fontWeight: '500',
    color: '#2D3748',
    whiteSpace: 'wrap',
  }),
  valueContainer: (provided) => ({
    ...provided,
    backgroundColor: 'transparent',
  }),
  menuList: (base) => ({
    ...base,
    '::-webkit-scrollbar': {
      width: '3px',
      height: '0px',
    },
    '::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '::-webkit-scrollbar-thumb': {
      background: '#888',
      borderRadius: '3px',
    },
    '::-webkit-scrollbar-thumb:hover': {
      background: '#555',
    },
  }),
};
