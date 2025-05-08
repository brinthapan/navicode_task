import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(3);
  const [notification, setNotification] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products/getproducts');
      setProducts(res.data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/deleteproduct/${id}`);
      setNotification('Product deleted successfully!');
      fetchProducts();
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Error deleting product:', error);
      setNotification('Error deleting product. Please try again.');
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleShow = (product) => {
    setSelectedProduct(product);
  };

  const handleClosePopup = () => {
    setSelectedProduct(null);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const handleNext = () => {
    if (currentPage < Math.ceil(products.length / productsPerPage)) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleEdit = (id) => {
    navigate(`/updateproduct/${id}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Products List</h1>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={() => navigate('/addproduct')}
        >
          Create New
        </button>
      </div>

      {notification && (
        <div
          className={`mb-4 p-4 text-white rounded ${
            notification.includes('Error') ? 'bg-red-500' : 'bg-green-500'
          }`}
        >
          {notification}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded">
          <thead className="bg-white">
            <tr>
              <th className="py-3 px-4 text-left">Created At</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Weight</th>
              <th className="py-3 px-4 text-left">Price</th>
              <th className="py-3 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product, index) => (
              <tr
                key={product._id}
                className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}
              >
                <td className="py-3 px-4">{new Date(product.createdAt).toLocaleString()}</td>
                <td className="py-3 px-4">{product.name}</td>
                <td className="py-3 px-4">{product.weight}</td>
                <td className="py-3 px-4">{product.price}</td>
                <td className="py-3 px-4 space-x-2">
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded"
                    onClick={() => handleEdit(product._id)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                    onClick={() => handleShow(product)}
                  >
                    Show
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {currentProducts.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-start space-x-2 mt-6">
        <button
          className="px-4 py-2 border rounded hover:text-blue-500"
          onClick={handlePrevious}
          disabled={currentPage === 1}
        >
          « Previous
        </button>
        <button
          className="px-4 py-2 border rounded hover:text-blue-500"
          onClick={handleNext}
          disabled={currentPage >= Math.ceil(products.length / productsPerPage)}
        >
          Next »
        </button>
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              onClick={handleClosePopup}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-center">Product Details</h2>
            <div className="space-y-2">
              <p><strong>Name:</strong> {selectedProduct.name}</p>
              <p><strong>Weight:</strong> {selectedProduct.weight} kg</p>
              <p><strong>Price:</strong> LKR :{selectedProduct.price}.00</p>
              <p><strong>Created At:</strong> {new Date(selectedProduct.createdAt).toLocaleString()}</p>
              <p><strong>Updated At:</strong> {new Date(selectedProduct.updatedAt).toLocaleString()}</p>
              <p><strong>ID:</strong> {selectedProduct._id}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
