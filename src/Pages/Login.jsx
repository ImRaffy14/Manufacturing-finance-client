import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'



function Login () {
    const [email , setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(email, password);

    }
    return (
        <>
        
        <div className="hero bg-custom-gradient min-h-screen flex justify-center items-center">
    <         div className="hero-content flex w-full ">
                    <div className="flex-1 flex flex-col space-x-12"></div>
                        <div className="text-center lg:text-left mr-20 w-full lg:w-1/2">
                        <h1 className="text-[100px] font-extrabold text-gray-900 leading-none">Financial Management</h1>
                                <p className="py-6 text-lg text-gray-600">
                                    Sign in to access your account and manage your preferences.
                                </p>
                        </div>
            
            <div className="card bg-white w-full max-w-lg shadow-2xl rounded-md p-10 lg:w-1/2 ">
                <form className="card-body">
                    <div className="form-control mb-6">
                        <label className="label mb-2">
                            <span className="label-text font-semibold text-lg text-gray-700">Email</span>
                        </label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="input input-bordered w-full py-3 px-4 text-lg border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                <label className="label mt-2">
                    <a href="#" className="label-text-alt link link-hover text-blue-500">Forgot password?</a>
                </label>
            </div>

        <div className="form-control mt-8">
          <button className="btn btn-primary w-full py-3 text-lg font-semibold bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
            Login
          </button>
        </div>
      </form>
    </div>
  </div>
</div>

        </>
    )
}

export default Login