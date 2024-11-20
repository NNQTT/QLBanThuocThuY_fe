import React, { useState } from 'react'
import { Edit } from 'lucide-react'

export default function DetailProduct() {
  const [isEditing, setIsEditing] = useState(false)
  const [medicine, setMedicine] = useState({
    maThuoc: 'MED001',
    tenThuoc: 'Paracetamol',
    giaBan: 5000,
    soLuong: 100,
    dangBaoChe: 'Viên nén',
    qcDongGoi: 'Hộp 10 vỉ x 10 viên',
    congDung: 'Giảm đau, hạ sốt',
    trangThai: 'Còn hàng',
    maNhomThuoc: 'Thuốc giảm đau',
    maLoai: 'Thuốc không kê đơn'
  })

  const [editedMedicine, setEditedMedicine] = useState(medicine)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditedMedicine(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    setMedicine(editedMedicine)
    setIsEditing(false)
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <img
            src="/placeholder.svg"
            alt={medicine.tenThuoc}
            width={400}
            height={400}
            className="rounded-lg shadow-md mb-4"
          />
          <div className="grid grid-cols-3 gap-2">
            {[...Array(6)].map((_, index) => (
              <img
                key={index}
                src="/placeholder.svg"
                alt={`${medicine.tenThuoc} ${index + 1}`}
                width={100}
                height={100}
                className="rounded-md shadow-sm"
              />
            ))}
          </div>
        </div>
        <div className="md:w-2/3">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">{medicine.tenThuoc}</h1>
            <button 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              onClick={() => setIsEditing(true)}
              aria-label="Chỉnh sửa thông tin thuốc"
            >
              <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
            </button>
          </div>
          {isEditing && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Chỉnh sửa thông tin thuốc</h2>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="maThuoc" className="block text-sm font-medium text-gray-700">Mã Thuốc</label>
                        <input 
                          id="maThuoc" 
                          name="maThuoc" 
                          value={editedMedicine.maThuoc} 
                          onChange={handleInputChange} 
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                      </div>
                      <div>
                        <label htmlFor="tenThuoc" className="block text-sm font-medium text-gray-700">Tên thuốc</label>
                        <input 
                          id="tenThuoc" 
                          name="tenThuoc" 
                          value={editedMedicine.tenThuoc} 
                          onChange={handleInputChange} 
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                      </div>
                      <div>
                        <label htmlFor="giaBan" className="block text-sm font-medium text-gray-700">Giá bán</label>
                        <input 
                          id="giaBan" 
                          name="giaBan" 
                          type="number" 
                          value={editedMedicine.giaBan} 
                          onChange={handleInputChange} 
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                      </div>
                      <div>
                        <label htmlFor="soLuong" className="block text-sm font-medium text-gray-700">Số lượng</label>
                        <input 
                          id="soLuong" 
                          name="soLuong" 
                          type="number" 
                          value={editedMedicine.soLuong} 
                          onChange={handleInputChange} 
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                      </div>
                      <div>
                        <label htmlFor="dangBaoChe" className="block text-sm font-medium text-gray-700">Dạng bào chế</label>
                        <input 
                          id="dangBaoChe" 
                          name="dangBaoChe" 
                          value={editedMedicine.dangBaoChe} 
                          onChange={handleInputChange} 
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                      </div>
                      <div>
                        <label htmlFor="qcDongGoi" className="block text-sm font-medium text-gray-700">Quy cách đóng gói</label>
                        <input 
                          id="qcDongGoi" 
                          name="qcDongGoi" 
                          value={editedMedicine.qcDongGoi} 
                          onChange={handleInputChange} 
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                      </div>
                      <div>
                        <label htmlFor="congDung" className="block text-sm font-medium text-gray-700">Công dụng</label>
                        <input 
                          id="congDung" 
                          name="congDung" 
                          value={editedMedicine.congDung} 
                          onChange={handleInputChange} 
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                      </div>
                      <div>
                        <label htmlFor="trangThai" className="block text-sm font-medium text-gray-700">Trạng thái</label>
                        <input 
                          id="trangThai" 
                          name="trangThai" 
                          value={editedMedicine.trangThai} 
                          onChange={handleInputChange} 
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                      </div>
                      <div>
                        <label htmlFor="maNhomThuoc" className="block text-sm font-medium text-gray-700">Nhóm thuốc</label>
                        <input 
                          id="maNhomThuoc" 
                          name="maNhomThuoc" 
                          value={editedMedicine.maNhomThuoc} 
                          onChange={handleInputChange} 
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                      </div>
                      <div>
                        <label htmlFor="maLoai" className="block text-sm font-medium text-gray-700">Loại sử dụng</label>
                        <input 
                          id="maLoai" 
                          name="maLoai" 
                          value={editedMedicine.maLoai} 
                          onChange={handleInputChange} 
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700">Thành phần</label>
                      <textarea 
                        id="ingredients" 
                        name="ingredients" 
                        value={editedMedicine.ingredients} 
                        onChange={handleInputChange} 
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                    </div>
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">Mô tả</label>
                      <textarea
                        id="description"
                        name="description"
                        value={editedMedicine.description}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-4 mt-4">
                    <button 
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                      onClick={() => setIsEditing(false)}
                    >
                      Hủy
                    </button>
                    <button 
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                      onClick={handleSave}
                    >
                      Lưu thay đổi
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Mã Thuốc:</p>
              <p>{medicine.maThuoc}</p>
            </div>
            <div>
              <p className="font-semibold">Giá bán:</p>
              <p>{medicine.giaBan.toLocaleString('vi-VN')} VNĐ</p>
            </div>
            <div>
              <p className="font-semibold">Số lượng:</p>
              <p>{medicine.soLuong}</p>
            </div>
            <div>
              <p className="font-semibold">Dạng bào chế:</p>
              <p>{medicine.dangBaoChe}</p>
            </div>
            <div>
              <p className="font-semibold">Quy cách đóng gói:</p>
              <p>{medicine.qcDongGoi}</p>
            </div>
            <div>
              <p className="font-semibold">Công dụng:</p>
              <p>{medicine.congDung}</p>
            </div>
            <div>
              <p className="font-semibold">Trạng thái:</p>
              <p>{medicine.trangThai}</p>
            </div>
            <div>
              <p className="font-semibold">Nhóm thuốc:</p>
              <p>{medicine.maNhomThuoc}</p>
            </div>
            <div>
              <p className="font-semibold">Loại sử dụng:</p>
              <p>{medicine.maLoai}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="font-semibold">Thành phần:</p>
            <p>{medicine.ingredients}</p>
          </div>
          <div className="mt-4">
            <p className="font-semibold">Mô tả:</p>
            <div dangerouslySetInnerHTML={{ __html: medicine.description }} />
          </div>
        </div>
      </div>
    </div>
  )
}