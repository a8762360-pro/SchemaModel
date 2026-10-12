const express = require('express');
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const app = express();

const port = 3000;

app.use(express.json());

// create product schema
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// CURD operation

// Create
app.post("/products", async (req, res) => {
    try {
        const title = req.body.title
        const price = req.body.price
        const description = req.body.description
        const newProduct = new Product({
            title: title,
            price: price,
            description: description
        });
        const productData = await newProduct.save()
        res.status(201).send(productData)

        // res.status(201).send({title, price, description})
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

// get operation
app.get("/products", async (req, res) => {
    try {
        const products = await Product.find().sort({ price: -1 });
        if (products) {
            res.status(200).send({
                success: true,
                message: "return all products",
                data: products
            })
        } else {
            res.status(400).send({
                seccess: false,
                message: "product is not found"
            })
        }
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

// get operation
app.get("/products/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findOne({ _id: id });
        if (product) {
            res.status(200).send({
                success: true,
                message: "return a product",
                data: product,
            })
        } else {
            res.status(400).send({
                seccess: false,
                message: "product is not found"
            })
        }
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

// delete product
app.delete("/products/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const query = {
            _id: new ObjectId(id)
        }
        const product = await Product.findOneAndDelete(query);
        if (product) {
            res.status(200).send({
                success: true,
                message: "delete a product",
                data: product
            })
        } else {
            res.status(400).send({
                seccess: false,
                message: "product is not found"
            })
        }
        res.send(product)
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

// update product
app.put("/products/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const query = {
            _id: new ObjectId(id)
        }
        const product = await Product.updateOne( query , {
            $set: {
                price: 20000
            }
        })
        res.send(product)
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

// product model
const Product = mongoose.model("product", productSchema)

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017')
        console.log("db is connected")
    }
    catch (error) {
        console.log(`db is not connected ${error}`)
        process.exit(1)
    }
}

connectDB();




app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})

app.get("/", (req, res) => {
    res.send("welcome to home page")
})