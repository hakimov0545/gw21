import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import productModel from "./models/product.model.js";

const app = express();
app.use(cors());

const DB_URI = process.env.DB_URI;
if (!DB_URI) {
	console.error("DB_URI not found from .env");
	process.exit(1);
}

mongoose
	.connect(DB_URI)
	.then(() => {
		console.log("DB connected");
	})
	.catch((e) => {
		console.log("Error connecting with DB", e);
	});

app.use(express.json());

app.get("/products", async (req, res) => {
	const products = await productModel.find();
	res.json(products);
});

app.post("/products", async (req, res) => {
	const { title, price } = req.body;
	if (!price || !title)
		return res.status(400).json({
			message: "Title and price are required",
		});
	const product = await productModel.create({ title, price });
	res.status(201).json({
		message: "Product created",
		success: true,
		product,
	});
});

app.patch("/products/:id", async (req, res) => {
	const { id } = req.params;
	const { title, price } = req.body;
	const data = {};
	if (title) data.title = title;
	if (price) data.price = price;
	const newProduct = await productModel.findByIdAndUpdate(
		id,
		data,
		{ new: true },
	);
	res.json({
		message: "Product updated",
		success: true,
		product: newProduct,
	});
});

app.delete("/products/:id", async (req, res) => {
	const { id } = req.params;
	await productModel.findByIdAndDelete(id);
	res.json({ message: "Product deleted", success: true });
});

app.listen(3000, async () => {
	console.log("Server ishladi");
});
