import { SideCard } from './Account';
import classes from './FamilyCard.module.css';


const FamilyCard = (props) => {
  
  



  return (
    <SideCard>
    
        <p className={classes.sideCardTitle}>About Us</p>
        <p>Welcome to PHARMA, your trusted online destination for all your
        pharmaceutical needs. At PHARMA, we are dedicated to providing
        convenient, reliable, and affordable healthcare solutions to our
        customers.</p> 
        <p className={classes.sideCardTitle}> Our Mission</p>
        <p> Our mission is to make healthcare accessible to
        everyone. We strive to offer a wide range of high-quality medications,
        wellness products, and healthcare essentials delivered right to your
        doorstep. We aim to empower individuals to take control of their health
        by providing them with easy access to medications and healthcare
        information.</p> 
        <p className={classes.sideCardTitle}>

Thank you for choosing PHARMA for your healthcare needs.</p>
       
    </SideCard>
  );
};

export default FamilyCard;

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    width: '130px',
    backgroundColor: 'white',
    border: 'none',
    boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.09)',
    borderRadius: '17px',
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
    fontWeight: '600',
    color: '#193842',
  }),
  valueContainer: (provided) => ({
    ...provided,
    backgroundColor: 'transparent',
  }),
  menuList: (base) => ({
    ...base,
    maxHeight: '180px',
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
