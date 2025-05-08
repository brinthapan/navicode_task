import express from "express";
import productController from "../controllers/productController.js";

const productRouter = express.Router();

// Route to get all products
productRouter.get("/getproducts", productController.getAllProducts);

// Route to get a specific product by ID
productRouter.get("/getproduct/:id", productController.getProduct);

// Route to create a new product
productRouter.post("/addproduct", productController.addProduct);

// Route to delete a product by ID
productRouter.delete("/deleteproduct/:id", productController.deleteProduct);

// Route to update a product by ID
productRouter.put("/updateproduct/:id", productController.updateProduct);

// Route to search products by query
productRouter.get("/searchproducts", productController.searchProducts);

export default productRouter;
