"use client";
import Header from "@/components/Header";
import { useState, useEffect } from "react";

export default function Home() {
  const [productForm, setProductForm] = useState({});
  const [products, setProducts] = useState([]);
  const [alert, setalert] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingaction, setLoadingaction] = useState(false);
  const [dropdown, setDropdown] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('/api/product');
      let rjson = await response.json();
      setProducts(rjson.allProducts);
    };
    fetchProducts();
  }, []);

  const buttonAction = async (action, slug, initialQuantity) => {
    // Immediately change the quantity of the product with given slug in Products
    let index = products.findIndex((item) => item.slug == slug);
    let newProducts = JSON.parse(JSON.stringify(products));
    if (action == "plus") {
      newProducts[index].quantity = parseInt(initialQuantity) + 1;
    } else {
      newProducts[index].quantity = parseInt(initialQuantity) - 1;
    }
    setProducts(newProducts);

    // Immediately change the quantity of the product with given slug in Dropdown
    let indexdrop = dropdown.findIndex((item) => item.slug == slug);
    let newDropdown = JSON.parse(JSON.stringify(dropdown));
    if (action == "plus") {
      newDropdown[indexdrop].quantity = parseInt(initialQuantity) + 1;
    } else {
      newDropdown[indexdrop].quantity = parseInt(initialQuantity) - 1;
    }
    setDropdown(newDropdown);

    setLoadingaction(true);
    const response = await fetch('/api/action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action, slug, initialQuantity })
    });
    let r = await response.json();
    setLoadingaction(false);
  };

  const addProduct = async (e) => {
    try {
      const response = await fetch('/api/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productForm)
      });

      if (response.ok) {
        setalert("Your product added successfully!");
        setProductForm({});
      } else {
        console.error('Failed to add product');
      }
    } catch (error) {
      console.error('Failed:', error);
    }
    // Fetch all the products again to sync back
    const response = await fetch('/api/product');
    let rjson = await response.json();
    setProducts(rjson.allProducts);
    e.preventDefault();
  };

  const handleChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };

  const onDropdownEdit = async (e) => {
    let value = e.target.value;
    setQuery(value);
    if (value.length > 3) {
      setLoading(true);
      setDropdown([]);
      const response = await fetch('/api/search?query=' + query);
      let rjson = await response.json();
      setDropdown(rjson.allProducts);
      setLoading(false);
    } else {
      setDropdown([]);
    }
  };

  return (
    <div className=" bg-amber-100 min-h-screen">
      <Header />
      <div className="container my-6 mx-auto p-4">
        <div className='text-green-800 text-center'>{alert}</div>
        <h1 className="text-3xl font-semibold mb-6">Search a Product</h1>
        <div className="flex mb-2">
          <input onChange={onDropdownEdit} type="text" placeholder="Enter a product name" 
            className="flex-1 border border-gray-300 px-4 py-2 rounded-l-md" />
          <select className="border border-gray-300 px-4 py-2 rounded-r-md">
            <option value="">All</option>
            <option value="category1">Category 1</option>
            <option value="category2">Category 2</option>
          </select>
        </div>
        {loading && (
          <div className="flex justify-center items-center">
            <svg width="50" height="50" viewBox="0 0 50 50">
              <circle cx="25" cy="25" r="20" stroke="black" strokeWidth="5" fill="none" strokeLinecap="round">
                <animate attributeName="stroke-dashoffset" values="0;502.4" dur="1.5s" keyTimes="0;1" repeatCount="indefinite"/>
                <animate attributeName="stroke-dasharray" values="31.4 31.4;1 150" dur="1.5s" keyTimes="0;1" repeatCount="indefinite"/>
              </circle>
            </svg>
          </div>
        )}
        {query && dropdown.length > 0 && (
          <div className="mt-4 bg-white shadow-md rounded-lg overflow-hidden">
            <div className="bg-gray-100 px-4 py-2">
              <h2 className="text-lg font-semibold text-gray-800">Search Results</h2>
            </div>
            {dropdown.map(item => (
              <div key={item.slug} className="flex justify-between items-center p-4 border-b border-gray-200">
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-gray-900">{item.slug}</h3>
                  <p className="text-sm text-gray-600">{item.category}</p>
                </div>
                <div className="text-right flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <button onClick={() => { buttonAction("minus", item.slug, item.quantity ) }} disabled={loadingaction} className="subtract inline-block px-3 py-1 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md disabled:bg-blue-200"> - </button>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    <button onClick={() => { buttonAction("plus", item.slug, item.quantity) }} disabled={loadingaction} className="add inline-block px-3 py-1 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md disabled:bg-blue-200"> + </button>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="text-sm text-gray-500">Price: ₹{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {query && !loading && dropdown.length === 0 && (
          <div className="mt-4 text-center text-gray-500">No matching products found.</div>
        )}
      </div>

      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-semibold mb-6 text-black-600">Add a Product</h1>
        <form className="bg-white rounded px-8 pt-6 pb-8 mb-4" onSubmit={addProduct}>
          <div className="mb-4">
            <label htmlFor="productName" className="block text-gray-600 text-lg font-bold mb-2">Product Slug</label>
            <input value={productForm?.slug || ""} name='slug' onChange={handleChange} type="text" id="productName" className="w-full border rounded py-3 px-4 text-gray-600 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          <div className="mb-4">
            <label htmlFor="category" className="block text-gray-600 text-lg font-bold mb-2">Category</label>
            <input value={productForm?.category || ""} name='category' onChange={handleChange} type="text" id="category" className="w-full border rounded py-3 px-4 text-gray-600 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          <div className="mb-4">
            <label htmlFor="quantity" className="block text-gray-600 text-lg font-bold mb-2">Quantity</label>
            <input value={productForm?.quantity || ""} name='quantity' onChange={handleChange} type="number" id="quantity" className="w-full border rounded py-3 px-4 text-gray-600 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          <div className="mb-4">
            <label htmlFor="price" className="block text-gray-600 text-lg font-bold mb-2">Price</label>
            <input value={productForm?.price || ""} name='price' onChange={handleChange} type="number" id="price" className="w-full border rounded py-3 px-4 text-gray-600 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline text-lg">
            Add Product
          </button>
        </form>
      </div>

      <div className="container my-0 mx-auto p-4">
        <h1 className="text-3xl font-semibold mb-4 text-black-600">Display Current Stock</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b-2 border-gray-300 text-left">Product Name</th>
                <th className="py-2 px-4 border-b-2 border-gray-300 text-left">Category</th>
                <th className="py-2 px-4 border-b-2 border-gray-300 text-left">Quantity</th>
                <th className="py-2 px-4 border-b-2 border-gray-300 text-left">Price</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(products) && products.length > 0 ? (
                products.map(product => (
                  <tr key={product.slug}>
                    <td className="py-2 px-4 border-b border-gray-300">{product.slug}</td>
                    <td className="py-2 px-4 border-b border-gray-300">{product.category}</td>
                    <td className="py-2 px-4 border-b border-gray-300">{product.quantity}</td>
                    <td className="py-2 px-4 border-b border-gray-300">₹{product.price}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-2 px-4 text-center">No products available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
