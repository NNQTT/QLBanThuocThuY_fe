import React from 'react'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export default function AboutUs() {
  return (
    <div className="bg-[#FFBE98]">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-[#FF7F50] mb-4">Về Chúng Tôi</h2>
            <p className="text-gray-600 mb-4">
              Nhà Thuốc Pharmacy là địa chỉ tin cậy cung cấp các sản phẩm thuốc và chăm sóc sức khỏe chất lượng cao cho thú cưng của bạn. Với đội ngũ dược sĩ giàu kinh nghiệm, chúng tôi cam kết mang đến dịch vụ tư vấn chuyên nghiệp và sản phẩm an toàn cho các bé thú cưng.
            </p>
            <p className="text-gray-600">
              Chúng tôi hiểu rằng thú cưng là thành viên quan trọng trong gia đình bạn, vì vậy chúng tôi luôn nỗ lực để cung cấp những sản phẩm tốt nhất và dịch vụ chu đáo nhất.
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-[#FF7F50] mb-4">Thông Tin Liên Hệ</h2>
            <ul className="space-y-4">
              <li className="flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-[#FF7F50]" />
                <span>140 Lê Trọng Tấn, Tây Thạnh, Quận Tân Phú, TP.HCM</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-5 w-5 text-[#FF7F50]" />
                <span>0123 456 789</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-[#FF7F50]" />
                <span>info@pharmacy.com</span>
              </li>
              <li className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-[#FF7F50]" />
                <span>Thứ 2 - Chủ Nhật: 8:00 - 20:00</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}