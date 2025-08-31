import React, { useEffect, useState, useMemo, lazy, Suspense } from "react";
import { fetchProducts } from "../api";

const ProductSlider = lazy(() => import("../components/ProductSlider"));
const PromoBanner = lazy(() => import("../components/PromoBanner"));
const SearchBar = lazy(() => import("../components/SearchBar"));


const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProducts()
      .then((data) => {
        const items =
          Array.isArray(data) ? data :
            data?.products && Array.isArray(data.products) ? data.products :
              [];
        setProducts(items);
      })
      .catch(() => setError("مشکلی در دریافت محصولات پیش آمد."))
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p =>
      p.brand.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);
  const banner = useMemo(() => {
    return <PromoBanner massage={"🎉 تخفیف ویژه تا پنجاه برای مدت محدود!"} />
  }, []);
  return (
    <div className="min-h-screen min-w-screen">
      <Suspense fallback={<div className="py-10 text-center text-gray-300">در حال بارگذاری...</div>}>
        {banner}
        <div className="flex justify-center mt-6 px-4">
          <SearchBar search={search} setSearch={setSearch} />
        </div>

        {loading && (
          <div className="flex justify-center items-center py-10">
            <p className="text-gray-300 animate-pulse">در حال بارگذاری...</p>
          </div>
        )}
        {error && (
          <div className="flex justify-center items-center py-10">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <section className="mt-10 px-6">
            <ProductSlider products={filteredProducts} />
          </section>
        )}
      </Suspense>
    </div>
  );
};

export default Home;
