const init_state = {
    searchValue: "",
    qty: 0
};

export default (state = init_state, action) => {
    switch (action.type) {
        case "ON_CHANGE":
            return { ...state, cookieChecked: true, searchValue: action.payload }
        case "ADD_CART":
            return { ...state, cookieChecked: true, qty: action.payload }
        case "DELETE_CART":
            return { ...state, cookieChecked: true, qty: (state.qty - action.payload) }
        case "WISHLIST_TOCART":
            return { ...state, cookieChecked: true, qty: (state.qty + action.payload) }
        default:
            return { ...state };
    }
}