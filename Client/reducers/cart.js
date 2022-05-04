export default (cartItems=[],action)=>{
    switch (action.type) {
        case 'FETCH_ALL':
           return action.payload;
        case 'REMOVE_ITEM':
            return cartItems.filter(ele=> ele._id!=action.payload._id)
        default:
            return cartItems;
    }
}