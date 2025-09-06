import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProductById, fetchComments, postComment } from "../api";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  // بارگذاری محصول و دیدگاه‌ها
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchProductById(id);
        if (!data) {
          toast.error("محصول یافت نشد");
          setLoading(false);
          return;
        }
        setProduct(data);

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

  // افزودن محصول به سبد خرید
  const handleAddToCart = () => {
    if (!product) return;
    addToCart(
      {
        id: product.id || product._id,
        brand: product.brand,
        model: product.model,
        priceUSD: product.priceUSD,
        thumbnail: product.thumbnail,
        avator: product.avator,
      },
      1
    );
    toast.success(`${product.brand} ${product.model} به سبد اضافه شد ✅`);
  };

  // ارسال دیدگاه جدید
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const added = await postComment(id, newComment);
      setComments((prev) => [...prev, added]);
      setNewComment("");
      toast.success("دیدگاه شما ثبت شد ✅");
    } catch (err) {
      console.error(err);
      toast.error("خطا در ثبت دیدگاه!");
    }
  };

  // لودینگ و خطا
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 animate-pulse">
        در حال بارگذاری محصول...
      </div>
    );

  if (!product)
    return <p className="text-red-500 p-4">محصول یافت نشد</p>;

  return (
    <div className="p-4 md:p-10 min-h-screen bg-gray-50 space-y-8">

      {/* جزئیات محصول */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6 md:flex gap-8">
        <img
          src={product.avator || product.thumbnail || "https://via.placeholder.com/400x300"}
          alt={`${product.brand} ${product.model}`}
          className="w-full md:w-1/2 h-[300px] md:h-[400px] object-cover rounded-lg"
          loading="lazy"
        />
        <div className="md:flex-1 mt-4 md:mt-0 space-y-2">
          <h2 className="text-2xl font-bold">{product.brand} {product.model}</h2>
          <p className="text-gray-700">Price: ${product.priceUSD}</p>
          <p className="text-gray-600">{product.categoryName}</p>
          <p className="text-gray-700 mt-2">{product.description}</p>
          <button
            onClick={handleAddToCart}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            افزودن به سبد خرید
          </button>
        </div>
      </div>

      {/* دیدگاه‌ها */}
      <section className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6 space-y-4">
        <h3 className="text-xl font-bold mb-4">دیدگاه‌ها</h3>

        {/* فرم ارسال دیدگاه */}
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
            disabled={!newComment.trim()}
            className={`px-4 py-2 rounded-lg text-white transition-colors ${
              newComment.trim()
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            ارسال
          </button>
        </div>

        {/* نمایش دیدگاه‌ها */}
        {comments.length > 0 ? (
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
      </section>
    </div>
  );
};

export default ProductDetails;
