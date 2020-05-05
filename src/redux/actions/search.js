export const onchangeTodo =(text)=>{
    return {
        type: "ON_CHANGE",
        payload: text,
    };
  }

export const totalCart = (qty)=>{
    return{
        type: "ADD_CART",
        payload:qty
    }
}  
export const deleteQty = (qty)=>{
    return{
        type: "DELETE_CART",
        payload:qty
    }
}  
export const tambahQty = (qty)=>{
    return{
        type: "WISHLIST_TOCART",
        payload:qty
    }
}