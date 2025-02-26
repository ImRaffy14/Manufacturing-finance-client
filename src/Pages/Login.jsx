import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login } from '../authentication/auth';
import { toast } from 'react-toastify';
import BackgroundImage from '../assets/BG.jpg';
import Recaptcha from '../assets/recaptcha.png'
import axios from 'axios'
import ReCAPTCHA from 'react-google-recaptcha';
import OTP from '../assets/OTP.png'

function Login() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [otp, setOtp] = useState('')
    const [email, setEmail] = useState('')
    const [otpArray, setOtpArray] = useState(["", "", "", "", "", ""]);
    const [completeOtp, setCompleteOtp] = useState(false)
    const [otpError, setOtpError] = useState('')
    const [otpResend, setOtpResend] = useState('')
    const [isOtpLoading, setIsOtpLoading] = useState(false)
    const [isNoLongerBL, setIsNoLongerBL] = useState('')
    const [timer, setTimer] = useState(300);
    const [timeLeft, setTimeLeft] = useState(0)
    const [showTermsModal, setShowTermsModal] = useState(true);

    useEffect(() => {
        if (showTermsModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [showTermsModal]);


    // TIMER
    useEffect(() => {
        let interval;

        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000); // Decrease timer every second
        } else {
            clearInterval(interval); // Clear the interval when timer reaches 0
        }

        // Cleanup the interval when the component unmounts
        return () => clearInterval(interval);
    }, [timer]); // Re-run when `timer` changes

    
    // OTP TIME FORMAT
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    };


    // BLACKLISTED TIMER 
    useEffect(() => {
        if (timeLeft <= 0) return;
    
        const timer = setInterval(() => {
          setTimeLeft((prevTime) => prevTime - 1000);
        }, 1000);
    
        return () => {
            clearInterval(timer)
        };
      }, [timeLeft]);

    // BLACKLISTED TIME FORMAT
    const formatTimeBL = (time) => {
        const minutes = Math.floor(time / 60000);
        const seconds = Math.floor((time % 60000) / 1000);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      };


    // Reset timer logic (for example, on "Resend OTP")
    const handleResetTimer = () => {
        setTimer(300); // Reset to 5 minutes
    };
    
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

        setIsNoLongerBL('')
        setErrorMessage('')

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

            if(response.success){
                setIsNoLongerBL(response.msg)
                setRcToken(false)
                setVerified('')
                setErrorMessage('')
                setUserName('');
                setPassword('');
                setIsLoading(false)
                return
            }

            if (response.token) {
                navigate('/Dashboard');
            }
        } catch (err) {
            setIsLoading(false);
            if (err.response) {
                if(err.response.status === 401){
                    document.getElementById('mfa_modal').showModal()
                }

                if(err.response.status === 412){
                    localStorage.removeItem('f-login')
                }

                if(err.response.data.banTime && err.response.data.banDuration){
                   const time = err.response.data.banTime + err.response.data.banDuration - Date.now();
                   setTimeLeft(time)
                   console.log(time)
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

    const handleOtpInput = (e, index) => {
        const value = e.target.value;
        if (/^[0-9]?$/.test(value)) { // Allow only single digit or empty
            const updatedOtpArray = [...otpArray];
            updatedOtpArray[index] = value; // Update the specific index
            setOtpArray(updatedOtpArray);
    
            // Automatically move focus to the next input
            if (value && index < otpArray.length - 1) {
                document.getElementById(`otp-input-${index + 1}`).focus();
            }
    
            // Check if all inputs are filled
            setCompleteOtp(updatedOtpArray.every((digit) => digit !== ""));
        }
    };

    // HANDLES VERIFY OTP SUBMIT
    const handlesOtp = async (e) => {
        try {
            e.preventDefault();
    
            // Combine the OTP array into a single string
            const otp = otpArray.join(""); 
    
            const response = await axios.post(`${API_URL}/verify-otp`, { email, otp });
    
            if (response) {
                // Clear OTP inputs
                setOtpArray(["", "", "", "", "", ""]);
                setRcToken(false);
                setVerified(false);
                localStorage.setItem("f-login", response.data.token);
    
                // Close the modal
                document.getElementById("mfa_modal").close();
    
                // Show success message
                toast.success(`${response.data.msg} Please Login Again`, {
                    position: "top-center",
                });
    
                // Clear any previous error messages
                setErrorMessage("");
            }
        } catch (error) {
            if (error.response) {
                // Display server-provided error message
                setOtpError(error.response.data.msg);
    
                // Clear OTP inputs and reset state
                setOtpArray(["", "", "", "", "", ""]);
                setRcToken(false);
                setVerified(false);
            } else {
                // Handle network or other errors
                setOtpArray(["", "", "", "", "", ""]);
                setRcToken(false);
                setVerified(false);
                console.error(error.message);
                toast.error("Something went wrong", {
                    position: "top-right",
                });
            }
        }
    };
    

    // HANDLES RESEND OTP
    const handlesResendOtp = async () => {
        try {
            setIsOtpLoading(true);
            const response = await axios.post(`${API_URL}/resend-otp`, { email });
            if (response) {
                setOtpResend(response.data.msg);
                setTimer(300); // Reset the timer to 5 minutes
                setIsOtpLoading(false);
            }
        } catch (error) {
            setOtpError("Can't send the OTP server error.");
            setIsOtpLoading(false);
        }
    };
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
                {showTermsModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-cover bg-center z-50" style={{ backgroundImage: `url(${BackgroundImage})` }}>
                    <div className="bg-white bg-opacity-90 p-10 rounded-lg shadow-2xl w-[800px] text-center">
                        <h2 className="text-2xl font-bold mb-4">Terms and Conditions</h2>
                        <p className="text-md text-gray-700 mb-6 text-left">
                            Welcome to our financial management system. Your security is our priority, and we collect IP addresses for security purposes, anomaly detection, and monitoring unauthorized access attempts. By accessing this system, you agree to comply with the following terms:
                        </p>
                        <ul className="text-md text-gray-700 text-left list-disc pl-6 mb-6">
                            <li>Your IP address will be recorded for security and auditing purposes.</li>
                            <li>You must not share your login credentials with anyone.</li>
                            <li>Unauthorized access attempts may result in account suspension.</li>
                            <li>All transactions are logged and monitored for security purposes.</li>
                            <li>By proceeding, you confirm that you understand and accept these terms.</li>
                        </ul>
                        <button
                            onClick={() => setShowTermsModal(false)}
                            className="btn btn-primary w-full py-3 text-lg"
                        >
                            Accept
                        </button>
                    </div>
                </div>
            )}

            {!showTermsModal && (
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
                            <div className="flex">
                                <p className="text-blue-500 font-semibold text-md hover:text-blue-800 cursor-pointer mb-2"
                                onClick={()=>document.getElementById('terms_modal').showModal()}
                                >Terms and conditions</p>
                            </div>


                            {errorMessage && <h1 className="text-red-500 mb-4">{errorMessage} <span>{timeLeft <= 0 ? '' : formatTimeBL(timeLeft) }</span></h1>}
                            {isNoLongerBL && <h1 className="text-green-500 mb-4">{isNoLongerBL}</h1> }

                            <div className="flex justify-between items-center border px-2">
                                <div className='flex items-center'>
                                    <input type="checkbox" checked={verified} className="checkbox mr-3" onClick={handleVerify} />
                                    <span className="text-md font-medium">I'm not a robot</span>
                                </div>
                                
                                <img src={Recaptcha} className='w-[70px]'></img>
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
            )}

            <dialog id="terms_modal" className="modal">
                    <div className="modal-box w-full max-w-[900px] rounded-xl shadow-2xl bg-white p-10">
                        <h2 className="text-2xl font-bold mb-4">Terms and Conditions</h2>
                        <p className="text-md text-gray-700 mb-6 text-left">
                            Welcome to our financial management system. Your security is our priority, and we collect IP addresses for security purposes, anomaly detection, and monitoring unauthorized access attempts. By accessing this system, you agree to comply with the following terms:
                        </p>
                        <ul className="text-md text-gray-700 text-left list-disc pl-6 mb-6">
                            <li>Your IP address will be recorded for security and auditing purposes.</li>
                            <li>You must not share your login credentials with anyone.</li>
                            <li>Unauthorized access attempts may result in account suspension.</li>
                            <li>All transactions are logged and monitored for security purposes.</li>
                            <li>By proceeding, you confirm that you understand and accept these terms.</li>
                        </ul>
                    </div>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
            </dialog>

            {/* MFA MODAL */}
            <dialog id="mfa_modal" className="modal modal-bottom sm:modal-middle">
    <div className="modal-box flex flex-col items-center">
        <div className="flex flex-col items-center">
            <h3 className="font-bold text-lg text-center">OTP Verification</h3>
            <p className="text-gray-600 mb-4 text-center">
                Your device is not verified.<br />
                Code has been sent to your registered email.
            </p>
            <p className="text-gray-600 mb-4 text-center">
                Time remaining: <span className="font-bold text-red-600">{formatTime(timer)}</span>
            </p>
        </div>

        <form onSubmit={handlesOtp} className="flex flex-col items-center w-full max-w-md">
            <div className="flex space-x-2 mb-4">
                {otpArray.map((digit, index) => (
                    <input
                        key={index}
                        id={`otp-input-${index}`}
                        type="text"
                        maxLength="1"
                        value={digit}
                        className="input input-bordered input-success w-12 h-12 text-center text-lg"
                        onChange={(e) => handleOtpInput(e, index)}
                    />
                ))}
            </div>

            <p className="text-red-700 mt-2">{otpError}</p>
            <p className="text-green-600 mt-2">{otpResend}</p>

            <button 
                className="btn btn-primary w-full mt-4" 
                type="submit" 
                disabled={!completeOtp || timer === 0}
            >
                Next
            </button>
        </form>

        <p className="text-sm text-gray-500 mt-4">
            Didn't get the code? 
            <span 
                className="text-blue-600 font-semibold cursor-pointer underline" 
                onClick={handlesResendOtp}
            >
                {isOtpLoading ? (
                    <span className="loading loading-spinner loading-sm text-black"></span>
                ) : (
                    'Resend'
                )}
            </span>
        </p>
    </div>
</dialog>



        </>
    );
}

export default Login;
