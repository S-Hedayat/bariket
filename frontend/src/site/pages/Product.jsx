import React, { useEffect, useState, useMemo } from "react";
import { fetchProducts } from "../api";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  useEffect(() => {
    fetchProducts()
      .then((data) => {
        if (Array.isArray(data)) setProducts(data);
        else if (data?.products) setProducts(data.products);
        else setProducts([]);
      })
      .catch(() => setError("مشکلی در دریافت محصولات پیش آمد."))
      .finally(() => setLoading(false));
  }, []);

  const currentProducts = useMemo(() => {
    const start = (currentPage - 1) * productsPerPage;
    return products.slice(start, start + productsPerPage);
  }, [products, currentPage]);

  const totalPages = Math.ceil(products.length / productsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  if (loading) return <p className="p-4">در حال بارگذاری...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen p-6 bg-blue-100">
      <h1 className="text-3xl font-bold mb-6">محصولات</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
        {currentProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        goToPage={goToPage}
      />
    </div>
  );
};

export default Product;
