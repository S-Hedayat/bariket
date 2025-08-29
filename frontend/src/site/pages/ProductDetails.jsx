// src/pages/ProductDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProductById, fetchComments, postComment } from "../api";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const { addToCart } = useCart();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [commentsLoading, setCommentsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchProductById(id);
        setProduct(data);

        const commentsData = await fetchComments(id);
        setComments(commentsData);
      } catch (err) {
        console.error(err);
        setError("خطا در دریافت اطلاعات محصول.");
      } finally {
        setLoading(false);
        setCommentsLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const added = await postComment(id, newComment, 1); // فرضاً accountID = 1
      setComments([...comments, added]);
      setNewComment("");
    } catch (err) {
      console.error(err);
      toast.error("خطا در ثبت دیدگاه!");
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, 1);
    toast.success(`${product.brand} ${product.model} به سبد اضافه شد ✅`);
  };

  // آدرس تصویر با سایز ثابت
  const imageUrl =
    product?.avator?.length
      ? product.avator.startsWith("http")
        ? product.avator
        : `http://localhost:5000${product.avator}`
      : "https://via.placeholder.com/400x300?text=No+Image";

  return (
    <div className="p-4 md:p-10 min-h-screen bg-gray-50">
      {loading ? (
        <div className="max-w-6xl mx-auto animate-pulse">
          <div className="bg-gray-300 h-[400px] w-full md:w-1/2 rounded-lg mb-6 md:mb-0 md:inline-block" />
          <div className="space-y-4 mt-4 md:mt-0 md:inline-block md:w-1/2">
            <div className="h-8 bg-gray-300 rounded w-1/3" />
            <div className="h-6 bg-gray-300 rounded w-1/4" />
            <div className="h-6 bg-gray-300 rounded w-1/2" />
            <div className="h-10 bg-gray-300 rounded w-1/5 mt-4" />
          </div>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <>
          <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6 md:flex gap-8">
            {/* تصویر */}
            <img
              src={imageUrl}
              alt={`${product.brand} ${product.model}`}
              width={400}
              height={300}
              className="w-full md:w-1/2 h-[300px] md:h-[400px] object-cover rounded-lg"
              loading="lazy"
            />

            {/* جزئیات */}
            <div className="md:flex-1 mt-4 md:mt-0 space-y-2">
              <h2 className="text-2xl font-bold">
                {product.brand} {product.model}
              </h2>
              <p className="text-gray-700">CPU: {product.cpu || "-"}</p>
              <p className="text-gray-700">RAM: {product.ram || "-"}</p>
              <p className="text-gray-700">Storage: {product.storage || "-"}</p>
              <p className="text-gray-700">OS: {product.os || "-"}</p>
              <p className="text-gray-900 font-bold text-xl">
                Price: ${product.priceUSD || 0}
              </p>
              {product.offs > 0 && (
                <p className="text-red-500 font-semibold">Off: {product.offs}%</p>
              )}
              <button
                onClick={handleAddToCart}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                افزودن به سبد خرید
              </button>
            </div>
          </div>

          {/* کامنت‌ها */}
          <div className="max-w-6xl mx-auto mt-8 bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">دیدگاه‌ها</h3>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
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

            {commentsLoading ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-full" />
                <div className="h-4 bg-gray-300 rounded w-5/6" />
                <div className="h-4 bg-gray-300 rounded w-4/6" />
              </div>
            ) : comments.length > 0 ? (
              <div className="space-y-2">
                {comments.map((c) => (
                  <p key={c.id || c._id} className="text-gray-700 border-b pb-1">
                    {c.content}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">هیچ دیدگاهی ثبت نشده است.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductDetails;
