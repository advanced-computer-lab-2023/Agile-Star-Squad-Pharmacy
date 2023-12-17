import { SideCard } from './Account';
import { useContext, useEffect, useState } from 'react';
import classes from './FamilyCard.module.css';
import Select from 'react-select';
import closeImg from '../../assets/patientAccount/close.png';
import UserContext from '../../user-store/user-context';
import axios from 'axios';

const FamilyCard = (props) => {
  const [familyMembers, setFamilyMembers] = useState(props.members);
  const [tab, setTab] = useState(0);
  const [name, setName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState();
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [relation, setRelation] = useState();

  const userCtx = useContext(UserContext);

  const deleteMember = (member) => {
    axios.delete(
      `http://localhost:3000/patients/${userCtx.userId}/familyMembers/${member._id}`,
      { withCredentials: true },
    );
    setFamilyMembers((value) => {
      return value.filter((familyMember) => familyMember._id != member._id);
    });
    props.setMembers((value) =>
      value.filter((familyMember) => familyMember._id != member._id),
    );
  };

  const getTabStyle = (index) => {
    if (index == tab) {
      return `${classes.tabText} ${classes.activeTab}`;
    }
    return classes.tabText;
  };

  const getMemberCards = () => {
    return (
      <div className={classes.wrapper}>
        {familyMembers.map((member) => (
          <div className={classes.memberContainer}>
            <div
              style={{
                height: '85px',
                width: '85px',
                borderRadius: '50%',
                backgroundColor: 'lightblue',
              }}
            />
            <div className="d-flex flex-column ms-3 py-2 justify-content-between">
              <div className={classes.memberName}>{member.name}</div>
              <div className={classes.memberDescription}>{member.relation}</div>
              <div className={classes.memberDescription}>
                {member.gender} | {member.age}
              </div>
            </div>
            <div className={classes.deleteButton}>
              <img
                onClick={() => {
                  deleteMember(member);
                }}
                src={closeImg}
                height={20}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const getForm = () => {
    const relationOptions = [
      { value: 'son', label: 'Son' },
      { value: 'daughter', label: 'Daughter' },
      { value: 'wife', label: 'Wife' },
      { value: 'husband', label: 'Husband' },
    ];

    const genderOptions = [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
    ];

    const onSubmit = async (e) => {
      e.preventDefault();
      if ((name && nationalId && age) || phoneNumber || email) {
        const body = {
          name,
          NationalID: nationalId,
          age,
          gender: gender.value,
          relation: relation.value,
          email,
          mobileNumber: phoneNumber,
        };
        try {
          const response = await axios.post(
            `http://localhost:3000/patients/${userCtx.userId}/familyMembers`,
            body,
            { withCredentials: true },
          );
          const newMember = {
            _id: response.data.member._id,
            name,
            relation: relation.value,
            gender: gender.value,
            age,
          };
          setFamilyMembers((value) => [...value, newMember]);
          props.setMembers((value) => [...value, newMember]);
          setTab(0);
        } catch (error) {
          alert(error.response.data.data.message);
          return;
        }
      } else {
        alert('Please fill in all required fields');
      }
    };

    return (
      <form className={classes.formWrapper}>
        <div className="w-100">
          <div className={classes.formTitle}>Member Details</div>
          <div className={classes.inputRow}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              required
            />
            <input
              type="number"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              placeholder="National ID"
              required
            />
          </div>
          <div className={classes.inputRow}>
            
            <input style={{width: "30%"}} type='number' value={age} onChange={(e) => setAge(e.target.value)}  placeholder='Age' required/>
         
          </div>
          <div className={classes.inputRow}>
            
          <div className='d-flex w-100 mx-3 align-items-center justify-content-between'>
              Relation
              <Select
                options={relationOptions}
                styles={customStyles}
                value={relation}
                isSearchable={false}
                onChange={(option) => setRelation(option)}
                required
              />
            </div>
            </div>

          <div className={`${classes.inputRow}`}>
          <div className='d-flex w-100 mx-3 align-items-center justify-content-between'>
            Gender
              <Select
               options={genderOptions}
               styles={customStyles}
               value={gender}
               isSearchable={false}
               onChange={(option) => setGender(option)} required
              />
            </div> 
          </div>
        </div>
        <div className="mt-2 w-100">
          <div className={classes.formTitle}>Link Account (Optional)</div>
          <div className={classes.inputRow}>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
          </div>
          <div className={classes.inputRow}>
            <input
              type="number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Phone Number"
            />
          </div>
        </div>
        <button type="submit" onClick={onSubmit} className={classes.addButton}>
          Add Member
        </button>
      </form>
    );
  };

  return (
    <SideCard>
      <div className={classes.sideCardTitle}>My Family</div>
      <div className={classes.tabs}>
        <div className={getTabStyle(0)} onClick={() => setTab(0)}>
          My Family {tab == 0 && <hr className={classes.activeTab} />}
        </div>
        <div className={getTabStyle(1)} onClick={() => setTab(1)}>
          Add Family Member {tab == 1 && <hr className={classes.activeTab} />}
        </div>
      </div>
      {tab == 0 && getMemberCards()}
      {tab == 1 && getForm()}
    </SideCard>
  );
};

  export default FamilyCard;

    
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      width: "130px",
      backgroundColor: 'white',
      border: 'none',
      boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.09)",
      borderRadius: "17px",
      textAlign: 'start'
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "#193842"
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
      fontWeight: state.isFocused ? "500" : "400",
      color: state.isFocused ? "black" : "#666666",
      textAlign: "left",
      backgroundColor: "transparent"
    }),
    singleValue: (provided) => ({
      ...provided,
      fontSize: '12px',
      fontWeight: "600",
      color: "#193842"
    }),
    valueContainer: (provided) => ({
      ...provided,
      backgroundColor: "transparent"
    }),
    menuList: (base) => ({
      ...base,
      maxHeight: '180px',
      "::-webkit-scrollbar": {
        width: "3px",
        height: "0px",
      },
      "::-webkit-scrollbar-track": {
        background: "transparent"
      },
      "::-webkit-scrollbar-thumb": {
        background: "#888",
        borderRadius: '3px',
      },
      "::-webkit-scrollbar-thumb:hover": {
        background: "#555"
      }
    })
  };
