import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Edit, Save, X, ChevronsUpDown, Search, Upload, User, History } from 'lucide-react'
import { useParams, useNavigate } from 'react-router-dom'

const getImagePath = (maThuoc, imageName) => {
  return `/src/assets/uploads/${maThuoc}/${imageName}`;
};

const DetailProduct = () => {
  const { maThuoc } = useParams()
  const [product, setProduct] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [loaiSuDungList, setLoaiSuDungList] = useState([])
  const [nhomThuocList, setNhomThuocList] = useState([])
  const [thanhPhanList, setThanhPhanList] = useState([])
  const [openThanhphan, setOpenThanhphan] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState(''); // 'success' hoặc 'error'
  const [selectedFiles, setSelectedFiles] = useState([]);

  const navigate = useNavigate()

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true)
        
        const productRes = await axios.get(`http://localhost:3000/admin/getthuoc/${maThuoc}`)
        console.log("Product data:", productRes.data)

        const loaiSuDungRes = await axios.get('http://localhost:3000/admin/getloaisudung')
        console.log("LoaiSuDung data:", loaiSuDungRes.data)

        const nhomThuocRes = await axios.get('http://localhost:3000/admin/getnhomthuoc')
        console.log("NhomThuoc data:", nhomThuocRes.data)

        const thanhPhanRes = await axios.get('http://localhost:3000/admin/getthanhphan')
        console.log("ThanhPhan data:", thanhPhanRes.data)

        if (Array.isArray(loaiSuDungRes.data)) {
          setLoaiSuDungList(loaiSuDungRes.data.map(item => ({
            value: item.MaLoai,
            label: item.TenLoai
          })))
        }

        if (Array.isArray(nhomThuocRes.data)) {
          setNhomThuocList(nhomThuocRes.data.map(item => ({
            value: item.MaNhomThuoc,
            label: item.TenNhom
          })))
        }

        if (Array.isArray(thanhPhanRes.data)) {
          setThanhPhanList(thanhPhanRes.data.map(item => ({
            value: item.MaTP,
            label: item.TenThanhPhan
          })))
        }

        setProduct(productRes.data)
        
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải dữ liệu')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAllData()
  }, [maThuoc])

  console.log("Current states:", {
    product,
    loaiSuDungList,
    nhomThuocList,
    thanhPhanList,
    isLoading,
    error
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProduct(prev => ({ ...prev, [name]: value }))
  }

  const toggleIngredient = (value) => {
    console.log("Toggle ingredient value:", value);
    // Tìm thông tin thành phần từ danh sách
    const ingredient = thanhPhanList.find(item => item.value === value);
    console.log("Found ingredient:", ingredient);

    setProduct(prev => ({
      ...prev,
      thanhPhan: prev.thanhPhan.some(tp => tp.maTP === value)
        ? prev.thanhPhan.filter(tp => tp.maTP !== value)
        : [...prev.thanhPhan, { maTP: value, tenThanhPhan: ingredient.label }]
    }));
  }

  const handleSave = async () => {
    try {
        const tenTaiKhoan = localStorage.getItem('adminUsername');

        if (!tenTaiKhoan) {
            const userResponse = await axios.get('http://localhost:3000/api/getCurrentUser', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            if (userResponse.data.tentaikhoan) {
                localStorage.setItem('adminUsername', userResponse.data.tentaikhoan);
            } else {
                throw new Error('Không tìm thấy thông tin người dùng');
            }
        }

        const dataToSend = {
            ...product,
            TenTaiKhoan: tenTaiKhoan || localStorage.getItem('adminUsername')
        };
        console.log('Data gửi đi:', dataToSend);

        const response = await axios.put(
            `http://localhost:3000/admin/updatethuoc/${product.MaThuoc}`, 
            dataToSend
        );

        console.log('Response:', response.data);
        
        if (response.data.message === 'Cập nhật thuốc thành công') {
            setIsEditing(false);
            setNotificationMessage('Cập nhật thông tin thuốc thành công!');
            setNotificationType('success');
        }
        
        setShowNotification(true);
        setTimeout(() => {
            setShowNotification(false);
        }, 3000);
        
    } catch (error) {
        console.error('Error updating product:', error);
        setNotificationMessage(error.message || 'Có lỗi xảy ra khi cập nhật thông tin!');
        setNotificationType('error');
        setShowNotification(true);
        
        setTimeout(() => {
            setShowNotification(false);
        }, 3000);
    }
  };

  // Thêm hàm xử lý xóa hình ảnh
  const handleDeleteImage = async (tenHinhAnh) => {
    try {
      await axios.delete(`http://localhost:3000/admin/deletedanhmucha/${product.MaThuoc}/${tenHinhAnh}`);
      
      // Cập nhật state sau khi xóa
      setProduct(prev => ({
        ...prev,
        danhMucHinhAnh: prev.danhMucHinhAnh.filter(img => img.tenHinhAnh !== tenHinhAnh)
      }));

      // Hiển thị thông báo thành công
      setNotificationMessage('Xóa hình ảnh thành công!');
      setNotificationType('success');
      setShowNotification(true);
      
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);

    } catch (error) {
      console.error('Error deleting image:', error);
      setNotificationMessage('Có lỗi xảy ra khi xóa hình ảnh!');
      setNotificationType('error');
      setShowNotification(true);
      
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    }
  };

  // Thêm hàm xử lý upload ảnh
  const handleImageUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      // Xử lý từng file một
      for (const file of files) {
        const formData = new FormData();
        formData.append('image', file);
        
        // Upload ảnh lên server (giả sử bạn có API upload ảnh)
        // const uploadResponse = await axios.post('http://localhost:3000/admin/upload', formData);
        
        // Thêm vào danh mục hình ảnh
        await axios.post('http://localhost:3000/admin/postdanhmucha', {
          maThuoc: product.MaThuoc,
          tenHinhAnh: file.name,
        });

        // Cập nhật state product
        setProduct(prev => ({
          ...prev,
          danhMucHinhAnh: [
            ...(prev.danhMucHinhAnh || []),
            { tenHinhAnh: file.name }
          ]
        }));

        // Hiển thị thông báo thành công
        setNotificationMessage('Thêm hình ảnh thành công!');
        setNotificationType('success');
        setShowNotification(true);
        
        setTimeout(() => {
          setShowNotification(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      setNotificationMessage('Có lỗi xảy ra khi tải ảnh lên!');
      setNotificationType('error');
      setShowNotification(true);
      
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    }
  };

  const handleUpdateThanhPhan = async () => {
    try {
        const response = await axios.put('http://localhost:3000/admin/updatethuoctp', {
            maThuoc: product.MaThuoc,
            thanhPhan: selectedThanhPhan // Mảng các thành phần đã chọn
        });

        if (response.data.message === 'Cập nhật thành phần thuốc thành công') {
            // Cập nhật state local
            setProduct(prev => ({
                ...prev,
                thanhPhan: selectedThanhPhan
            }));

            setNotificationMessage('Cập nhật thành phần thành công!');
            setNotificationType('success');
        }
        
        setShowNotification(true);
        setTimeout(() => {
            setShowNotification(false);
        }, 3000);

    } catch (error) {
        console.error('Error updating ingredients:', error);
        setNotificationMessage('Có lỗi xảy ra khi cập nhật thành phần!');
        setNotificationType('error');
        setShowNotification(true);
        
        setTimeout(() => {
            setShowNotification(false);
        }, 3000);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#E76F51]"></div>
    </div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">Lỗi: {error}</div>
  }

  if (!product) {
    return <div className="text-center p-4">
        Không tìm thấy thông tin sản phẩm
        <pre>Mã thuốc: {maThuoc}</pre>
    </div>;
  }

  return (
    <div className="bg-background mx-auto max-w-4xl p-6 rounded-lg shadow-md relative">
      {/* Notification */}
      {showNotification && (
        <div 
          className={`fixed top-4 right-4 p-4 rounded-md shadow-lg ${
            notificationType === 'success' 
              ? 'bg-green-100 text-green-700 border border-green-400' 
              : 'bg-red-100 text-red-700 border border-red-400'
          }`}
        >
          <div className="flex items-center">
            {notificationType === 'success' ? (
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
            )}
            {notificationMessage}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-[#22223B]">
          {product?.TenThuoc || 'Không có tên'}
        </h2>
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="px-4 py-2 bg-[#E76F51] text-white rounded-md hover:bg-[#F4A261] transition-colors duration-200"
        >
          {isEditing ? <Save className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        
        <div className="md:w-1/3 space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#4A4E69] mb-2">Ảnh đại diện</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-[#E76F51] border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {product?.AnhDaiDien ? (
                  <img 
                    src={getImagePath(product.MaThuoc, product.AnhDaiDien)} 
                    alt="Ảnh đại diện" 
                    className="mx-auto h-64 w-64 object-cover" 
                  />
                ) : (
                  <User className="mx-auto h-12 w-12 text-[#E76F51]" />
                )}
                {isEditing && (
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="anhDaiDien"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-[#E76F51] hover:text-[#E76F51]"
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
            <div className="grid grid-cols-3 gap-2">
              {/* Hiển thị ảnh đã có */}
              {Array.isArray(product?.danhMucHinhAnh) && product.danhMucHinhAnh.map((img, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={getImagePath(product.MaThuoc, img.tenHinhAnh)} 
                    alt={`Ảnh ${index + 1}`} 
                    className="w-full h-24 object-cover rounded-md"
                  />
                  {isEditing && (
                    <button
                      onClick={() => handleDeleteImage(img.tenHinhAnh)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}

              {/* Nút upload luôn hiển thị khi đang trong chế độ chỉnh sửa */}
              {isEditing && (
                <div className="flex items-center justify-center w-full h-24 border-2 border-[#E76F51] border-dashed rounded-md">
                  <label
                    htmlFor="danhMucHinhAnh"
                    className="cursor-pointer text-[#E76F51] hover:text-[#F4A261] transition-colors duration-200"
                  >
                    <Upload className="mx-auto h-8 w-8" />
                    <span className="block text-sm mt-1">Tải lên ảnh</span>
                    <input 
                      id="danhMucHinhAnh" 
                      name="danhMucHinhAnh" 
                      type="file" 
                      multiple 
                      className="sr-only"
                      onChange={handleImageUpload}
                      accept="image/*"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column for other attributes */}
        <div className="md:w-2/3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#4A4E69] mb-1">Mã thuốc</label>
              <input
                name="MaThuoc"
                value={product.MaThuoc}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-[#E76F51] rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4A4E69] mb-1">Tên thuốc</label>
              <input
                name="TenThuoc"
                value={product.TenThuoc}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-[#E76F51] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E76F51]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4A4E69] mb-1">Quy cách đóng gói</label>
              <input
                name="QCDongGoi"
                value={product.QCDongGoi}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-[#E76F51] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E76F51]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4A4E69] mb-1">Nhóm thuốc</label>
              <select
                name="MaNhomThuoc"
                value={product?.MaNhomThuoc || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-[#E76F51] rounded-md"
              >
                <option value="">Chọn nhóm thuốc</option>
                {nhomThuocList && nhomThuocList.map(item => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4A4E69] mb-1">Loại sử dụng</label>
              <select
                name="MaLoai"
                value={product?.MaLoai || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-[#E76F51] rounded-md"
              >
                <option value="">Chọn loại sử dụng</option>
                {loaiSuDungList && loaiSuDungList.map(item => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4A4E69] mb-1">Trạng thái</label>
              <select
                name="TrangThai"
                value={product.TrangThai}
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
                value={product.GiaBan}
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
                value={product.SoLuong}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-[#E76F51] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E76F51]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4A4E69] mb-1">Dạng bào chế</label>
              <input
                name="DangBaoChe"
                value={product.DangBaoChe}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-[#E76F51] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E76F51]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#4A4E69] mb-1">Công dụng</label>
            <textarea
              name="CongDung"
              value={product.CongDung}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-[#E76F51] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E76F51] h-24"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-[#4A4E69] mb-1">Thành phần</label>
            <button
              type="button"
              onClick={() => isEditing && setOpenThanhphan(!openThanhphan)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-[#E76F51] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E76F51] bg-white text-left flex justify-between items-center"
            >
              {product?.thanhPhan && product.thanhPhan[0]
                ? `${product.thanhPhan.filter(Boolean).length} thành phần đã chọn`
                : "Chn thành phần"
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
                  {thanhPhanList
                    .filter(ingredient => ingredient.label.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((ingredient) => (
                      <li
                        key={ingredient.value}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                        onClick={() => toggleIngredient(ingredient.value)}
                      >
                        <input
                          type="checkbox"
                          checked={product.thanhPhan.some(tp => tp.maTP === ingredient.value)}
                          onChange={() => {}}
                          className="mr-2"
                        />
                        {ingredient.label}
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>

          {product?.thanhPhan && product.thanhPhan[0] && (
            <div className="mt-2">
              <h4 className="font-medium text-sm text-[#4A4E69] mb-1">Thành phần đã chọn:</h4>
              <div className="flex flex-wrap gap-2">
                {product.thanhPhan.map((tp) => (
                  <span
                    key={tp.maTP}
                    className="bg-[#FFE5D9] text-[#E76F51] text-sm px-2 py-1 rounded-full flex items-center"
                  >
                    {tp.tenThanhPhan}
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => toggleIngredient(tp.maTP)}
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

          {isEditing && (
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-[#E76F51] text-white rounded-md hover:bg-[#F4A261] transition-colors duration-200"
              >
                Lưu thay đổi
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DetailProduct;