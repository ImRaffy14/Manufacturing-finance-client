import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login } from '../authentication/auth';
import { toast } from 'react-toastify';
import BackgroundImage from '../assets/BG.jpg';

function Login() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();
    const expired = location.state?.expired;
    const navigate = useNavigate();

    useEffect(() => {
        if (expired) {
            toast.error('Session Expired', {
                position: 'top-right',
            });
        }
    }, [expired]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/Dashboard');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const userData = { userName, password };
            const response = await login(userData);

            if (response.token) {
                navigate('/Dashboard');
            }
        } catch (err) {
            setIsLoading(false);
            if (err.response) {
                setErrorMessage(err.response.data.msg);
                setUserName('');
                setPassword('');
            } else if (err.request) {
                setErrorMessage('No response from server');
            } else {
                setErrorMessage('Error during login');
            }
        }
    };

    return (
        <div
            className="relative hero min-h-screen flex justify-center items-center bg-cover bg-center"
            style={{ backgroundImage: `url(${BackgroundImage})` }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black opacity-60"></div>

            <div className="hero-content flex w-full relative z-10">
                {/* Login Form */}
                <div className="card bg-white w-[600px] shadow-2xl rounded-lg p-3">
                    <form onSubmit={handleSubmit} className="card-body">
                        <h1 className="text-2xl text-center font-extrabold text-gray-900">LOGIN</h1>

                        {/* Username Input */}
                        <div className="form-control">
                            <label className="label mb-2">
                                <span className="label-text font-semibold text-lg text-gray-700">Username</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter your username"
                                className="input input-bordered w-full py-3 px-4 text-lg border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                required
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                            />
                        </div>

                        {/* Password Input */}
                        <div className="form-control mb-6">
                            <label className="label mb-2">
                                <span className="label-text font-semibold text-lg text-gray-700">Password</span>
                            </label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                className="input input-bordered w-full py-3 px-4 text-lg border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {/* Error Message */}
                        {errorMessage && <h1 className="text-red-500 mb-4">{errorMessage}</h1>}

                        {/* Submit Button */}
                        <div className="form-control">
                            {!isLoading ? (
                                <button
                                    type="submit"
                                    className="btn btn-primary w-full py-3 text-lg font-semibold bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                                >
                                    Login
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="btn btn-primary w-full py-3 text-lg font-semibold bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                                >
                                    <span className="loading loading-spinner loading-md"></span>
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Description Section */}
                <div className="text-center lg:text-left w-full relative z-10 mb-8">
                    <h1 className="text-6xl font-bold text-white leading-none">Financial Management</h1>
                    <p className="py-6 text-lg text-gray-300">
                        Sign in to access your account and manage your preferences.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
