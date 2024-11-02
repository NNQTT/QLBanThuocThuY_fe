import { useState } from "react"

import { Button, Form, Input, message, Image } from 'antd';
import { CiUser } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { MdOutlineMailOutline, MdLockOutline } from "react-icons/md";
import axios from "axios";

const Register = () => {

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const navigate = useNavigate();

    const handleRegister = async () => {
        const payLoad = {
            tentaikhoan: username,
            email: email,
            matkhau: password,
            confirmpass: confirmPassword
        }

        try {
            const res = await axios.post('http://localhost:3000/api/signup', payLoad);
            console.log(res);
            if (res.data.success) {

                message.success('Register successfully');
                navigate('/login');
            } else {
                message.warning('Password not match');
            }
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 400) {
                message.error(error.response.data.message);
            } else {
                message.error('An error occurred. Please try again.');
            }
        }
    };

    return (
        <div className='flex justify-center items-center min-h-screen p-4 bg-[#FFE5D9]'>
            <Form
                title='Register'
                name="Register"
                initialValues={{ remember: true }}
                style={{
                    maxWidth: 500,
                    minWidth: 360,
                    padding: 20,
                    backgroundColor: 'white',
                }}
                onFinish={handleRegister}
            >
                <h3 className="text-3xl font-bold text-center">Register</h3>

                <label htmlFor="username" className={'text-[#4A3228]'}>Username</label>

                <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Please input your username' }]}
                >
                    <Input
                        onChange={(e) => setUsername(e.target.value)}
                        className={'bg-[#FFCBB5] text-[#4A3228] border-[#FF7F50]'}
                        prefix={<CiUser size={20} color="#F37446" />} placeholder="Enter your username" />
                </Form.Item>
                <label htmlFor="email" className={'text-[#4A3228]'}>Email</label>

                <Form.Item
                    name="email"
                    rules={[{ required: true, message: 'Please input your Email!' }]}
                >
                    <Input
                        onChange={(e) => setEmail(e.target.value)}
                        className={'bg-[#FFCBB5] text-[#4A3228] border-[#FF7F50]'}
                        prefix={<MdOutlineMailOutline size={20} color="#F37446" />} placeholder="Enter your email" />
                </Form.Item>


                <label htmlFor="password" className={'text-[#4A3228]'}>Password</label>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please input your Password!' }]}
                >
                    <Input.Password
                        onChange={(e) => setPassword(e.target.value)}
                        className={'bg-[#FFCBB5] text-[#4A3228] border-[#FF7F50]'}
                        prefix={<MdLockOutline size={20} color="#F37446" />} type="password" placeholder="Create a password" />
                </Form.Item>
                <label htmlFor="confirm_password" className={'text-[#4A3228]'}>Confirm Password</label>

                <Form.Item
                    name="confirm_password"
                    rules={[{ required: true, message: 'Please input your confirm Password!' }]}
                >
                    <Input.Password
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={'bg-[#FFCBB5] text-[#4A3228] border-[#FF7F50]'}
                        prefix={<MdLockOutline size={20} color="#F37446" />} type="password" placeholder="Confirm your password" />
                </Form.Item>
                <Form.Item>
                    <Button block
                        className={'bg-[#FF7F50] text-[#4A3228] border-[#FF7F50] text-white text-lg py-5'}
                        htmlType="submit">
                        Register
                    </Button>
                </Form.Item>
                <div className="text-center"><p>Already have an account? <a href="/login" className="text-orange-500">Login here</a></p></div>
            </Form>
        </div>
    );
}

export default Register;