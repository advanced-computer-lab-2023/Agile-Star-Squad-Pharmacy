import { useEffect, useState, useContext } from 'react';
import { SideCard } from './Account';
import Select from 'react-select';
import classes from './PaymentCard.module.css';
import axios from 'axios';
import UserContext from '../../user-store/user-context';

const PaymentCard = (props) => {
  const dummyCards = [
    {
      name: 'John Smith',
      cardNumber: '604829912312371',
      expiryMonth: '3',
      expiryYear: '24',
      cvv: '676',
      isDefault: false,
      label: 'Credit Card ending 2371',
    },
    {
      name: 'Alan Rock',
      cardNumber: '604829912318912',
      expiryMonth: '11',
      expiryYear: '26',
      cvv: '939',
      isDefault: true,
      label: 'Credit Card ending 8912',
    },
  ];
  const [cards, setSavedCards] = useState(dummyCards);
  const [selectedCard, setSelectedCard] = useState(dummyCards[0]);
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');

  const userCtx = useContext(UserContext);

  const handleCardChange = (option) => {
    if (option.name == null) {
      setName('');
      setCardNumber('');
      setExpiryMonth('');
      setExpiryYear('');
      setCvv('');
      setIsAdding(true);
      setSelectedCard(option);
    } else {
      setName(option.name);
      setCardNumber(option.cardNumber);
      setExpiryMonth(option.expiryMonth);
      setExpiryYear(option.expiryYear);
      setCvv(option.cvv);
      setIsAdding(false);
      setSelectedCard({ ...option });
    }
    // change text fields and make default
  };

  const getCardValue = (card) => {
    const endingNumber = card.cardNumber.slice(-4);
    return `Credit Card ending ${endingNumber}`;
  };

  const onSave = () => {
    // add to backend
    const card = {
      name,
      cardNumber,
      expiryMonth,
      expiryYear,
      cvv,
      label: 'Credit Card ending ' + cardNumber.slice(-4),
    };
    if (isAdding) {
      axios.post(
        `http://localhost:3000/patients/${userCtx.userId}/cards`,
        card,
        {
          withCredentials: true,
        },
      );

      setSavedCards((val) => [
        ...val,
        {
          ...card,
          label: getCardValue(card),
        },
      ]);
      handleCardChange(card);
    } else {
      let cardIndex = -1;
      for (let i = 0; i < cards.length; i++) {
        const currCard = cards[i];
        if (
          currCard.cardNumber === selectedCard.cardNumber &&
          currCard.name === selectedCard.name &&
          currCard.cvv === selectedCard.cvv &&
          currCard.expiryMonth === selectedCard.expiryMonth &&
          currCard.expiryYear === selectedCard.expiryYear
        ) {
          cardIndex = i;
          break;
        }
      }
      setSavedCards((cards) => {
        cards[cardIndex] = card;
        return cards;
      });
      handleCardChange(card);
    }
  };

  const onDelete = () => {
    axios.delete(
      `http://localhost:3000/patients/${userCtx.userId}/cards/${cardNumber}`,
      {
        withCredentials: true,
      },
    );
    setSavedCards((cards) => {
      return cards.filter(
        (currCard) =>
          !(
            currCard.cardNumber === selectedCard.cardNumber &&
            currCard.name === selectedCard.name &&
            currCard.cvv === selectedCard.cvv &&
            currCard.expiryMonth === selectedCard.expiryMonth &&
            currCard.expiryYear === selectedCard.expiryYear
          ),
      );
    });
    setSelectedCard(cards[0]);
    // if no more cards clear text
    handleCardChange(cards[0]);
  };

  return (
    <SideCard >
      <div className={classes.sideCardTitle}>Payment Details</div>
      <div className="d-flex align-items-center mt-3 mx-5 justify-content-between">
        <div>Use saved card</div>
        <Select
          options={[...cards, { label: 'New Credit Card' }]}
          styles={customStyles}
          value={selectedCard}
          isSearchable={false}
          onChange={handleCardChange}
        />
      </div>
      <div className={classes.inputLabel}>Name on card</div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={classes.input}
      />
      <div className={classes.inputLabel}>Card Number</div>
      <input
        value={cardNumber}
        onChange={(e) => setCardNumber(e.target.value)}
        className={classes.input}
      />
      <div className="d-flex mb-3">
        <div>
          <div className={classes.inputLabel}>Expiration Date</div>
          <div className="d-flex align-items-center">
            <input
              value={expiryMonth}
              onChange={(e) => setExpiryMonth(e.target.value)}
              className={`${classes.input} w-25 me-2`}
            />
            /
            <input
              value={expiryYear}
              onChange={(e) => setExpiryYear(e.target.value)}
              className={`${classes.input} w-25 ms-2`}
            />
          </div>
        </div>
        <div>
          <div className={classes.inputLabel}>CVV</div>
          <div className="d-flex align-items-center">
            <input
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              className={`${classes.input} w-50`}
            />
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-between">
        {!isAdding && (
          <button onClick={onDelete} className={classes.deleteButton}>
            Delete
          </button>
        )}
        <div />
        <button className={classes.saveButton} onClick={onSave}>
          Save
        </button>
      </div>
    </SideCard>
  );
};

export default PaymentCard;

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    width: '130px',
    height: '60px',
    backgroundColor: '#E2E8F0',
    border: 'none',
    borderRadius: '5px',
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
    fontWeight: '500',
    color: '#2D3748',
    whiteSpace: 'wrap',
  }),
  valueContainer: (provided) => ({
    ...provided,
    backgroundColor: 'transparent',
  }),
  menuList: (base) => ({
    ...base,
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
