import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login } from '../authentication/auth';
import { toast } from 'react-toastify';
import BackgroundImage from '../assets/BG.jpg';
import Recaptcha from '../assets/recaptcha.png'
import axios from 'axios'
import ReCAPTCHA from 'react-google-recaptcha';


function Login() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [otp, setOtp] = useState('')
    const [email, setEmail] = useState('')
    const [completeOtp, setCompleteOtp] = useState(false)
    const [otpError, setOtpError] = useState('')
    const [otpResend, setOtpResend] = useState('')
    const [isOtpLoading, setIsOtpLoading] = useState(false)

    //RECAPTCHA STATES
    const [verified, setVerified] = useState(false)
    const [rcToken, setRcToken] = useState('')


    const location = useLocation();
    const expired = location.state?.expired;
    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_AUTH_URL;

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


    // HANDLES RECAPTCHA VERIFICATION
    const handleVerify = async () => {
        try {
          const siteKey = import.meta.env.VITE_RC_SITE_KEY;
          const recaptchaToken = await window.grecaptcha.execute(siteKey, { action: 'submit' });
          setRcToken(recaptchaToken);
          setVerified(true);
        } catch (error) {
          console.error('Error during reCAPTCHA verification:', error);
        }
      };


    // HANDLES SUBMIT LOGIN FORM    
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!verified) {
            toast.error("Please complete the reCAPTCHA verification", {
                position: 'top-right',
            })
            return;
          }

        try {
            setIsLoading(true);

            // RECAPTCHA VERIFICATION
            const rcResponse = await axios.post(`${import.meta.env.VITE_SERVER_URL}/API/VERIFY-RECAPTCHA`, { rcToken })
            if(rcResponse){
                toast.success("reCAPTCHA verified!", {
                    position: 'top-right',
                })
            }
            else{
                toast.error("reCAPTCHA verification failed", {
                    position: 'top-right',
                })
                setRcToken(false)
                setVerified('')
                return
            }

            const firstLogin = localStorage.getItem('f-login')
            const userData = { userName, password, firstLogin };
            const response = await login(userData);

            if (response.token) {
                navigate('/Dashboard');
            }
        } catch (err) {
            setIsLoading(false);
            if (err.response) {
                if(err.response.status === 401){
                    document.getElementById('mfa_modal').showModal()
                }

                if(err.response.status === 403){
                    localStorage.removeItem('f-login')
                }

                setErrorMessage(err.response.data.msg);
                setEmail(err.response.data.email)
                setUserName('');
                setPassword('');
                setRcToken(false)
                setVerified('')
            } else if (err.request) {
                setErrorMessage('No response from server');
                setRcToken(false)
                setVerified('')
            } else {
                setErrorMessage('Error during login');
                setRcToken(false)
                setVerified('')
            }
        }
    };


    // HANDLES VERIFY OTP SUBMIT
    const handlesOtp = async (e) => {
        try{
            e.preventDefault()

            const response = await axios.post(`${API_URL}/verify-otp`, {email, otp})
            
            if(response){
            setOtp('')
            setRcToken(false)
            setVerified('')
            localStorage.setItem('f-login', response.data.token)
            document.getElementById('mfa_modal').close()
            toast.success(`${response.data.msg} Please Login Again`, {
                position: 'top-center',
            });

            setErrorMessage('')
            }
        }
        catch(error){
            if(error.response){
                setOtpError(error.response.data.msg)
                setOtp('')
                setRcToken(false)
                setVerified('')
            }
            else{
                setOtp('')
                setRcToken(false)
                setVerified('')
                console.log(error.message)
                toast.error('Something went error', {
                    position: 'top-right',
                });
            }
        }
    }

    // HANDLES RESEND OTP
    const handlesResendOtp = async () => {
        try{
            setIsOtpLoading(true)
            const response = await axios.post(`${API_URL}/resend-otp`, {email})
            if(response){
                setOtpResend(response.data.msg)
                setIsOtpLoading(false)
            }
        }
        catch(error){
            setOtpError("Can't send the OTP server error.")
            console.log(error.message)
        }
    }

    // CHECK IF OTP IS VALID LENGTH
    useEffect(() => {
        if(otp.length == 6){
            setCompleteOtp(true)
        }
        else{
            setCompleteOtp(false)
        }
    }, [otp])

    return (
        <>
            <div className="relative hero min-h-screen flex justify-center items-center bg-cover bg-center"
                style={{ backgroundImage: `url(${BackgroundImage})` }}>
                <div className="absolute inset-0 bg-black opacity-60"></div>
                <div className="hero-content flex w-full relative z-10">
                    {/* LOGIN FORM */}
                    <div className="card bg-white w-[600px] shadow-2xl rounded-lg p-3">
                        <form onSubmit={handleSubmit} className="card-body">
                            <h1 className="text-2xl text-center font-extrabold text-gray-900">LOGIN</h1>
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

                            {errorMessage && <h1 className="text-red-500 mb-4">{errorMessage}</h1>}

                            <div className="flex justify-between items-center">
                                <div className='flex items-center'>
                                    <span className="text-md font-medium mr-3">Verify reCAPTCHA</span>
                                    <input type="checkbox" checked={verified} className="checkbox checkbox-info" onClick={handleVerify} />
                                </div>
                                
                                <img src={Recaptcha} className='w-[60px]'></img>
                            </div>
                            
                            <div className="form-control">
                                {!isLoading ? (
                                    <button
                                        type="submit"
                                        className="btn btn-primary w-full py-3 text-lg font-semibold bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                                        disabled={!verified}
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

                    <div className="text-center lg:text-left w-full relative z-10 mb-8">
                        <h1 className="text-6xl font-bold text-white leading-none">Financial Management</h1>
                        <p className="py-6 text-lg text-gray-300">
                            Sign in to access your account and manage your preferences.
                        </p>
                    </div>
                </div>
            </div>

            {/* MFA MODAL */}
            <dialog id="mfa_modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box flex flex-col">
                    <h3 className="font-bold text-lg">OTP VERIFICATION</h3>
                    <p className="py-4">Your device is not verified <br/> code has been send to your registered email</p>
                    <p className="mb-1">Didn't receive the OTP? <span className='text-blue-600 font-semibold cursor-pointer underline' onClick={handlesResendOtp}>{isOtpLoading ? <span className="loading loading-spinner loading-sm text-black"></span> : 'Resend' }</span> </p>
                    <form onSubmit={handlesOtp}>
                    <input
                    type="text"
                    placeholder="Enter the OTP"
                    value={otp}
                    className="input input-bordered input-success w-full max-w-xs" 
                    onChange={(e) => setOtp(e.target.value) }/>
                    <p className="text-red-700 mt-2">{otpError}</p>
                    <p className="text-green-600 mt-2">{otpResend}</p>                
                    {completeOtp && 
                    <button className='btn btn-success w-20 mt-2' type="submit">Submit</button>
                    }
                    </form>
                    {!completeOtp && 
                    <button className="btn btn-success w-20 mt-2" disabled="disabled">Submit</button>
                    }
                </div>
            </dialog>
        </>
    );
}

export default Login;
