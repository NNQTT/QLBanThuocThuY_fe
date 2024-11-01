'use client'

import { useState } from 'react'

import { Button, Form, Input, message, Image, Flex, Checkbox } from 'antd';

import { MdOutlineMailOutline, MdLockOutline } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate();

    const handleLogin = async () => {
        const payload = {
            email: email,
            matkhau: password,
        };

        try {
            const res = await axios.post('http://localhost:3000/api/login', payload);
            console.log(res);
            if (res.data.success) {
                localStorage.setItem('accessToken', res.data.accessToken);

                message.success('Login successfully');
                navigate('/');
            } else {
                message.warning('Email or password is incorrect');
            }

        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 400) {
                message.error('Email or password is incorrect');
            } else {
                message.error('An error occurred. Please try again.');

            }
        };
    };

    return (
        <div className='flex justify-center items-center min-h-screen p-4 bg-[#FFE5D9]'>
            <Form
                title='Login'
                name="login"
                initialValues={{ remember: true }}
                style={{
                    maxWidth: 500,
                    minWidth: 360,
                    padding: 20,
                    backgroundColor: 'white',
                }}
                onFinish={handleLogin}
            >
                <h3 className="text-3xl font-bold text-center">Login</h3>

                <label htmlFor="email" className={'text-[#4A3228]'}>Email</label>

                <Form.Item
                    name="email"
                    rules={[{ required: true, message: 'Please input your Email!' }]}
                >
                    <Input
                        onChange={(e) => setEmail(e.target.value)}
                        className={'bg-[#FFCBB5] text-[#4A3228] border-[#FF7F50]'}
                        prefix={<MdOutlineMailOutline size={20} color="#F37446" />} placeholder="Email" />
                </Form.Item>
                <label htmlFor="password" className={'text-[#4A3228]'}>Password</label>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please input your Password!' }]}
                >
                    <Input.Password
                        onChange={(e) => setPassword(e.target.value)}
                        className={'bg-[#FFCBB5] text-[#4A3228] border-[#FF7F50]'}
                        prefix={<MdLockOutline size={20} color="#F37446" />} type="password" placeholder="Password" />
                </Form.Item>

                <Form.Item>
                    <Flex justify="end" align="center" className='text-orange-500'>
                        <a href="">Forgot password</a>
                    </Flex>
                </Form.Item>

                <Form.Item>
                    <Button block
                        className={'bg-[#FF7F50] text-[#4A3228] border-[#FF7F50]'}
                        htmlType="submit">
                        Log in
                    </Button>
                </Form.Item>
                <div className="text-center"><p>Don't have an account? <a href="/register" className="text-orange-500">Register here</a></p></div>
            </Form>
        </div>
    )
};

export default Login;