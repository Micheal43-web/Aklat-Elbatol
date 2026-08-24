"use client";

import React, { useState } from "react";
import { supabase } from "../lib/supabase";

function UpdateModal({ product, onClose, onUpdated }) {
  const [name, setName] = useState(product.title);
  const [price, setPrice] = useState(product.price);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(product.image_url);

  const [loading, setLoading] = useState(false);

  const handleImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpdate = async () => {
    if (!name.trim()) {
      alert("اكتب اسم المنتج");
      return;
    }

    if (!price) {
      alert("اكتب سعر المنتج");
      return;
    }

    try {
      setLoading(true);

      let imageUrl = product.image_url;

      if (image) {
        const fileName = `${Date.now()}-${image.name}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(fileName, image);

        if (uploadError) {
          console.log(uploadError);
          alert("حصل خطأ أثناء رفع الصورة الجديدة");
          return;
        }

        const { data } = supabase.storage
          .from("product-images")
          .getPublicUrl(fileName);

        imageUrl = data.publicUrl;
      }

      const { error: updateError } = await supabase
        .from("products")
        .update({
          title: name.trim(),
          price: Number(price),
          image_url: imageUrl,
        })
        .eq("id", product.id);

      if (updateError) {
        console.log(updateError);
        alert("حصل خطأ أثناء تعديل المنتج");
        return;
      }

      alert("تم تعديل المنتج بنجاح");
      onUpdated();
      onClose();

    } catch (error) {
      console.log(error);
      alert("حصل خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white h-fit w-full max-w-200 flex flex-col p-8 border shadow-lg border-secondry rounded-2xl gap-5">

        <h1 className="text-3xl font-bold mb-5">
          تعديل المنتج
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

        <input
          type="text"
          placeholder="اسم المنتج"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-secondry rounded-2xl px-4 py-3 outline-none"
        />

        <input
          type="number"
          placeholder="السعر"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border border-secondry rounded-2xl px-4 py-3 outline-none"
        />

        <div className="flex gap-3">
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="flex-1 bg-secondry text-white py-3 rounded-2xl font-bold disabled:opacity-50 cursor-pointer hover:-translate-y-1 transition-all duration-300"
          >
            {loading ? "جاري الحفظ..." : "حفظ التعديلات"}
          </button>

          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 border border-secondry py-3 rounded-2xl font-bold cursor-pointer hover:-translate-y-1 transition-all duration-300"
          >
            إلغاء
          </button>
        </div>

      </div>
    </div>
  );
}

export default UpdateModal;