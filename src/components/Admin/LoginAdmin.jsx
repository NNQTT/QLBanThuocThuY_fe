import { Button, Form, Input, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CiUser } from "react-icons/ci";

const LoginAdmin = () => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleLogin = async () => {
        const payload = {
            username: username,
            matkhau: password,
        };
        try {
            const res = await axios.post('http://localhost:3000/api/loginAdmin', payload);

            console.log(res);
            if (res.data.success) {
                // Save session flag
                localStorage.setItem('accessToken', res.data.accessToken);

                message.success('Login successfully');
                navigate('/admin');
            } else {
                message.warning('Username or password is incorrect');
            }
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 404) {
                message.error('Username or password is incorrect');
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