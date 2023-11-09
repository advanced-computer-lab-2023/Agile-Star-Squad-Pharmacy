import React, { useReducer } from 'react';

const CartContext = React.createContext({
    length: 0,
    items: [],
    total: 0,
    addItem: (item) => { },
    removeItem: (itemID) => { }
});

const cartReducer = (state, action) => {
    if (action.type === 'ADD-ITEM') {
        const newLength = state.length + parseInt(action.item.quantity);
        const newTotal = +state.total + (parseFloat(action.item.price) * parseInt(action.item.quantity));
        const existingItemIndex = state.items.findIndex((item) => item.id === action.item.id);
        if (existingItemIndex === -1) {
            return { length: newLength, items: [action.item, ...state.items], total: newTotal.toFixed(2)};
        } else {
            state.items[existingItemIndex].quantity = state.items[existingItemIndex].quantity + parseInt(action.item.quantity);
           
            return {length: newLength, items: state.items, total: newTotal.toFixed(2)}
        }
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
        return { length: state.length - 1, items: state.items, total: newTotal.toFixed(2) };
    }

    return { length: 0, items: {} };
}

export const CartContextProvider = (props) => {
    const [cartState, dispatchCart] = useReducer(cartReducer, { length: 0, items: [], total: 0 });

    const addItem = (item) => {
        dispatchCart({ type: 'ADD-ITEM', item: item });
    };

    const removeItem = (itemID) => {
        dispatchCart({ type: 'REMOVE-ITEM', itemID: itemID });
    }

    return (
        <CartContext.Provider value={{
            items: cartState.items,
            length: cartState.length,
            total: cartState.total,
            addItem: addItem,
            removeItem: removeItem
        }}>
            {props.children}
        </CartContext.Provider>
    );
};

export default CartContext;