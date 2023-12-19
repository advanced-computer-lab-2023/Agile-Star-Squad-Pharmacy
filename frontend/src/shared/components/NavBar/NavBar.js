import React, { useContext, useState, useEffect } from 'react';
import './NavBar.css';
import patient from '../../../patient.png';
import { useNavigate, Link } from 'react-router-dom';
import UserContext from '../../../user-store/user-context';

const NavBar = (props) => {
  const navigate = useNavigate();
  const [walletAmount, setWalletAmount] = useState(0);
  const userCtx = useContext(UserContext);

  useEffect(() => {
    getWallet();
  }, []);

  const getWallet = async () => {
    if (userCtx.role == "patient"){
    const response = await fetch(
      `http://localhost:4000/patients/${userCtx.userId}`,
      {
        credentials: 'include',
      }
    );
    const json = await response.json();
    setWalletAmount(json.data.patient.wallet);
    }
    if (userCtx.role == "pharmacist"){
      const response = await fetch(
        `http://localhost:4000/pharmacist/${userCtx.userId}`,
        {
          credentials: 'include',
        }
      );
      const json = await response.json();
      console.log(json.data);
      setWalletAmount(json.data.pharmacist.wallet);
      }
  };

  const logout = async () => {
    await userCtx.logout();
    navigate('/');
  };
  const viewCart = () => {
    navigate('/cart');
  };

  const redirectToAccountSettings = () => {
    if (userCtx.role == "patient")
      navigate('/patient/account');
    else if (userCtx.role == "pharmacist")
      navigate('/pharmacist/account');
  };

  return (
    <div className="bodyN">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link to={'/pharmacy/home'} className="navbar-brand">
            PHARMA
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          {/* //Prescriptions Medicine Chat with a Pharmacist ..... Wallet Orders Account */}
          <div className="collapse navbar-collapse" id="navbarNav">

            {userCtx.role === 'patient' && (
              <ul className="navbar-nav">
                <li className="nav-item">
                  <a className="nav-link" aria-current="page" href="#">
                    Prescriptions
                  </a>
                </li>
                <li className="nav-item">
                  <Link to="/pharmacy/home" style={{ all: 'unset' }}>
                    <a className="nav-link " href="#">
                      All Medicines
                    </a>
                  </Link>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Chat with a Pharmacist
                  </a>
                </li>

                <li className="nav-item" style={{ paddingLeft: '110px' }}>
                  <p className="nav-link" href="#">
                    Wallet : {walletAmount}
                  </p>
                </li>
                <li className="nav-item">
                  <Link to="/order" style={{ all: 'unset' }}>
                    <a className="nav-link " href="#">
                      View Orders
                    </a>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/cart" style={{ all: 'unset' }}>
                    <a className="nav-link" href="#" onClick={viewCart}>
                      View Cart
                    </a>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="//patient/account" style={{ all: 'unset' }}>
                    <a
                      className="nav-link "
                      href="#"
                      onClick={redirectToAccountSettings}
                    >
                      Account
                    </a>
                  </Link>
                </li>
              </ul>
            )}
            {/* Medicine Sales Report Chat .... Wallet Account */}
            {userCtx.role === 'pharmacist' && (
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link to="/pharmacy/home" style={{ all: 'unset' }}>
                    <a className="nav-link" aria-current="page" href="#">
                      All Medicines
                    </a>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/SalesReport" style={{ all: 'unset' }}>
                  <a className="nav-link " href="#">
                    Sales Report
                  </a>
                  </Link>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Chat
                  </a>
                </li>
                <li className="nav-item">
                  <Link to="/archivedMedicines" style={{ all: 'unset' }}>
                    <a className="nav-link" aria-current="page" href="#">
                      Archived
                    </a>
                  </Link>
                </li>


                <li className="nav-item" style={{ paddingLeft: '380px' }}>
                  <p className="nav-link" href="#">
                    Wallet : {walletAmount}
                  </p>
                </li>
                <li className="nav-item">
                  {/* <Link to="//patient/account" style={{ all: 'unset' }}> */}
                  <a
                    className="nav-link "
                    href="#"
                  // onClick={redirectToAccountSettings}
                  >
                    Account
                  </a>
                  {/* </Link> */}
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};
export default NavBar;
