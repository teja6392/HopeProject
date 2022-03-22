const cors = require("cors")
const express = require("express")
const stripe = require("stripe")("sk_test_51Kg6ZlSAPN3T9EBTNJDHii33HO4Jg6qAryeq0omncole0JUx9aCBBu3TNKsiXoqjpV00pDDqviMKHbG3UgTG1NHT00ssOARdzG")
const { v4: uuidv4 } = require('uuid')


const app = express()

//middleware
app.use(express.json())
app.use(cors())

//routes
app.get("/",(req,res)=>{
    res.send("It is working")
})

app.post("/payment",(req,res)=>{
    const {product,token} = req.body
    console.log("Product",product)
    console.log("price".at,product.price)
    const idempotencyKey = uuid()
    
    return stripe.customers.create({
        email:token.email,
        source:token.id
    }).then( customer => {
        stripe.changes.create({
            amount:product.price*100,
            currency:"usd",
            customer:customer.id,
            receipt_email:token.email,
            description:`purchase of ${product.name}`,
            shipping:{
                name:token.card.name,
                address:{
                    country:token.card.address_country
                }
            }
        })
    },{idempotencyKey}).then( result => res.status(200).json(result)).catch(err => console.log("ERROR MESSAGE",err))
})


//Listen
app.listen(8282,()=>console.log("LISTENING AT PORT"))
