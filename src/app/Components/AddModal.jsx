"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

function AddModal() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const [loading, setLoading] = useState(false);
  const navigate = useRouter()

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from("categories").select("*").order("name");
      if (data) setCategories(data);
    };
    fetchCategories();
  }, []);

  const handleImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    const { data, error } = await supabase
      .from("categories")
      .insert({ name: newCategory.trim() })
      .select()
      .single();

    if (error) {
      console.log(error);
      alert("حصل خطأ أثناء إضافة القسم");
      return;
    }

    setCategories([...categories, data]);
    setCategoryId(data.id);
    setNewCategory("");
  };

  const handleSubmit = async () => {
    if (!name.trim()) return alert("اكتب اسم المنتج");
    if (!price) return alert("اكتب سعر المنتج");
    if (!image) return alert("اختار صورة للمنتج");
    if (!categoryId) return alert("اختار قسم للمنتج");

    try {
      setLoading(true);

      const fileName = `${Date.now()}-${image.name}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, image);

      if (uploadError) {
        console.log(uploadError);
        alert("حصل خطأ أثناء رفع الصورة");
        return;
      }

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

      const { error: insertError } = await supabase
        .from("products")
        .insert({
          title: name.trim(),
          price: Number(price),
          image_url: data.publicUrl,
          category_id: categoryId,
        });

      if (insertError) {
        console.log(insertError);
        alert("حصل خطأ أثناء إضافة المنتج");
        return;
      }

      setName("");
      setPrice("");
      setImage(null);
      setPreview(null);
      setCategoryId("");

      alert("تم إضافة المنتج بنجاح");
      navigate.push("/")

    } catch (error) {
      console.log(error);
      alert("حصل خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-8 border shadow-lg border-secondry rounded-2xl gap-5">

      <h1 className="text-3xl font-bold mb-5">
        اضافة منتج جديد
      </h1>

      {preview && (
        <div className="max-w-100 max-h-100 rounded-2xl overflow-hidden m-auto">
          <img
            src={preview}
            alt="Product preview"
            className="w-full"
          />
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleImage}
        className="border border-secondry rounded-2xl"
      />

      <input type="text" placeholder="اسم المنتج" value={name} onChange={(e) => setName(e.target.value)} className="border border-secondry rounded-2xl px-4 py-3 outline-none" />

      <input type="number" placeholder="السعر" value={price} onChange={(e) => setPrice(e.target.value)} className="border border-secondry rounded-2xl px-4 py-3 outline-none" />

      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        className="border border-secondry rounded-2xl px-4 py-3 outline-none"
      >
        <option value="">اختار القسم</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="إضافة قسم جديد"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="flex-1 border border-secondry rounded-2xl px-4 py-3 outline-none"
        />
        <button
          onClick={handleAddCategory}
          type="button"
          className="bg-secondry text-white px-5 rounded-2xl font-bold cursor-pointer hover:-translate-y-1 transition-all duration-300"
        >
          إضافة
        </button>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-secondry text-white py-3 rounded-2xl font-bold disabled:opacity-50 cursor-pointer hover:-translate-y-1 transition-all duration-300"
      >
        {loading ? "جاري الإضافة..." : "إضافة المنتج"}
      </button>

    </div>
  );
}

export default AddModal;