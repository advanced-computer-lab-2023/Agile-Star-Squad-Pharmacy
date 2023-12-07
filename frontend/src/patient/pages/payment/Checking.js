import React from 'react';
// import { FontistoAmerican } from '../../../shared/components/FontistoAmerican';
// import { LogosVisa } from '../../../shared/components/LogosVisa';
import CartContext from '../cart/Cart';
import {useContext} from 'react';
import './style.css';
import NavBar from '../../../shared/components/NavBar/NavBar';

const Checking = () => {
  const cartCtx = useContext(CartContext);
  return (
    <div>
      <NavBar />
      <div className="checkout">
        <div className="divi">
          <div className="overlap-group">
            <div className="overlap-2"></div>
            <div className="overlap-3">
              <h2 className="title">ORDER SUMMARY</h2>
              <div>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Checking;
