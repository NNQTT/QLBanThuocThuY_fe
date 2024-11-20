'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Edit, Save, X, ChevronsUpDown, Search, Upload, User } from 'lucide-react'
import { useParams } from 'react-router-dom'

const DetailProduct = () => {
  const { maThuoc } = useParams()
  const [product, setProduct] = useState({
    MaThuoc: '',
    TenThuoc: '',
    GiaBan: 0,
    SoLuong: 0,
    DangBaoChe: '',
    QCDongGoi: '',
    CongDung: '',
    AnhDaiDien: '',
    TrangThai: '',
    MaNhomThuoc: '',
    MaLoai: '',
    ThuocThanhPhan: [],
    DanhMucHinhAnh: []
  })
  
  const [isEditing, setIsEditing] = useState(false)
  const [thanhphanList, setThanhphanList] = useState([])
  const [nhomThuocList, setNhomThuocList] = useState([])
  const [loaiSuDungList, setLoaiSuDungList] = useState([])
  const [openThanhphan, setOpenThanhphan] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!maThuoc) {
        setError("Mã thuốc không hợp lệ")
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        console.log("Fetching details for maThuoc:", maThuoc)
        const response = await axios.get(`http://localhost:3000/admin/getthuoc/${maThuoc}`)
        console.log("Product details:", response.data)
        setProduct(response.data)
      } catch (err) {
        console.error("Error fetching product:", err)
        setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải thông tin sản phẩm')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProductDetails()
  }, [maThuoc])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProduct(prev => ({ ...prev, [name]: value }))
  }

  const toggleIngredient = (value) => {
    setProduct(prev => ({
      ...prev,
      ThuocThanhPhan: prev.ThuocThanhPhan.includes(value)
        ? prev.ThuocThanhPhan.filter(item => item !== value)
        : [...prev.ThuocThanhPhan, value]
    }))
  }

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:3000/admin/updatethuoc`, product)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating product:', error)
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#E76F51]"></div>
    </div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">
        Lỗi: {error}
        <pre>{JSON.stringify(error, null, 2)}</pre>
    </div>;
  }

  if (!product) {
    return <div className="text-center p-4">
        Không tìm thấy thông tin sản phẩm
        <pre>Mã thuốc: {maThuoc}</pre>
    </div>;
  }

  return (
    <div className="bg-background mx-auto max-w-4xl p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-[#22223B]">{product?.TenThuoc}</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-[#E76F51] text-white rounded-md hover:bg-[#F4A261] transition-colors duration-200"
        >
          {isEditing ? <Save className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[#4A4E69] mb-1">Mã thuốc</label>
          <input
            name="MaThuoc"
            value={product?.MaThuoc || ''}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-[#E76F51] rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#4A4E69] mb-1">Tên thuốc</label>
          <input
            name="TenThuoc"
            value={product?.TenThuoc}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-[#E76F51] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E76F51]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#4A4E69] mb-1">Quy cách đóng gói</label>
          <input
            name="QCDongGoi"
            value={product?.QCDongGoi}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-[#E76F51] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E76F51]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#4A4E69] mb-1">Nhóm thuốc</label>
          <select
            name="MaNhomThuoc"
            value={product?.MaNhomThuoc}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-[#E76F51] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E76F51] bg-white"
          >
            {nhomThuocList.map((item) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#4A4E69] mb-1">Loại sử dụng</label>
          <select
            name="MaLoai"
            value={product?.MaLoai}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-[#E76F51] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E76F51] bg-white"
          >
            {loaiSuDungList.map((item) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#4A4E69] mb-1">Trạng thái</label>
          <select
            name="TrangThai"
            value={product?.TrangThai}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-[#E76F51] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E76F51] bg-white"
          >
            <option value="Còn hàng">Còn hàng</option>
            <option value="Tạm hết hàng">Hết hàng</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#4A4E69] mb-1">Giá bán</label>
          <input
            name="GiaBan"
            type="number"
            value={product?.GiaBan}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-[#E76F51] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E76F51]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#4A4E69] mb-1">Số lượng</label>
          <input
            name="SoLuong"
            type="number"
            value={product?.SoLuong}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-[#E76F51] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E76F51]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#4A4E69] mb-1">Dạng bào chế</label>
          <input
            name="DangBaoChe"
            value={product?.DangBaoChe}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-[#E76F51] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E76F51]"
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-[#4A4E69] mb-1">Công dụng</label>
        <textarea
          name="CongDung"
          value={product?.CongDung}
          onChange={handleInputChange}
          disabled={!isEditing}
          className="w-full px-3 py-2 border border-[#E76F51] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E76F51] h-24"
        />
      </div>

      <div className="mt-6 relative">
        <label className="block text-sm font-medium text-[#4A4E69] mb-1">Thành phần</label>
        <button
          type="button"
          onClick={() => isEditing && setOpenThanhphan(!openThanhphan)}
          disabled={!isEditing}
          className="w-full px-3 py-2 border border-[#E76F51] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E76F51] bg-white text-left flex justify-between items-center"
        >
          {product?.ThuocThanhPhan && product?.ThuocThanhPhan[0] 
            ? `${product?.ThuocThanhPhan.filter(Boolean).length} thành phần đã chọn` 
            : "Chọn thành phần"
          }
          <ChevronsUpDown className="h-4 w-4 text-gray-400" />
        </button>
        {openThanhphan && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-[#E76F51] rounded-md shadow-lg">
            <div className="p-2 border-b border-[#E76F51]">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm thành phần..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E76F51]"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <ul className="max-h-60 overflow-auto">
              {thanhphanList
                .filter(ingredient => ingredient.label.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((ingredient) => (
                  <li
                    key={ingredient.value}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                    onClick={() => toggleIngredient(ingredient.value)}
                  >
                    <input
                      type="checkbox"
                      checked={product?.ThuocThanhPhan.includes(ingredient.value)}
                      onChange={() => { }}
                      className="mr-2"
                    />
                    {ingredient.label}
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>

      {product?.ThuocThanhPhan && product?.ThuocThanhPhan[0] && (
        <div className="mt-2">
          <h4 className="font-medium text-sm text-[#4A4E69] mb-1">Thành phần đã chọn:</h4>
          <div className="flex flex-wrap gap-2">
            {product?.ThuocThanhPhan.map((ingredient) => (
              <span
                key={ingredient}
                className="bg-[#FFE5D9] text-[#E76F51] text-sm px-2 py-1 rounded-full flex items-center"
              >
                {thanhphanList.find((item) => item.value === ingredient)?.label}
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => toggleIngredient(ingredient)}
                    className="ml-1 focus:outline-none"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#4A4E69] mb-2">Ảnh đại diện</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-[#E76F51] border-dashed rounded-md">
            <div className="space-y-1 text-center">
              {product?.AnhDaiDien ? (
                <img src={product?.AnhDaiDien} alt="Ảnh đại diện" className="mx-auto h-32 w-32 object-cover" />
              ) : (
                <User className="mx-auto h-12 w-12 text-[#E76F51]" />
              )}
              {isEditing && (
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="anhDaiDien"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-[#E76F51] hover:text-[#E76F51] "
                  >
                    <span>Tải lên ảnh</span>
                    <input id="anhDaiDien" name="anhDaiDien" type="file" className="sr-only" />
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#4A4E69] mb-2">Danh mục hình ảnh</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-[#E76F51] border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-[#E76F51]" />
              {isEditing && (
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="danhMucHinhAnh"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-[#E76F51] hover:text-[#E76F51]"
                  >
                    <span>Tải lên nhiều hình ảnh</span>
                    <input id="danhMucHinhAnh" name="danhMucHinhAnh" type="file" multiple className="sr-only" />
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#E76F51] text-white rounded-md hover:bg-[#F4A261] transition-colors duration-200"
          >
            Lưu thay đổi
          </button>
        </div>
      )}
    </div>
  )
}

export default DetailProduct;