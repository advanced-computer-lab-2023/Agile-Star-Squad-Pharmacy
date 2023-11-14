import ReactDOM from 'react-dom';
import classes from './requestsStyle.module.css';
import doctorImage from './051_Doctor 1.png';
import clock from './Clock.png';
import logo from './PHARMA.png';
import { useNavigate } from 'react-router-dom';


const PendingRequest = (props)=>{
  const navigate = useNavigate();
  const handleButtonLogout = () => {
    navigate('/landingpage');

  }
    return(
   
      <body className={classes.background}>
      <div className='d-flex'>
      <div className={`${classes.mainBackground} col-5`}>
          <div className={classes.logo}>
            <img src={logo} alt="Clinic Logo"/>  
          </div>
          <img src={doctorImage} alt="Doctor Image" className={classes.doctorImage} /> 
      </div>
      
      <div className={`${classes.secondBackground} col-7`}>
       {
        <div className={classes.customText}>
          <p className={classes.p1}>ACCESS REQUEST PENDING</p>
          <p className={classes.p2}>Access Pending</p>
          <img src={clock} alt="BIG CLOCK"/>  
          <div>
          <button className={classes.button} onClick={handleButtonLogout}>CLOSE</button>
          </div>
        </div>
        

       }
       </div>
      
      </div>
   
      </body>

    
    
    
    
    

    )
}
export default PendingRequest;