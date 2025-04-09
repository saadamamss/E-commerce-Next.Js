function updateLocalStorage(value: Object) {
  window.localStorage.setItem("wishlist", JSON.stringify(value));
}
export default function wishlistReducer(state: any[], action: any) {
  const data = action.payload;

  switch (action.type) {
    case "ADD_TO_LIST":
      state = [...state, data];
      updateLocalStorage(state);
      return state;

    case "ADD_DEFAULT":
      return data;

    case "REMOVE_ITEM":
      state = state.filter((i) => i != data);
      updateLocalStorage(state);
      return state;

    default:
      return state;
  }
}
