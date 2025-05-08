import Product from "../models/product.js";

// CREATE
const addProduct = async (req, res) => {
    try {
        const { name, weight, price } = req.body;

        const product = new Product({ name, weight, price });

        await product.save();
        res.status(201).json({ message: 'Product added successfully', data: product });
    } catch (error) {
        res.status(500).json({ message: 'Error adding product', error });
    }
};

// READ ALL
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json({ message: "Found products", data: products });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
};

// READ ONE
const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: "Found product", data: product });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product', error });
    }
};

// UPDATE
const updateProduct = async (req, res) => {
    try {
        const { name, weight, price } = req.body;

        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { name, weight, price },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product updated successfully', data: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
};

// DELETE
const deleteProduct = async (req, res) => {
    try {
        const deleted = await Product.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error });
    }
};

// SEARCH
const searchProducts = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.status(400).json({ message: 'Search query required' });

        const searchRegex = new RegExp(query, 'i');
        const products = await Product.find({ name: searchRegex });

        res.json({
            message: products.length > 0 ? 'Products found' : 'No products found',
            data: products
        });
    } catch (error) {
        res.status(500).json({ message: 'Error searching products', error });
    }
};

export default {
    addProduct,
    getAllProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    searchProducts
};
