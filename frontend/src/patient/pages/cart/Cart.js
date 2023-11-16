import React, { useContext, useReducer } from 'react';
import UserContext from '../../../user-store/user-context';

const CartContext = React.createContext({
    length: 0,
    items: [],
    total: 0,
    addItem: (item) => { },
    removeItem: (itemID) => { },
    removeAll: (itemID) => { },
    initItem: (item) => {},
    clearCart: () => {}
});

const cartReducer = (state, action) => {
    if (action.type === 'ADD-ITEM') {
        const newLength = state.length + parseInt(action.item.quantity);
        const newTotal = +state.total + (parseFloat(action.item.price) * parseInt(action.item.quantity));
        const existingItemIndex = state.items.findIndex((item) => item.id === action.item.id);
        let newItems = [];
        if (existingItemIndex === -1) {
            newItems = [action.item, ...state.items];
        } else {
            state.items[existingItemIndex].quantity = state.items[existingItemIndex].quantity + parseInt(action.item.quantity);
            newItems = state.items;
        }
        const cart = newItems.map(item => { return { id: item.id, quantity: item.quantity } });
        const options = {
            credentials: "include",
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({cart: cart})
        };
        fetch(`http://localhost:4000/patients/${action.id}/cart`, options).then(async response => {
            console.log(await response.json())
        });
        return { length: newLength, items: newItems, total: newTotal.toFixed(2) }
    }
    if (action.type === 'SET-ITEM') {
        const newLength = state.length + parseInt(action.item.quantity);
        const newTotal = +state.total + (parseFloat(action.item.price) * parseInt(action.item.quantity));
        const existingItemIndex = state.items.findIndex((item) => item.id === action.item.id);
        let newItems = [];
        if (existingItemIndex === -1) {
            newItems = [action.item, ...state.items];
        } else {
            state.items[existingItemIndex].quantity = state.items[existingItemIndex].quantity + parseInt(action.item.quantity);
            newItems = state.items;
        }
        return { length: newLength, items: newItems, total: newTotal.toFixed(2) }
    }
    if (action.type === 'REMOVE-ITEM') {
        const removedIndex = state.items.findIndex((item) => action.itemID === item.id);
        const removedItem = state.items[removedIndex];
        const newTotal = state.total - removedItem.price;
        if (removedItem.quantity > 1) {
            removedItem.quantity--;
        } else {
            state.items.splice(removedIndex, 1);
        }
        const cart = state.items.map(item => { return { id: item.id, quantity: item.quantity } });
        const options = {
            credentials: "include",
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({cart: cart})
        };
        fetch(`http://localhost:4000/patients/${action.id}/cart`, options);
        return { length: state.length - 1, items: state.items, total: newTotal.toFixed(2) };
    }
    if (action.type === 'REMOVE-ALL') {
        const removedIndex = state.items.findIndex((item) => action.itemID === item.id);
        const removedItem = state.items[removedIndex];
        const newTotal = state.total - (removedItem.price * removedItem.quantity);

        state.items.splice(removedIndex, 1);
        const cart = state.items.map(item => { return { id: item.id, quantity: item.quantity } });
        const options = {
            credentials: "include",
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({cart: cart})
        };
        fetch(`http://localhost:4000/patients/${action.id}/cart`, options);

        return { length: state.length - removedItem.quantity, items: state.items, total: newTotal.toFixed(2) };
    }
    if (action.type === "CLEAR-CART") {
        const options = {
        credentials: "include",
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({cart: []})
    };
    fetch(`http://localhost:4000/patients/${action.id}/cart`, options);

        return {length: 0, items: [], total: 0};
    }

    return { length: 0, items: {} };
}

export const CartContextProvider = (props) => {
    const [cartState, dispatchCart] = useReducer(cartReducer, { length: 0, items: [], total: 0 });
    const patientId = useContext(UserContext).userId;

    const addItem = (item) => {
        dispatchCart({ type: 'ADD-ITEM', item: item, id: patientId });
    };

    const removeItem = (itemID) => {
        dispatchCart({ type: 'REMOVE-ITEM', itemID: itemID, id: patientId });
    }
    const removeAll = (itemID) => {
        dispatchCart({ type: 'REMOVE-ALL', itemID: itemID, id: patientId });
    }
    const initItem = (item) => {
        dispatchCart({ type: 'SET-ITEM', item: item });
    }
    const clearCart = () => {
        dispatchCart({ type: 'CLEAR-CART', id: patientId });
    }

    return (
        <CartContext.Provider value={{
            items: cartState.items,
            length: cartState.length,
            total: cartState.total,
            addItem: addItem,
            removeItem: removeItem,
            removeAll: removeAll,
            initItem: initItem,
            clearCart: clearCart
        }}>
            {props.children}
        </CartContext.Provider>
    );
};

export default CartContext;