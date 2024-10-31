import { Button, Form, Input, message, Image } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Title from 'antd/es/skeleton/Title';

const LoginAdmin = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleLogin = async () => {
        const payload = {
            email: email,
            matkhau: password,
        };
        try {
            const res = await axios.post('http://localhost:3000/api/loginAdmin', payload);

            if (res.data.success) {
                // Save session flag
                localStorage.setItem('isLogin', 'true');

                message.success('Login successfully');
                navigate('/admin');
            } else {
                message.warning('Email or password is incorrect');
            }
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 404) {
                message.error('Email or password is incorrect');
            } else {
                message.error('An error occurred. Please try again.');
            }
        }
    };


    return (
        <div className={'flex justify-center items-center min-h-screen p-4 bg-[#FFE5D9]'}>
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
                
               
                <label htmlFor="email" className={'text-[#4A3228]'}>Email</label>

                <Form.Item
                    name="email"
                    rules={[{ required: true, message: 'Please input your Email!' }]}
                >
                    <Input
                        onChange={(e) => setEmail(e.target.value)}
                        className={'bg-[#FFCBB5] text-[#4A3228] border-[#FF7F50]'}
                        prefix={<UserOutlined />} placeholder="Email" />
                </Form.Item>
                <label htmlFor="password" className={'text-[#4A3228]'}>Password</label>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please input your Password!' }]}
                >
                    <Input.Password
                        onChange={(e) => setPassword(e.target.value)}
                        className={'bg-[#FFCBB5] text-[#4A3228] border-[#FF7F50]'}
                        prefix={<LockOutlined />} type="password" placeholder="Password" />
                </Form.Item>

                <Form.Item>
                    <Button block 
                    className={'bg-[#FF7F50] text-[#4A3228] border-[#FF7F50]'}
                    htmlType="submit">
                        Log in
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default LoginAdmin;