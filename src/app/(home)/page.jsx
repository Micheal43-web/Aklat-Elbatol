"use client"

import React, { useContext, useEffect, useState } from 'react'
import Header from '../Components/Header'
import { supabase } from '../lib/supabase'
import { UserContext } from '../UserContext'
import { Pen, Trash } from 'lucide-react'
import UpdateModal from '../Components/UpdateModal'
import Footer from '../Components/Footer'
import CTA from '../Components/CTA'

function page() {

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState("all")
  const { user } = useContext(UserContext)
  const [ editingProduct, setEditingProduct ] = useState(null)
  const [isOpened, setIsOpened] = useState(false)

  const fetchProducts = async () => {
      const { data, error } = await supabase.from("products").select("*")
      if (error) {
        alert("err")
        return
      }
      if (data) {
        setProducts(data)
      }
    }

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*").order("name")
    if (data) setCategories(data)
  }

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const deleteProduct = async (id) => {
    const { error } = await supabase.from("products").delete().eq("id", id)

    if (error) {
      console.log(error)
      alert("حصل خطأ أثناء حذف المنتج")
      return
    }

    setProducts(
      products.filter((pro) => pro.id !== id)
    )
  }

  const deleteCategory = async (id) => {
    const confirmDelete = confirm("هل أنت متأكد من حذف هذا القسم؟ المنتجات المرتبطة به ستصبح بدون قسم.")
    if (!confirmDelete) return

    const { error } = await supabase.from("categories").delete().eq("id", id)

    if (error) {
      console.log(error)
      alert("حصل خطأ أثناء حذف القسم")
      return
    }

    setCategories(categories.filter((cat) => cat.id !== id))
    if (String(activeCategory) === String(id)) setActiveCategory("all")
    fetchProducts()
  }

  const openEditModal = (item) => {
    setEditingProduct(item)
    setIsOpened(true)
  }

  const closeEditModal = () => {
    setIsOpened(false)
    setEditingProduct(null)
  }

  const filteredProducts = activeCategory === "all"
    ? products
    : products.filter((p) => String(p.category_id) === String(activeCategory))

  return (
    <>
      <div className="flex flex-col px-10 md:px-15 lg:px-20  w-full">
        <Header />

        {/* Tabs */}
        <div className="flex gap-3 flex-wrap mt-8 pb-2">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-5 py-2 rounded-2xl font-semibold whitespace-nowrap ${activeCategory === "all" ? "bg-secondry text-primary" : "border border-secondry"}`}
          >
            الكل
          </button>
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center gap-1">
              <button
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2 rounded-2xl font-semibold whitespace-nowrap ${String(activeCategory) === String(cat.id) ? "bg-secondry text-primary" : "border border-secondry"}`}
              >
                {cat.name}
              </button>
              {user?.email == "michealwaled16@gmail.com" && (
                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="text-red-500 text-sm px-1 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        <div className={filteredProducts.length > 0 ? "grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 mt-8 w-full mx-auto" : "flex justify-center w-full"}>
          {
            filteredProducts.length > 0 ? filteredProducts.map((item) => {
              return (
                <div key={item.id} className='flex flex-col gap-4 border border-secondry  rounded-2xl p-3.5 '>
                  {item.image_url && (
                    <img src={item.image_url} className="w-full  object-cover rounded-2xl" loading='eager' />
                  )}
                  <h1 className='font-semibold px-5'>{item.title}</h1>
                  <span className='font-bold px-5'>{item.price}ج.م</span>

                  {
                    user?.email == "michealwaled16@gmail.com" && (
                      <div className="flex item-start justify-end gap-3">
                        <button onClick={() => openEditModal(item)} className='bg-secondry text-primary p-2.5 rounded-2xl cursor-pointer hover:-translate-y-1 transition-all duration-300'>
                          <Pen />
                        </button>
                        <button onClick={() => deleteProduct(item.id)} className='bg-secondry text-primary p-2.5 rounded-2xl cursor-pointer hover:-translate-y-1 transition-all duration-300'>
                          <Trash />
                        </button>
                      </div>
                    )
                  }
                </div>
              )
            }) : <p className='text-center mt-10'>لا توجد منتجات متوفرة حاليا</p>
          }
        </div>
      </div>
      {isOpened && (
        <UpdateModal
          product={editingProduct}
          onClose={closeEditModal}
          onUpdated={fetchProducts}
        />
      )}

      <CTA />

      <Footer />
    </>
  )
}

export default page