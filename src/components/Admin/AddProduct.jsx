import React, { useState, useRef, useEffect } from 'react'; 
import { PlusCircle, X, Check, ChevronsUpDown, Search } from 'lucide-react';

const AddProduct = () => {
  const [ingredients, setIngredients] = useState([]);
  const [openIngredients, setOpenIngredients] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newIngredient, setNewIngredient] = useState('');
  const [ingredientsList] = useState([
    { value: "paracetamol", label: "Paracetamol" },
    { value: "ibuprofen", label: "Ibuprofen" },
    { value: "aspirin", label: "Aspirin" },
    { value: "amoxicillin", label: "Amoxicillin" },
    { value: "omeprazole", label: "Omeprazole" },
  ]);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenIngredients(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredIngredients = ingredientsList.filter(ingredient =>
    ingredient.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleIngredient = (value) => {
    setIngredients(prev =>
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  const addNewIngredient = () => {
    if (newIngredient.trim() !== '') {
      const newValue = newIngredient.toLowerCase().replace(/\s+/g, '-');
      setIngredientsList(prev => [...prev, { value: newValue, label: newIngredient }]);
      setIngredients(prev => [...prev, newValue]);
      setNewIngredient('');
    }
  };

  return (
    <div className="bg-white mx-10 p-8 rounded-lg shadow-md transition-all duration-300 ease-in-out">
      <h2 className="text-3xl font-bold text-[#22223B] mb-6">Thêm sản phẩm mới</h2>
      <form className="space-y-6">
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
            <label htmlFor="giaBan" className="block text-sm font-medium text-[#4A4E69] mb-1">Giá bán</label>
            <input id="giaBan" type="number" placeholder="Nhập giá bán" className="w-full px-3 py-2 border border-[#E76F51] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E76F51]" />
          </div>
          <div>
            <label htmlFor="dangBaoChe" className="block text-sm font-medium text-[#4A4E69] mb-1">Dạng bào chế</label>
            <input id="dangBaoChe" type="text" placeholder="Nhập dạng bào chế" className="w-full px-3 py-2 border border-[#E76F51] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E76F51]" />
          </div>
          <div>
            <label htmlFor="qcDongGoi" className="block text-sm font-medium text-[#4A4E69] mb-1">Quy cách đóng gói</label>
            <input id="qcDongGoi" type="text" placeholder="Nhập quy cách đóng gói" className="w-full px-3 py-2 border border-[#E76F51] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E76F51]" />
          </div>
          <div>
            <label htmlFor="nhomThuoc" className="block text-sm font-medium text-[#4A4E69] mb-1">Nhóm thuốc</label>
            <select id="nhomThuoc" className="w-full px-3 py-2 border border-[#E76F51] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E76F51] bg-white">
              <option value="">Chọn nhóm thuốc</option>
              <option value="NT001">Thuốc kháng sinh</option>
              <option value="NT002">Thuốc giảm đau</option>
              <option value="NT003">Thuốc tiêu hóa</option>
            </select>
          </div>
          <div>
            <label htmlFor="loaiSuDung" className="block text-sm font-medium text-[#4A4E69] mb-1">Loại sử dụng</label>
            <select id="loaiSuDung" className="w-full px-3 py-2 border border-[#E76F51] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E76F51] bg-white">
              <option value="">Chọn loại sử dụng</option>
              <option value="LSD001">Uống</option>
              <option value="LSD002">Tiêm</option>
              <option value="LSD003">Bôi ngoài da</option>
            </select>
          </div>
          <div>
            <label htmlFor="trangThai" className="block text-sm font-medium text-[#4A4E69] mb-1">Trạng thái</label>
            <select id="trangThai" className="w-full px-3 py-2 border border-[#E76F51] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E76F51] bg-white">
              <option value="">Chọn trạng thái</option>
              <option value="active">Còn hàng</option>
              <option value="lowStock">Sắp hết hàng</option>
              <option value="outOfStock">Hết hàng</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="congDung" className="block text-sm font-medium text-[#4A4E69] mb-1">Công dụng</label>
          <textarea id="congDung" placeholder="Nhập công dụng của thuốc" className="w-full px-3 py-2 border border-[#E76F51] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E76F51] h-24"></textarea>
        </div>

        <div className="relative" ref={dropdownRef}>
          <label className="block text-sm font-medium text-[#4A4E69] mb-1">Thành phần</label>
          <button
            type="button"
            onClick={() => setOpenIngredients(!openIngredients)}
            className="w-full px-3 py-2 border border-[#E76F51] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E76F51] bg-white text-left flex justify-between items-center"
          >
            {ingredients.length > 0
              ? `${ingredients.length} thành phần đã chọn`
              : "Chọn thành phần"}
            <ChevronsUpDown className="h-4 w-4 text-gray-400" />
          </button>
          {openIngredients && (
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
                {filteredIngredients.map((ingredient) => (
                  <li
                    key={ingredient.value}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                    onClick={() => toggleIngredient(ingredient.value)}
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        ingredients.includes(ingredient.value) ? 'text-[#E76F51]' : 'text-transparent'
                      }`}
                    />
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
        
        {ingredients.length > 0 && (
          <div className="mt-2">
            <h4 className="font-medium text-sm text-[#4A4E69] mb-1">Thành phần đã chọn:</h4>
            <div className="flex flex-wrap gap-2">
              {ingredients.map((ingredient) => (
                <span
                  key={ingredient}
                  className="bg-[#FFE5D9] text-[#E76F51] text-sm px-2 py-1 rounded-full flex items-center"
                >
                  {ingredientsList.find((item) => item.value === ingredient)?.label}
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

        <div>
          <label htmlFor="anhDaiDien" className="block text-sm font-medium text-[#4A4E69] mb-1">Ảnh đại diện</label>
          <input id="anhDaiDien" type="file" accept="image/*" className="w-full px-3 py-2 border border-[#E76F51] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E76F51]" />
        </div>

        <div>
          <Label htmlFor="danhMucHinhAnh" className="text-[#4A4E69]">Danh mục hình ảnh</Label>
          <Input id="danhMucHinhAnh" type="file" accept="image/*" multiple className="mt-1 border-[#E76F51] focus:ring-[#E76F51]" />
        </div>
        
        <button type="submit" className="w-full bg-[#E76F51] hover:bg-[#F4A261] text-white font-bold py-2 px-4 rounded transition-colors duration-200">
          Thêm sản phẩm
        </button>
      </form>
    </div>
  );
};

export default AddProduct;