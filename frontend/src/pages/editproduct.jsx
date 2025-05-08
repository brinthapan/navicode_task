import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState({
        name: "",
        weight: "",
        price: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/products/getproduct/${id}`);
                const { data } = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Failed to fetch product data");
                }

                setProduct({
                    name: data?.name || "",
                    weight: data?.weight || "",
                    price: data?.price || "",
                });
            } catch (err) {
                setError(err.message);
            }
        };

        fetchProduct();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prevProduct) => ({
            ...prevProduct,
            [name]: value,
        }));
    };

    const validateForm = () => {
        const nameRegex = /^[A-Za-z\s]+$/;

        if (!product.name) {
            setError("Product name is required");
            return false;
        }
        if (!nameRegex.test(product.name)) {
            setError("Product name must contain only letters");
            return false;
        }

        if (!product.weight || isNaN(product.weight) || parseFloat(product.weight) <= 0) {
            setError("Weight is required and must be a positive number");
            return false;
        }

        if (!product.price || isNaN(product.price) || parseFloat(product.price) <= 0) {
            setError("Price is required and must be a positive number");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const response = await fetch(`http://localhost:5000/api/products/updateproduct/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(product),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to update product");
            }

            setSuccess("Product updated successfully!");
            setTimeout(() => {
                navigate("/productlist");
            }, 1500);
        } catch (error) {
            setError(error.message || "An error occurred while updating the product");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md w-full">
                <h2 className="text-2xl font-bold mb-4 text-center">Edit Product</h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block font-semibold mb-1">
                            Product Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Enter product name"
                            value={product.name}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="weight" className="block font-semibold mb-1">
                            Weight (in kg)
                        </label>
                        <input
                            type="number"
                            id="weight"
                            name="weight"
                            placeholder="Enter weight"
                            value={product.weight}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="price" className="block font-semibold mb-1">
                            Price ($)
                        </label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            placeholder="Enter price"
                            value={product.price}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors disabled:bg-gray-400"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Updating..." : "Update Product"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProduct;
