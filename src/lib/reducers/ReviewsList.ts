export default function reviewsReducer(state: any[], action: any) {
  const { review } = action.payload;
  switch (action.type) {
    case "ADD_TO_LIST":
      return [...state, review];
    case "SET_LIST":
      return review;

    default:
      return state;
  }
}
