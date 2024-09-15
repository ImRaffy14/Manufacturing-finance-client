import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useNavigate} from 'react-router-dom'
import { login } from '../authentication/auth'



function Login () {
    const [userName , setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('')
    console.log(errorMessage)
    const navigate = useNavigate();

    useEffect(() => {
        const isAuthenticated = () => {
            const token = localStorage.getItem('token');
            if(token){
              navigate('/Dashboard')
            }
          };

          isAuthenticated()
    }, [navigate])

    const handleSubmit = async (e) => {
        e.preventDefault();
       
        try{
            const userData = { userName, password }
            const response = await login(userData)

            if(response.token){
                navigate('/Dashboard')
            }
        }
        catch (err) {
            if (err.response) {
                setErrorMessage(err.response.data.msg); 
            } else if (err.request) {
                setErrorMessage('No response from server');
            } else {
                setErrorMessage('Error during login');
            }
        }
    }
    return (
        <>
        
            
                <div className="hero bg-custom-gradient min-h-screen flex justify-center items-center">
                    <div className="hero-content flex w-full ">
                        <div className="card bg-white w-[600px]  shadow-2xl rounded-lg p-3">
                            <form onSubmit={handleSubmit} className="card-body">
                                <h1 className="text-2xl text-center font-extrabold text-gray-900 leading-none mb-4">LOGIN</h1>
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

                        <div className="form-control ">
                            <button className="btn btn-primary w-full py-3 text-lg font-semibold bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
                                Login
                            </button>
                        </div>
                    </form>
                </div>
                        
                        <div className="text-center lg:text-left w-full">
                            <h1 className="text-[80px] font-extrabold text-gray-900 leading-none">Financial Management</h1>
                                <p className="py-6 text-lg text-gray-600">
                                    Sign in to access your account and manage your preferences.
                                </p>
                        </div>
            </div>
        </div>

        </>
    )
}

export default Login