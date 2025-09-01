// src/pages/Product.jsx
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { fetchProducts } from "../api";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";

const PRODUCTS_PER_PAGE = 12;

const Product = () => {
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const banner = useMemo(() => {
    return <h2 className="text-2xl font-bold mb-6">محصولات</h2>
  }, []);

  const loadProducts = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProducts(page, PRODUCTS_PER_PAGE);
      if (data?.products) {
        setProducts(data.products);
        setTotalProducts(data.total);  // تعداد کل محصولات
        // حتی میتونی به جای محاسبه دستی، totalPages از بک‌اند بگیری
      }
      else {
        setProducts([]);
        setTotalProducts(0);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "خطا در دریافت محصولات");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts(currentPage);
  }, [currentPage, loadProducts]);

  const totalPages = useMemo(() => Math.ceil(totalProducts / PRODUCTS_PER_PAGE), [totalProducts]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  if (loading) return <p className="p-4 animate-pulse">در حال بارگذاری محصولات...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!products.length) return <p className="p-4 text-gray-500">محصولی یافت نشد.</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {banner}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination currentPage={currentPage} totalPages={totalPages} goToPage={goToPage} />
        </div>
      )}
    </div>
  );
};

export default Product;
