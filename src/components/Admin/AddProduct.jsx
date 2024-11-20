import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, X, Check, ChevronsUpDown, Search, Upload, User } from 'lucide-react';


const AddProduct = () => {
  const [thanhphan, setthanhphan] = useState([]);
  const [openthanhphan, setOpenthanhphan] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newIngredient, setNewIngredient] = useState('');
  const [thanhphanList, setthanhphanList] = useState([]);
  const [nhomThuocList, setNhomThuocList] = useState([]);
  const [loaiSuDungList, setLoaiSuDungList] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null)
  const [selectedFiles, setSelectedFiles] = useState([])

  const handleProfilePictureChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setProfilePicture(event.target.files[0])
    }
  }

  const handleGalleryChange = (event) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files))
    }
  }

  const dropdownRef = useRef(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [thanhphanRes, nhomThuocRes, loaiSuDungRes] = await Promise.all([
          axios.get('http://localhost:3000/admin/getthanhphan'),
          axios.get('http://localhost:3000/admin/getnhomthuoc'),
          axios.get('http://localhost:3000/admin/getloaisudung'),
        ]);

        setthanhphanList(thanhphanRes.data.map(item => ({
          value: item.MaTP,
          label: item.TenThanhPhan
        })));

        setNhomThuocList(nhomThuocRes.data.map(item => ({
          value: item.MaNhomThuoc,
          label: item.TenNhom
        })));

        setLoaiSuDungList(loaiSuDungRes.data.map(item => ({
          value: item.MaLoai,
          label: item.TenLoai
        })));

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const toggleIngredient = (value) => {
    setthanhphan(prev =>
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  const addNewIngredient = async () => {
    console.log('Giá trị của newIngredient:', newIngredient);

    // Kiểm tra nếu input trống
    if (newIngredient.trim() === '') {
      alert('Vui lòng nhập thành phần mới!');
      return;
    }

    try {
      // Gửi yêu cầu POST đến server
      const response = await axios.post('http://localhost:3000/admin/postthanhphan', {
        tenThanhPhan: newIngredient,
      });

      // Kiểm tra phản hồi và thêm thành phần vào danh sách
      setthanhphanList(prev => [...prev, { value: response.data.thuoc.MaTP, label: response.data.thuoc.TenThanhPhan }]);  // response.data chứa dữ liệu trả về từ server
      setthanhphan(prev => [...prev, response.data.thuoc.MaTP]);
      console.log(response.data)
      setNewIngredient('');  // Reset lại giá trị input sau khi thêm thành công
      console.log(thanhphanList)
    } catch (error) {
      console.error('Error adding ingredient:', error.response?.data || error.message);
      alert('Có lỗi xảy ra khi thêm thành phần!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    // Thu thập dữ liệu sản phẩm
    const productData = {
      maThuoc: document.getElementById("maThuoc").value,
      tenThuoc: document.getElementById("tenThuoc").value,
      giaBan: document.getElementById("giaBan").value,
      soLuong: document.getElementById("soLuong").value,
      dangBaoChe: document.getElementById("dangBaoChe").value,
      qcDongGoi: document.getElementById("qcDongGoi").value,
      congDung: document.getElementById("congDung").value,
      anhDaiDien: profilePicture ? profilePicture.name : '',
      trangThai: document.getElementById("trangThai").value,
      maNhomThuoc: document.getElementById("maNhomThuoc").value,
      maLoai: document.getElementById("maLoai").value,
      thanhphan: thanhphan,
    };

    console.log(productData)

    // Khởi tạo formData để gửi file ảnh
    const formData = new FormData();
    formData.append('maThuoc', productData.maThuoc);
    formData.append('tenThuoc', productData.tenThuoc);
    formData.append('giaBan', productData.giaBan);
    formData.append('soLuong', productData.soLuong);
    formData.append('dangBaoChe', productData.dangBaoChe);
    formData.append('qcDongGoi', productData.qcDongGoi);
    formData.append('congDung', productData.congDung);
    formData.append('anhDaiDien', productData.anhDaiDien);
    formData.append('trangThai', productData.trangThai);
    formData.append('maNhomThuoc', productData.maNhomThuoc);
    formData.append('maLoai', productData.maLoai);


    // Thêm danh sách ảnh của gallery vào formData
    selectedFiles.forEach((file, index) => {
      formData.append(`galleryImages[${index}]`, file);
    });
    
    try {
      await axios.post('http://localhost:3000/admin/postthuoc', productData, {
        headers: { 'Content-Type': 'application/json' }
      });


       // Thêm các thành phần (thanhphan) vào bảng ThuocThanhPhan
      //  console.log("Dữ liệu thanhphan:", thanhphan);
       for (const thanhPhan of thanhphan) {
        if (!thanhPhan) {
            console.error('Thiếu mã thành phần trong thanhPhan:', thanhPhan);
            continue;
        }

        try {
            await axios.post('http://localhost:3000/admin/postthuoctp', {
                maThuoc: productData.maThuoc,
                maTP: thanhPhan,
            });
        } catch (error) {
            console.error('Lỗi khi gửi yêu cầu:', error.response ? error.response.data : error.message);
        }
    }
    

      // Thêm ảnh vào bảng DanhMucHinhAnh
      for (const file of selectedFiles) {
        await axios.post('http://localhost:3000/admin/postdanhmucha', {
          maThuoc: productData.maThuoc,
          tenHinhAnh: file.name,
          
        });
      }

      alert('Sản phẩm đã được thêm thành công cùng với các thành phần và hình ảnh!');
    } catch (error) {
      console.error("Error response data:", error.response?.data);
      console.error("Status code:", error.response?.status);
    }
  };


  const filteredthanhphan = thanhphanList.filter(ingredient =>
    ingredient?.label?.toLowerCase().includes(searchTerm.toLowerCase())

  );

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpenthanhphan(false);
    }
  };


  return (
<div className="bg-background mx-auto max-w-4xl p-6 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-[#22223B] mb-6">Thêm sản phẩm mới</h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="maThuoc" className="block text-sm font-medium text-[#4A4E69] mb-1">Mã thuốc</label>
            <input id="maThuoc" type="text" placeholder="Nhập mã thuốc" className="w-full px-3 py-2 border border-[#E76F51] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E76F51]" />
          </div>
          <div>
            <label htmlFor="tenThuoc" className="block text-sm font-medium text-[#4A4E69] mb-1">Tên thuốc</label>
            <input id="tenThuoc" type="text" placeholder="Nhập tên thuốc" className="w-full px-3 py-2 border border-[#E76F51] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E76F51]" />
          </div>
          <div>
            <label htmlFor="qcDongGoi" className="block text-sm font-medium text-[#4A4E69] mb-1">Quy cách đóng gói</label>
            <input id="qcDongGoi" type="text" placeholder="Nhập quy cách đóng gói" className="w-full px-3 py-2 border border-[#E76F51] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E76F51]" />
          </div>
          <div>
            <label htmlFor="maNhomThuoc" className="block text-sm font-medium text-[#4A4E69] mb-1">Nhóm thuốc</label>
            <select id="maNhomThuoc" className="w-full px-3 py-2 border border-[#E76F51] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E76F51] bg-white">
              <option value="">Chọn nhóm thuốc</option>
              {nhomThuocList.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="maLoai" className="block text-sm font-medium text-[#4A4E69] mb-1">Loại sử dụng</label>
            <select id="maLoai" className="w-full px-3 py-2 border border-[#E76F51] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E76F51] bg-white">
              <option value="">Chọn loại sử dụng</option>
              {loaiSuDungList.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="trangThai" className="block text-sm font-medium text-[#4A4E69] mb-1">Trạng thái</label>
            <select id="trangThai" className="w-full px-3 py-2 border border-[#E76F51] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E76F51] bg-white">
              <option value="">Chọn trạng thái</option>
              <option value="Còn hàng">Còn hàng</option>
              <option value="Tạm hết hàng">Hết hàng</option>
            </select>
          </div>
        </div>
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="giaBan" className="block text-sm font-medium text-[#4A4E69] mb-1">Giá bán</label>
              <input id="giaBan" type="number" placeholder="Nhập giá bán" className="w-full px-3 py-2 border border-[#E76F51] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E76F51]" />
            </div>
            <div>
              <label htmlFor="soLuong" className="block text-sm font-medium text-[#4A4E69] mb-1">Số lượng</label>
              <input id="soLuong" type="number" placeholder="Nhập số lượng" className="w-full px-3 py-2 border border-[#E76F51] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E76F51]" />
            </div>
            <div>
              <label htmlFor="dangBaoChe" className="block text-sm font-medium text-[#4A4E69] mb-1">Dạng bào chế</label>
              <input id="dangBaoChe" type="text" placeholder="Nhập dạng bào chế" className="w-full px-3 py-2 border border-[#E76F51] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E76F51]" />
            </div>
          </div>

        <div>
          <label htmlFor="congDung" className="block text-sm font-medium text-[#4A4E69] mb-1">Công dụng</label>
          <textarea id="congDung" placeholder="Nhập công dụng của thuốc" className="w-full px-3 py-2 border border-[#E76F51] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E76F51] h-24"></textarea>
        </div>

        <div className="relative" ref={dropdownRef}>
          <label className="block text-sm font-medium text-[#4A4E69] mb-1">Thành phần</label>
          <button type="button" onClick={() => setOpenthanhphan(!openthanhphan)} className="w-full px-3 py-2 border border-[#E76F51] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E76F51] bg-white text-left flex justify-between items-center">
            {thanhphan.length > 0 ? `${thanhphan.length} thành phần đã chọn` : "Chọn thành phần"}
            <ChevronsUpDown className="h-4 w-4 text-gray-400" />
          </button>
          {openthanhphan && (
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
                {filteredthanhphan.map((ingredient) => (
                  <li
                    key={ingredient.value}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                    onClick={() => toggleIngredient(ingredient.value)}
                  >
                    <Check className={`mr-2 h-4 w-4 ${thanhphan.includes(ingredient.value) ? 'text-[#E76F51]' : 'text-transparent'}`} />
                    {ingredient.label}
                  </li>
                ))}
              </ul>
              <div className="p-2 border-t border-[#E76F51]">
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Thêm thành phần mới..."
                    value={newIngredient}
                    onChange={(e) => setNewIngredient(e.target.value)}
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#E76F51]"
                  />
                  <button
                    type="button"
                    onClick={addNewIngredient}
                    className="px-3 py-2 bg-[#E76F51] text-white rounded-r-md hover:bg-[#F4A261] transition-colors duration-200"
                  >
                    <PlusCircle className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        {thanhphan.length > 0 && (
          <div className="mt-2">
            <h4 className="font-medium text-sm text-[#4A4E69] mb-1">Thành phần đã chọn:</h4>
            <div className="flex flex-wrap gap-2">
              {thanhphan.map((ingredient) => (
                <span
                  key={ingredient}
                  className="bg-[#FFE5D9] text-[#E76F51] text-sm px-2 py-1 rounded-full flex items-center"
                >
                  {thanhphanList.find((item) => item.value === ingredient)?.label}
                  <button
                    type="button"
                    onClick={() => toggleIngredient(ingredient)}
                    className="ml-1 focus:outline-none"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="anhDaiDien" className="block text-sm font-medium text-[#4A4E69] mb-2">
              Ảnh đại diện
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-[#E76F51] border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <User className="mx-auto h-12 w-12 text-[#E76F51]" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="anhDaiDien"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-[#E76F51] hover:text-[#E76F51] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#E76F51]"
                  >
                    <span>Tải lên ảnh</span>
                    <input
                      id="anhDaiDien"
                      name="anhDaiDien"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleProfilePictureChange}
                    />
                  </label>
                  <p className="pl-1">hoặc kéo và thả</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF tối đa 2MB</p>
              </div>
            </div>
            {profilePicture && (
              <p className="mt-2 text-sm text-gray-600">
                Đã chọn: {profilePicture.name}
              </p>
            )}
          </div>


          <div>
            <label
              htmlFor="danhMucHinhAnh"
              className="block text-sm font-medium text-[#4A4E69] mb-2"
            >
              Danh mục hình ảnh
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-[#E76F51] border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-[#E76F51]" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="danhMucHinhAnh"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-[#E76F51] hover:text-[#E76F51] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#E76F51]"
                  >
                    <span>Tải lên nhiều hình ảnh</span>
                    <input
                      id="danhMucHinhAnh"
                      name="danhMucHinhAnh"
                      type="file"
                      accept="image/*"
                      multiple
                      className="sr-only"
                      onChange={handleGalleryChange}
                    />
                  </label>
                  <p className="pl-1">hoặc kéo và thả</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF lên đến 10MB</p>
              </div>
            </div>
            {selectedFiles.length > 0 && (
              <div className="mt-2">
                <h4 className="text-sm font-medium text-[#4A4E69]">Đã chọn {selectedFiles.length} hình ảnh:</h4>
                <ul className="mt-1 text-sm text-gray-600">
                  {selectedFiles.slice(0, 3).map((file, index) => (
                    <li key={index} className="truncate">{file.name}</li>
                  ))}
                  {selectedFiles.length > 3 && (
                    <li>...và {selectedFiles.length - 3} hình ảnh khác</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>


        <button type="submit" className="w-full bg-[#E76F51] hover:bg-[#F4A261] text-white font-bold py-2 px-4 rounded transition-colors duration-200">
          Thêm sản phẩm
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
