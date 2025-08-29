import React, { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert("پیام شما ارسال شد!");
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-blue-50">
      <h1 className="text-3xl font-bold mb-4 text-center">تماس با ما</h1>
      <p className="text-center text-gray-600 mb-8">
        می‌توانید از طریق فرم زیر با ما در ارتباط باشید.
      </p>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <input
          type="text"
          name="name"
          placeholder="نام"
          value={formData.name}
          onChange={handleChange}
          required
          className="bg-white rounded p-2 w-full"
        />
        <input
          type="email"
          name="email"
          placeholder="ایمیل"
          value={formData.email}
          onChange={handleChange}
          required
          className="bg-white rounded p-2 w-full"
        />
        <input
          type="tel"
          name="phone"
          placeholder="شماره تماس (اختیاری)"
          value={formData.phone}
          onChange={handleChange}
          className="bg-white rounded p-2 w-full"
        />
        <input
          type="text"
          name="subject"
          placeholder="موضوع"
          value={formData.subject}
          onChange={handleChange}
          required
          className="bg-white rounded p-2 w-full"
        />
        <textarea
          name="message"
          placeholder="پیام شما"
          value={formData.message}
          onChange={handleChange}
          required
          className="bg-white rounded p-2 w-full h-32"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          ارسال
        </button>
      </form>

      <div className="mt-8 text-center text-gray-700">
        <p>ایمیل: info@example.com</p>
        <p>تلفن: 021-12345678</p>
        <p>آدرس: تهران، خیابان مثال، پلاک 10</p>
      </div>
    </div>
  );
};

export default Contact;
