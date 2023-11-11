//import ReactDOM from 'react-dom';
//import Modal from '../UI/Modal';
import React from 'react';
import MedSummaryItem from './MedSummaryItem';
import classes from './CartPage.module.css';
import { useContext } from 'react';
import CartContext from './Cart';
import background from './cartbackground.jpg';
import icon from './cartIcon.png';


const CartPage = (props) => {
  const cartCtx = useContext(CartContext);
    console.log(cartCtx.items.length);

  const removeItem = (name) => {
    cartCtx.removeItem(props.name);
  };

  const medSummaryItems = cartCtx.items.map((medicine) => {
      return <MedSummaryItem key={medicine.name} id={medicine.id} label={medicine.name} price={medicine.price} quantity={medicine.quantity} image={medicine.image} description={medicine.description} remove={removeItem} name={medicine.name} />;
      //return <MealSummaryItem key={item.id} label={item.title} price={item.price} quantity={item.quantity} remove={removeItem} id={item.id}/>;
    })
  ;

  return (
    <div className={classes.cartpage}>
      <svg className={classes.backgroundsvg} xmlns="http://www.w3.org/2000/svg" width="1046" height="1024" viewBox="0 0 1046 1024" fill="none">
<path fill-rule="evenodd" clip-rule="evenodd" d="M547.307 26.9986C368.24 89.514 156.939 120.347 62.9562 280.934C-34.6225 447.664 -8.0537 659.342 79.784 825.846C158.797 975.621 334.11 1032.03 494.246 1098.48C649.537 1162.91 805.342 1230.36 973.602 1196.71C1172.6 1156.91 1410.6 1086.96 1479.12 901.499C1546.49 719.157 1344.65 567.738 1271.02 391.707C1203.62 230.596 1231.4 8.85592 1072.15 -71.3951C910.76 -152.727 722.227 -34.0694 547.307 26.9986Z" fill="white"/>
</svg>
       <br></br> 
       <button className={classes.back} /* onClick={() => Handle order click }*/> Back</button>
       <h1>YOUR SHOPPING CART</h1>
       <div className={classes.icon}>
       <img
            src={icon}
            style={{ width: '30px', height: 'auto' }}
          />
          </div>
    <div className={classes.pageContent}>
      {medSummaryItems.length > 0 ? (
        <div className={classes.summary}>
          <div className={classes.cartItem}>{medSummaryItems}</div>
          <div className="total">
            <h2>Total Amount: $ {cartCtx.total}</h2>
            <div className={classes.checkoutButton}>
        <button className={classes.check} /* onClick={() => Handle order click }*/>Checkout</button>
      </div>
          </div>
        </div>
      ) : (
        <p className={classes.empty}>Cart seems empty?
                <button className={classes.more} /* onClick={() => Handle order click }*/>Shop more</button>

        </p>
      )}
  
    </div>
  </div>
  );
};

export default CartPage;