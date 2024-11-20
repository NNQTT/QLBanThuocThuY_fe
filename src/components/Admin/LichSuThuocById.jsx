import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const LichSuThuocById = () => {
    const [lichSu, setLichSu] = useState([]);
    const [loading, setLoading] = useState(true);
    const { maThuoc } = useParams();

    useEffect(() => {
        const fetchLichSu = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/admin/lichsuthuoc/${maThuoc}`);
                console.log('Dữ liệu lịch sử theo mã:', response.data); // Debug
                setLichSu(response.data);
            } catch (error) {
                console.error("Error fetching history:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLichSu();
    }, [maThuoc]);

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return <div className="text-center py-4">Đang tải...</div>;
    }

    if (!lichSu || lichSu.length === 0) {
        return (
            <div className="bg-white mx-10 p-8">
                <h3 className="text-3xl font-bold text-[#22223B] mb-6">Lịch sử cập nhật thuốc: {maThuoc}</h3>
                <div className="text-center py-8 text-gray-500">
                    <p className="text-lg">Chưa có lịch sử chỉnh sửa thuốc này</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white mx-10 p-8">
            <h3 className="text-3xl font-bold text-[#22223B] mb-6">Lịch sử cập nhật thuốc: {maThuoc}</h3>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-[#FFE5D9] text-[#4A4E69]">
                        <tr>
                            <th className="px-6 py-4 text-left">Mã thuốc</th>
                            <th className="px-6 py-4 text-left">Tên thuốc</th>
                            <th className="px-6 py-4 text-left">Người cập nhật</th>
                            <th className="px-6 py-4 text-left">Thời gian</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {lichSu.map((item) => (
                            <tr key={item.MaThemSuaThuoc} className="hover:bg-gray-50">
                                <td className="px-6 py-4">{item.MaThuoc}</td>
                                <td className="px-6 py-4">{item.TenThuoc}</td>
                                <td className="px-6 py-4">{item.TenTaiKhoan}</td>
                                <td className="px-6 py-4">
                                    {formatDateTime(item.NgayCapNhat)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LichSuThuocById; 