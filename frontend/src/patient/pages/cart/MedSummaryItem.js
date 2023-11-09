import { useContext } from 'react';
///////import classes from './MedSummaryItem.module.css';
import CartContext from './Cart';

const MedSummaryItem = (props) => {
    const cartCtx = useContext(CartContext);
    
    const increment = () => {
        cartCtx.addItem({id: props.id, title: props.title, desc: props.desc, price: props.price, quantity: 1});
    };

    const decrement = () => {
        cartCtx.removeItem(props.id);
    }

    return (
        <div>
            <div>
                <h2>{props.label}</h2>
                <div>
                    <label >$ {props.price}</label>
                    <span >x {props.quantity}</span>
                </div>
            </div>

            <div>
                <button  onClick={decrement}>-</button>
                <button  onClick={increment}>+</button>
            </div>
        </div>
    );
};

export default MedSummaryItem;