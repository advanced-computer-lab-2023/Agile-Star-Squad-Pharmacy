import MedSummaryItem from './MedSummaryItem';
import classes from './CartPage.module.css';
import { useContext } from 'react';
import CartContext from './Cart';
import background from './cartbackground.jpg';
import icon from './cartIcon.png';
import arrow from './ArrowLeft.png';
import { useNavigate } from 'react-router-dom';



const CartPage = (props) => {
  const cartCtx = useContext(CartContext);
  console.log(cartCtx.items.length);

  // useEffect & a call to the backend to get cart items

  const removeItem = (name) => {
    cartCtx.removeItem(props.name);
    // call ll backend to remove item
  };

  const medSummaryItems = cartCtx.items.map((medicine) => {
    return <MedSummaryItem key={medicine.name} id={medicine.id} label={medicine.name} price={medicine.price} quantity={medicine.quantity} image={medicine.image} description={medicine.description} remove={removeItem} name={medicine.name} />;
    //return <MealSummaryItem key={item.id} label={item.title} price={item.price} quantity={item.quantity} remove={removeItem} id={item.id}/>;
  });

  const navigate = useNavigate();

  const toPrevious= () => {
    navigate(-1);
  };

  return (
    <div className={classes.cartpage}>
      <div className='col-5'>
        <div className={classes.backarrow}>
          <img src={arrow}
            style={{ width: '20px', height: 'auto' }}
          />
          <button className={classes.back} onClick={toPrevious}> Back</button>
        </div>
      </div>
      <div className='col-5 position-relative'>
        <svg className={classes.backgroundsvg} xmlns="http://www.w3.org/2000/svg"fill="none">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M547.307 26.9986C368.24 89.514 156.939 120.347 62.9562 280.934C-34.6226 447.664 -8.05373 659.342 79.784 825.846C158.797 975.621 334.11 1032.03 494.246 1098.48C649.537 1162.91 805.342 1230.36 973.602 1196.71C1172.6 1156.91 1410.6 1086.96 1479.12 901.499C1546.49 719.157 1344.65 567.738 1271.02 391.707C1203.62 230.596 1231.4 8.85592 1072.15 -71.3951C910.76 -152.727 722.227 -34.0694 547.307 26.9986Z" fill="white" />
        </svg>
        <div className={`d-flex flex-row ${classes.rightSection} justify-space-between`}>
          <div style={{zIndex:1}}>YOUR SHOPPING CART</div>
          <div style={{ width: "30px",zIndex:1}}>
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
                <button className={classes.more}onClick={toPrevious} >Shop more</button>

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

