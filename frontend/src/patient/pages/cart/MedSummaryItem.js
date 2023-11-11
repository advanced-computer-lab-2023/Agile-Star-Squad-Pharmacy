import { useContext } from 'react';
import classes from './CartPage.module.css';
import CartContext from './Cart';

const MedSummaryItem = (props) => {
    const cartCtx = useContext(CartContext);
    
    const increment = () => {
        cartCtx.addItem({id: props.id, image:props.image, title: props.title, desc: props.desc, price: props.price, quantity: 1});
    };

    const decrement = () => {
        cartCtx.removeItem(props.id);
    }

    return (
        <div>
            
             <div style={{ display: 'flex', alignItems: 'center' }}>
                <img
            src={props.image}
            alt={props.description}
            style={{ width: '100px', height: 'auto' }}
          />
              
               <div className={classes.items}> 
                <h2 className={classes.label}>{props.label}</h2>
                
                <span > {props.description}</span>
                
                <div>
                    <label className={classes.price}> $ {props.price}</label>
                    <br></br>
                    <span >Quantity: </span>
                <button className={classes.inc} onClick={decrement}>-</button>
                <span > {props.quantity} </span>
                <button className={classes.inc} onClick={increment}>+</button>
            </div>
            
            </div>
            
            </div>
            <hr></hr>
            </div>

           
    );
};

export default MedSummaryItem;