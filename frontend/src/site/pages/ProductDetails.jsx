// src/pages/ProductDetails.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { fetchProducts, fetchComments, postComment } from "../api";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

const API_IMAGE_URL = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchProducts();
        const p = data.products.find(p => p.id === Number(id) || p.id === id);
        if (!p) {
          toast.error("محصول یافت نشد");
          setLoading(false);
          return;
        }

        // ساخت URL تصویر
        const thumbnailUrl = p.thumbnail
          ? `${API_IMAGE_URL}${p.thumbnail}`
          : p.avator
          ? `${API_IMAGE_URL}${p.avator}`
          : "https://via.placeholder.com/400x300";

        setProduct({ ...p, imageUrl: thumbnailUrl });

        // fetch comments
        const commentsData = await fetchComments(id);
        setComments(commentsData || []);
      } catch (err) {
        console.error(err);
        toast.error("خطا در دریافت اطلاعات محصول یا دیدگاه‌ها");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      brand: product.brand,
      model: product.model,
      priceUSD: product.priceUSD,
      thumbnail: product.thumbnail,
      avator: product.avator,
    }, 1);
    toast.success(`${product.brand} ${product.model} به سبد اضافه شد ✅`);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const added = await postComment(id, newComment);
      setComments(prev => [...prev, added]);
      setNewComment("");
      toast.success("دیدگاه شما ثبت شد ✅");
    } catch (err) {
      console.error(err);
      toast.error("خطا در ثبت دیدگاه!");
    }
  };

  if (loading) return <p className="p-4">در حال بارگذاری...</p>;
  if (!product) return <p className="text-red-500 p-4">محصول یافت نشد</p>;

  return (
    <div className="p-4 md:p-10 min-h-screen bg-gray-50 space-y-8">
      {/* Product Details */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6 md:flex gap-8">
        <img
          src={product.imageUrl}
          alt={`${product.brand} ${product.model}`}
          className="w-full md:w-1/2 h-[300px] md:h-[400px] object-cover rounded-lg"
          loading="lazy"
        />
        <div className="md:flex-1 mt-4 md:mt-0 space-y-2">
          <h2 className="text-2xl font-bold">{product.brand} {product.model}</h2>
          <p className="text-gray-700">Price: ${product.priceUSD}</p>
          <button
            onClick={handleAddToCart}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            افزودن به سبد خرید
          </button>
        </div>
      </div>

      {/* Comments */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6 space-y-4">
        <h3 className="text-xl font-bold mb-4">دیدگاه‌ها</h3>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="دیدگاه خود را بنویسید..."
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none"
          />
          <button
            onClick={handleAddComment}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            ارسال
          </button>
        </div>

        {comments.length > 0 ? (
          <div className="space-y-2">
            {comments.map(c => (
              <p key={c.id || c._id} className="text-gray-700 border-b pb-1">
                {c.content}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">هیچ دیدگاهی ثبت نشده است.</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
