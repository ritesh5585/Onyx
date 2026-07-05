# Developer Notes: Wiring up the Cart Logic

The Cart UI is ready. You need to wire up **3 handler functions** and **2 API endpoints**. Follow these steps:

## STEP 1: Redux Slice (`features/cart/state/cart.slice.js`)
Currently you have `setItems` and `addItems`. Add 2 more reducers:

1. **`removeItem`**: Removes an item by `_id`.
   ```javascript
   removeItem: (state, action) => {
     state.items = state.items.filter(item => item._id !== action.payload);
   }
   ```
2. **`updateItemQty`**: Updates quantity of a specific item.
   ```javascript
   updateItemQty: (state, action) => {
     const { cartItemId, quantity } = action.payload;
     const item = state.items.find(i => i._id === cartItemId);
     if (item) item.quantity = quantity;
   }
   ```
*(Export these actions from the slice).*

## STEP 2: API Service Layer (`features/cart/service/cart.api.js`)
Add 2 new API functions:

1. **`removeFromCart`**:
   ```javascript
   export const removeFromCart = async (cartItemId) => {
     return await api.delete(`/remove/${cartItemId}`).then(res => res.data);
   };
   ```
2. **`updateCartQty`**:
   ```javascript
   export const updateCartQty = async (cartItemId, quantity) => {
     return await api.patch(`/update/${cartItemId}`, { quantity }).then(res => res.data);
   };
   ```

## STEP 3: Custom Hook (`features/cart/hooks/useCart.js`)
Add these handlers to your hook:

1. **`handleRemoveItem(cartItemId)`**: Call API `removeFromCart`, on success dispatch `removeItem`, on error throw.
2. **`handleIncrementQty(cartItemId, currentQty)`**: `newQty = currentQty + 1`. Call API `updateCartQty`, on success dispatch `updateItemQty`.
3. **`handleDecrementQty(cartItemId, currentQty)`**: `newQty = currentQty - 1` (ensure > 0). Call API, on success dispatch.

*(Return these from the hook).*

## STEP 4: Wiring in `Cart.jsx`
1. Destructure the new handlers from `useCart()` inside `Cart.jsx`.
2. Find the `TODO` comments in the `CartItem` component.
3. Add `try/catch` blocks inside the `onClick` handlers and call the hook functions. Use `showToast` to display errors or success messages.

## STEP 5: Backend Routes
Create these Express routes:
1. `DELETE /api/cart/remove/:cartItemId` -> Removes item from user's cart in DB.
2. `PATCH /api/cart/update/:cartItemId` -> Updates item quantity in DB (validate `quantity >= 1` and `quantity <= stock`).
0

/*
 ╔══════════════════════════════════════════════════════════════════════════╗
 ║                                                                        ║
 ║   📋  DEVELOPER NOTES — WHAT YOU NEED TO DO (LOGIC SIDE)               ║
 ║                                                                        ║
 ║   The entire UI is done. You only need to wire up 3 handler functions  ║
 ║   and 2 API endpoints. Read each section below carefully.              ║
 ║                                                                        ║
 ╚══════════════════════════════════════════════════════════════════════════╝

 ┌──────────────────────────────────────────────────────────────────────────┐
 │  STEP 1 — cart.slice.js (Redux Slice)                                   │
 │  File: features/cart/state/cart.slice.js                                 │
 ├──────────────────────────────────────────────────────────────────────────┤
 │                                                                         │
 │  Currently you have: setItems, addItems                                 │
 │  You need to add 2 more reducers:                                       │
 │                                                                         │
 │  ① removeItem — removes one item from the array by its _id              │
 │     HOW: Filter the items array, keep everything except the one         │
 │          whose _id matches action.payload                               │
 │                                                                         │
 │     removeItem: (state, action) => {                                    │
 │       state.items = state.items.filter(                                 │
 │         item => item._id !== action.payload                             │
 │       );                                                                │
 │     }                                                                   │
 │                                                                         │
 │  ② updateItemQty — updates quantity of a specific item                  │
 │     HOW: Find the item by _id, then update its quantity field           │
 │                                                                         │
 │     updateItemQty: (state, action) => {                                 │
 │       const { cartItemId, quantity } = action.payload;                  │
 │       const item = state.items.find(i => i._id === cartItemId);        │
 │       if (item) item.quantity = quantity;                               │
 │     }                                                                   │
 │                                                                         │
 │  WHY DOES THIS WORK?                                                    │
 │  → Redux Toolkit uses Immer under the hood, so you CAN mutate          │
 │    state directly inside reducers (it handles immutability for you).    │
 │                                                                         │
 │  Don't forget to export:                                                │
 │  export const { setItems, addItems, removeItem, updateItemQty }        │
 │    = cartSlice.actions;                                                 │
 │                                                                         │
 └──────────────────────────────────────────────────────────────────────────┘

 ┌──────────────────────────────────────────────────────────────────────────┐
 │  STEP 2 — cart.api.js (API Service Layer)                               │
 │  File: features/cart/service/cart.api.js                                 │
 ├──────────────────────────────────────────────────────────────────────────┤
 │                                                                         │
 │  Currently you have: addToCart, getCart                                  │
 │  You need to add 2 more API functions:                                  │
 │                                                                         │
 │  ① removeFromCart — tells the backend to remove an item                 │
 │                                                                         │
 │     export const removeFromCart = async (cartItemId) => {               │
 │       return await api.delete(`/remove/${cartItemId}`)                  │
 │         .then(res => res.data);                                         │
 │     };                                                                  │
 │                                                                         │
 │  ② updateCartQty — tells the backend to change item quantity            │
 │                                                                         │
 │     export const updateCartQty = async (cartItemId, quantity) => {      │
 │       return await api.patch(`/update/${cartItemId}`, { quantity })     │
 │         .then(res => res.data);                                         │
 │     };                                                                  │
 │                                                                         │
 │  WHY .then(res => res.data)?                                            │
 │  → Axios wraps the response in a { data, status, headers } object.     │
 │    By chaining .then(res => res.data), you extract just the server's   │
 │    response body. This is your existing pattern in addToCart/getCart.   │
 │                                                                         │
 └──────────────────────────────────────────────────────────────────────────┘

 ┌──────────────────────────────────────────────────────────────────────────┐
 │  STEP 3 — useCart.js (Custom Hook)                                      │
 │  File: features/cart/hooks/useCart.js                                    │
 ├──────────────────────────────────────────────────────────────────────────┤
 │                                                                         │
 │  Currently you have: handleAddtoCart, handleGetCart                      │
 │  You need to add 3 new handler functions:                               │
 │                                                                         │
 │  ① handleRemoveItem(cartItemId)                                         │
 │     FLOW:                                                               │
 │       1. Call removeFromCart(cartItemId) from cart.api.js                │
 │       2. On success → dispatch(removeItem(cartItemId))                  │
 │       3. On error → console.error + throw error (so Cart.jsx            │
 │          can catch it and show error toast)                              │
 │                                                                         │
 │  ② handleIncrementQty(cartItemId, currentQty)                           │
 │     FLOW:                                                               │
 │       1. const newQty = currentQty + 1                                  │
 │       2. Call updateCartQty(cartItemId, newQty) from cart.api.js         │
 │       3. On success → dispatch(updateItemQty({cartItemId, quantity: newQty}))│
 │       4. On error → console.error + throw                              │
 │                                                                         │
 │  ③ handleDecrementQty(cartItemId, currentQty)                           │
 │     FLOW:                                                               │
 │       1. Guard: if (currentQty <= 1) return; // don't go below 1       │
 │       2. const newQty = currentQty - 1                                  │
 │       3. Call updateCartQty(cartItemId, newQty)                          │
 │       4. On success → dispatch(updateItemQty({cartItemId, quantity: newQty}))│
 │       5. On error → console.error + throw                              │
 │                                                                         │
 │  WHY THROW ERRORS?                                                      │
 │  → When you throw the error, the Cart.jsx component can use             │
 │    try/catch around the handler call to show success or error toasts.   │
 │    This keeps the error handling in the UI where the user can see it.   │
 │                                                                         │
 │  Don't forget to return the new handlers:                               │
 │  return { handleAddtoCart, handleGetCart,                                │
 │           handleRemoveItem, handleIncrementQty, handleDecrementQty };   │
 │                                                                         │
 │  Don't forget to import new functions at the top:                       │
 │  import { addToCart, getCart, removeFromCart, updateCartQty }            │
 │    from "../service/cart.api";                                           │
 │  import { addItems, setItems, removeItem, updateItemQty }              │
 │    from "../state/cart.slice";                                           │
 │                                                                         │
 └──────────────────────────────────────────────────────────────────────────┘

 ┌──────────────────────────────────────────────────────────────────────────┐
 │  STEP 4 — Wiring in Cart.jsx (THIS FILE)                                │
 ├──────────────────────────────────────────────────────────────────────────┤
 │                                                                         │
 │  Once Steps 1-3 are done, update this file:                             │
 │                                                                         │
 │  ① Destructure new handlers from useCart:                                │
 │     const { handleGetCart, handleRemoveItem,                            │
 │             handleIncrementQty, handleDecrementQty } = useCart();       │
 │                                                                         │
 │  ② Replace the 4 TODO comments with onClick handlers:                   │
 │                                                                         │
 │     Decrement button (−):                                               │
 │       onClick={async () => {                                            │
 │         try {                                                           │
 │           await handleDecrementQty(item._id, qty);                      │
 │         } catch { showToast("Failed to update quantity", "error"); }    │
 │       }}                                                                │
 │                                                                         │
 │     Increment button (+):                                               │
 │       onClick={async () => {                                            │
 │         try {                                                           │
 │           await handleIncrementQty(item._id, qty);                      │
 │         } catch { showToast("Failed to update quantity", "error"); }    │
 │       }}                                                                │
 │                                                                         │
 │     Remove button (✕ Remove):                                           │
 │       onClick={async () => {                                            │
 │         try {                                                           │
 │           await handleRemoveItem(item._id);                             │
 │           showToast("Item removed from cart", "success");               │
 │         } catch { showToast("Failed to remove item", "error"); }       │
 │       }}                                                                │
 │                                                                         │
 │     Checkout button:                                                    │
 │       onClick={() => navigate("/checkout")}                             │
 │       (or wherever your checkout route will be)                         │
 │                                                                         │
 └──────────────────────────────────────────────────────────────────────────┘

 ┌──────────────────────────────────────────────────────────────────────────┐
 │  STEP 5 — Backend Routes (Express/Node.js)                              │
 ├──────────────────────────────────────────────────────────────────────────┤
 │                                                                         │
 │  You need 2 new routes in your cart router on the backend:              │
 │                                                                         │
 │  ① DELETE  /api/cart/remove/:cartItemId                                 │
 │     → Find the user's cart (via auth middleware)                        │
 │     → Find the item inside cart.items with matching _id                 │
 │     → Remove it using pull or filter                                    │
 │     → Save and return the updated cart                                  │
 │                                                                         │
 │  ② PATCH   /api/cart/update/:cartItemId                                 │
 │     → Body: { quantity: Number }                                        │
 │     → Find the user's cart, find the item by _id                       │
 │     → Validate: quantity >= 1 AND quantity <= product/variant stock     │
 │     → Update item.quantity = quantity                                   │
 │     → Save and return the updated cart                                  │
 │                                                                         │
 │  WHY VALIDATE ON BACKEND?                                               │
 │  → The frontend already disables buttons at boundaries (qty <= 1       │
 │    and qty >= stock), but backend validation is a safety net.           │
 │    Never trust the client — always re-validate on the server.          │
 │                                                                         │
 └──────────────────────────────────────────────────────────────────────────┘

 ┌──────────────────────────────────────────────────────────────────────────┐
 │  🔄  COMPLETE DATA FLOW (How it all connects)                           │
 ├──────────────────────────────────────────────────────────────────────────┤
 │                                                                         │
 │  User clicks "+" button on a cart item                                  │
 │    │                                                                    │
 │    ▼                                                                    │
 │  Cart.jsx calls handleIncrementQty(itemId, currentQty)                  │
 │    │                                                                    │
 │    ▼                                                                    │
 │  useCart hook calculates newQty = currentQty + 1                        │
 │    │                                                                    │
 │    ▼                                                                    │
 │  Calls updateCartQty(itemId, newQty) — sends PATCH to backend           │
 │    │                                                                    │
 │    ▼                                                                    │
 │  Backend validates & updates the DB, returns success                    │
 │    │                                                                    │
 │    ▼                                                                    │
 │  Hook dispatches updateItemQty({ cartItemId, quantity: newQty })        │
 │    │                                                                    │
 │    ▼                                                                    │
 │  Redux store updates items array (Immer handles immutability)           │
 │    │                                                                    │
 │    ▼                                                                    │
 │  useSelector in Cart.jsx detects the change → React re-renders          │
 │    │                                                                    │
 │    ▼                                                                    │
 │  UI shows the updated quantity. Done! ✅                                 │
 │                                                                         │
 │  Same flow for "−" (decrement) and "✕ Remove" (remove).                │
 │  The only difference is which API + reducer gets called.               │
 │                                                                         │
 └──────────────────────────────────────────────────────────────────────────┘
*/
