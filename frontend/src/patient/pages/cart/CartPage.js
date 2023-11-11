//import ReactDOM from 'react-dom';
//import Modal from '../UI/Modal';
import React from 'react';
import MedSummaryItem from './MedSummaryItem';
import classes from './CartPage.module.css';
import { useContext } from 'react';
import CartContext from './Cart';
import background from './cartbackground.jpg';
import icon from './cartIcon.png';
import arrow from './ArrowLeft.png';


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
      <div className='col-5'>
        <div  className={classes.backarrow}>
      <img src={arrow}
              style={{ width: '20px', height: 'auto' }}
            />
        <button className={classes.back} /* onClick={() => Handle order click }*/> Back</button>
        </div>
      </div>
      <div className='col-5'>
        <div className={`d-flex flex-row ${classes.rightSection} justify-space-between`}>
          <div>YOUR SHOPPING CART</div>
          <div style={{ width: "30px" }}>
            <img
              src={icon}
              style={{ width: '30px', height: 'auto' }}
            />
          </div>

        </div>

        <div className={classes.pageContent}>
          {medSummaryItems.length > 0 ? (
            <div className={classes.summary}>
              <div className={classes.cartItem}>{medSummaryItems}</div>
              <div>
                <h2 className={classes.total}>Total Amount: $ {cartCtx.total}</h2>
                <div className={classes.checkoutButton}>
                  <button className={classes.check} >Checkout</button>
                </div>
              </div>
            </div>
            

          ) : (
            <div className={classes.empty}>
            <p >Cart seems empty?
              <button className={classes.more} >Shop more</button>

            </p>
            </div>
          )}
          </div>
        
      </div>
      <div className='col-2'></div>

    </div>
  );
};

export default CartPage;

