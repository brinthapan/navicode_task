import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import ProductList from './pages/productlist'; 
import AddProduct from './pages/addproduct'; // Add product component
import UpdateProduct from './pages/editproduct';



const App = () => {
    return (
        <Router>
          
                <Routes>
                   
                    {/* <Route path="/" element={<Home />} /> */}

                

                    {/* Product management routes */}
                    <Route path="/productlist" element={<ProductList />} />
                     <Route path="/addproduct" element={<AddProduct />} />
                    <Route path="/updateproduct/:id" element={<UpdateProduct />} />
                    

                  
                </Routes>
  
             
         
        </Router>
    );
};

export default App;
