import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    weight: "",
    price: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    // Validate product name - only letters allowed
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!product.name.trim()) {
      setError("Product name is required");
      return false;
    }
    if (!nameRegex.test(product.name)) {
      setError("Product name must contain only letters");
      return false;
    }

    // Validate weight - must be a number
    if (!product.weight.trim() || isNaN(product.weight) || product.weight <= 0) {
      setError("Weight is required and must be a positive number");
      return false;
    }

    // Validate price - must be a number
    if (!product.price.trim() || isNaN(product.price) || product.price <= 0) {
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
      const response = await fetch("http://localhost:5000/api/products/addproduct", {  
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add product");
      }

      setSuccess("Product added successfully!");
      setTimeout(() => navigate("/"), 1000); 
    } catch (error) {
      console.error("Error adding product:", error);
      setError(error.message || "An error occurred while adding the product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-2xl bg-white p-6 rounded-lg shadow-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Add Product</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{success}</div>
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
              Price (LKR)
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
            className="w-full bg-gray-500 text-white p-2 rounded hover:bg-green-600 transition-colors disabled:bg-gray-400"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "+ Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
