import React, { useState } from 'react';


function accountCreation() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [role, setRole] = useState('');

    // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log({
      username,
      password,
      email,
      fullName,
      role,
    });
  };
  

    return (
        <>
        
            <div className="max-w-screen-2xl mx-auto mt-4">
                <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-xl border border-gray-300">
                    <div className="overflow-x-auto w-full">
                    <table className="table w-full">
                        {/* head */}
                        <thead>
                            <tr>
                                <th>Picture</th>
                                <th>Full Name</th>
                                <th>Email Address</th>
                                <th>Request Form</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* row 1 */}
                            <tr>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="avatar">
                                            <div className="mask mask-squircle h-12 w-12">
                                                <img
                                                    src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                                                    alt="Avatar Tailwind CSS Component" />
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <div className="font-bold">Hart Hagerty</div>
                                    </div>
                                </td>
                                <td>
                                    <div>harthagerty@gmail.com</div>
                                </td>
                                <td>
                                    {/* Modal Button */}
                                    <button className="btn btn-outline" onClick={() => document.getElementById('account_modal').showModal()}>View Form</button>
                                </td>
                            </tr>
                        </tbody>

                        <tbody>
                            {/* row 1 */}
                            <tr>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="avatar">
                                            <div className="mask mask-squircle h-12 w-12">
                                                <img
                                                    src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                                                    alt="Avatar Tailwind CSS Component" />
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <div className="font-bold">Hart Hagerty</div>
                                    </div>
                                </td>
                                <td>
                                    <div>harthagerty@gmail.com</div>
                                </td>
                                <td>
                                    {/* Modal Button */}
                                    <button className="btn btn-outline" onClick={() => document.getElementById('account_modal').showModal()}>View Form</button>
                                </td>
                            </tr>
                        </tbody>

                        <tbody>
                            {/* row 1 */}
                            <tr>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="avatar">
                                            <div className="mask mask-squircle h-12 w-12">
                                                <img
                                                    src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                                                    alt="Avatar Tailwind CSS Component" />
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <div className="font-bold">Hart Hagerty</div>
                                    </div>
                                </td>
                                <td>
                                    <div>harthagerty@gmail.com</div>
                                </td>
                                <td>
                                    {/* Modal Button */}
                                    <button className="btn btn-outline" onClick={() => document.getElementById('account_modal').showModal()}>View Form</button>
                                </td>
                            </tr>
                        </tbody>

                        <tbody>
                            {/* row 1 */}
                            <tr>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="avatar">
                                            <div className="mask mask-squircle h-12 w-12">
                                                <img
                                                    src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                                                    alt="Avatar Tailwind CSS Component" />
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <div className="font-bold">Hart Hagerty</div>
                                    </div>
                                </td>
                                <td>
                                    <div>harthagerty@gmail.com</div>
                                </td>
                                <td>
                                    {/* Modal Button */}
                                    <button className="btn btn-outline" onClick={() => document.getElementById('account_modal').showModal()}>View Form</button>
                                </td>
                            </tr>
                        </tbody>

                                                <tbody>
                            {/* row 1 */}
                            <tr>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="avatar">
                                            <div className="mask mask-squircle h-12 w-12">
                                                <img
                                                    src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                                                    alt="Avatar Tailwind CSS Component" />
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <div className="font-bold">Hart Hagerty</div>
                                    </div>
                                </td>
                                <td>
                                    <div>harthagerty@gmail.com</div>
                                </td>
                                <td>
                                    {/* Modal Button */}
                                    <button className="btn btn-outline" onClick={() => document.getElementById('account_modal').showModal()}>View Form</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            </div>

            {/* Modal */}
            <dialog id="account_modal" className="modal">
                <div className="modal-box shadow-xl">

                
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col justify-center items-center gap-4">
                        <h1 className="font-bold mb-4 text-lg">CREATE ACCOUNT</h1>

                        <div className="flex gap-4 w-full">
                            <div className="w-full">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                                    Username
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username"
                                type="text" 
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)} />
                            </div>

                            <div className="w-full">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                    Password
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" 
                                type="password" 
                                placeholder="******************" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}/>
                            </div>
                        </div>

                        <div className="flex gap-4 w-full">
                            <div className="w-full">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                    Email Address
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" 
                                type="text" 
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}/> 
                            </div>

                            <div className="w-full">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                    Full Name
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                id="name" 
                                type="text" 
                                placeholder="Full Name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}/> 
                            </div>
                        </div>

                        <div className="mt-2 w-full flex">
                            <select className="select select-bordered w-[230px]"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}>
                                <option selected>Select Role</option>
                                <option>ADMIN</option>
                                <option>Financial Officer</option>
                                <option>Auditor</option>
                                <option>BURAT</option>
                            </select>
                        </div>

                        <div className="w-full">
                            <button className="btn btn-primary w-full font-bold">Submit</button>
                        </div>
                    </div>
                    </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>Close</button>
                </form>
            </dialog>
        </>
    );
}

export default accountCreation;
