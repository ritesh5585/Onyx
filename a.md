npm i razorpay

service ke ander jaake - payment.service.js

import razorpay
import config

const razarpay = new Razerpay({
access both api key from config
})

export const createOrder = async ({ amount : 1000, currency: 'inr}){
const options = {
amount = amount \* 100
currency
}
const order = await razarpay.orders.create(options)

return order
}

go to Cart.Router and create one API

req.post('/payment/create/order', middleware, controller)

middleware: authenticateuser
controller: go to cart.controller>

export const createOrderPayment = async (a, b){
const order = await createOrder({ amount: 1000, currency: 'INR'})

    return res.status(200).json({
       message: '---',
       order

})
}

Frontend
cart > service > export const createCartOrder and call api from backend

go to useCart > create handleCreatePaymentOrder

integrate in UI pages

in cart page create one function as handleCheckOut

install reacte razorpay for page of frontend for payment 

we will use Hooks after importing razorpay

const {error, isLoading, Razorpay} = useRazorpay()

take code from react razorpay

implement it and then  payment page is availble than

we will  get an object from Razorpay after payments