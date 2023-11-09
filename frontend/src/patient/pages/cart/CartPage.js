//import ReactDOM from 'react-dom';
//import Modal from '../UI/Modal';
import React from 'react';
import MedSummaryItem from './MedSummaryItem';
/////import classes from './MedSummary.module.css';
import { useContext } from 'react';
import CartContext from './Cart';

const CartPage = (props) => {
  const cartCtx = useContext(CartContext);
    console.log(cartCtx.items.length);

  const removeItem = (name) => {
    cartCtx.removeItem(props.name);
  };

  const medSummaryItems = cartCtx.items.map((medicine) => {
      return <MedSummaryItem key={medicine.name} label={medicine.name} price={medicine.price} quantity={medicine.quantity} remove={removeItem} name={medicine.name} />;
      //return <MealSummaryItem key={item.id} label={item.title} price={item.price} quantity={item.quantity} remove={removeItem} id={item.id}/>;
    })
  ;

  return (
    <div className="cart-page">
      {medSummaryItems.length > 0 ? (
        <>
          <div className="summary">
            {medSummaryItems}
            <div className="total">
              <h2>Total Amount:</h2>
              <h2>$ {cartCtx.total}</h2>
            </div>
          </div>
          <div>
            <button className="secondary" /* onClick={() => Handle order click }*/>Order</button>
          </div>
        </>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>

  );
};

export default CartPage;