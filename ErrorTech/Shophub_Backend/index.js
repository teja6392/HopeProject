const cors = require("cors")
const express = require("express")
const stripe = require("stripe")("sk_test_51Kg6ZlSAPN3T9EBT5K75zaJPWrqgu2ucXoeTdICDEb3nm4Ucsh5zB8dkWZE1iQqxJDNnaXO9tb1tCRyWpgfF1WXq00woTU2y5S")
const { v4: uuidv4 } = require('uuid')

var amount1 = 0

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
    product.map((prdct)=>{
        console.log("PRODUCT",prdct)
        console.log("price",prdct.price)
        amount1 = amount1 + prdct.price
    })
    const idempotencyKey = uuidv4()
    
    return stripe.customers.create({
        email:token.email,
        source:token.id
    }).then( customer => {
        stripe.charges.create({ 
            amount:amount1*100,
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
