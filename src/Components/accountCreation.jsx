import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import axios from "axios"
const API_URL = import.meta.env.VITE_SERVER_URL;
import { toast } from "react-toastify"
import { useSocket } from '../context/SocketContext';
import { CiSquareQuestion } from "react-icons/ci";


function accountCreation({ userData }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [role, setRole] = useState('');
    const [image, setImage] = useState(null)
    const [response, setResponse] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [searchText, setSearchText] = useState('');
    

    const socket = useSocket()

    const columns = [
        { name: 'Full Name', selector: row => row.fullName },
        { name: 'Email Address', selector: row => row.email },
        { name: 'Request Form', selector: row => (<a className="text-4xl"><CiSquareQuestion className="  hover:cursor-pointer" 
            onClick={() => document.getElementById('account_modal').showModal()}/></a>
              
          ) },
      ];
      
      const data = [
        {fullName: 'Muhammed Sahklahami', email: 'suwqkeqen@gmail.com', createInvoice: '' },
        {fullName: 'Sumbul Almuete', email: 'Sumbul@gmail.com', createInvoice: '' },
        {fullName: 'Daniel Akhmalahibi', email: 'suwqDanielkeqen@gmail.com', createInvoice: '' },
        // Add more data as needed
      ];

      const handleSearch = (event) => {
        setSearchText(event.target.value);
      };
  // Filter data based on search text
  const filteredData = data.filter(row =>
    Object.values(row).some(value =>
      value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );


    // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsLoading(!isLoading)
    const data = new FormData()
    data.append("userName", username)
    data.append("password", password)
    data.append("email", email)
    data.append("role", role)
    data.append("fullName", fullName)
    if(image){
        data.append("image", image)
    }

    try {
        const res = await axios.post(`${API_URL}/API/Account/CreateAccount`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setIsLoading(false)
        
        if(res){
            toast.success(res.data.msg, {
                position: "top-right"
              });
        }

        document.getElementById('account_modal').close();
        
        const accountCreationTrails = {
            userId: userData._id,
            userName: userData.userName,
            role: userData.role,
            action: "CREATED AN ACCOUNT",
            description: `Created an account for ${res.data.dataUser.userName}. ACCOUNT ID ${res.data.dataUser.user_id}`,
      
          };
      
          socket.emit("addAuditTrails", accountCreationTrails);

      } catch (err) {
        if (err.response) {
            setIsLoading(false)
            setResponse(err.response.data.msg || 'Invalid file type, only JPEG and PNG are allowed!')
          } else {
            console.error('Network or unexpected error:', err);
          }
        
      }

  };
  

    return (
        <>
              <div className="max-w-screen-2xl mx-auto mt-4">
            <div className="items-center justify-center bg-white rounded-lg shadow-xl border border-gray-300">
                <div className="mx-4">
                    <div className="overflow-x-auto w-full">
                        <DataTable
                            title="Invoice Creation"
                            columns={columns}
                            data={filteredData}
                            pagination
                            defaultSortField="name"
                            highlightOnHover
                            subHeader
                            subHeaderComponent={
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchText}
                                onChange={handleSearch}
                                className="mb-2 p-2 border border-gray-400 rounded-lg"
                            />
                            }
                        />
                    </div>
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
                                onChange={(e) => setUsername(e.target.value)} required />
                            </div>

                            <div className="w-full">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                    Password
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" 
                                type="password" 
                                placeholder="******************" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} required/>
                            </div>
                        </div>

                        <div className="flex gap-4 w-full">
                            <div className="w-full">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                    Email Address
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" 
                                type="email" 
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} required/> 
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
                                onChange={(e) => setFullName(e.target.value)} required/> 
                            </div>
                        </div>

                        <div className="mt-2 w-full flex">
                            <select className="select select-bordered w-[230px]"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}>
                                <option selected>Select Role</option>
                                <option>ADMIN</option>
                                <option>CHIEF FINANCIAL OFFICER</option>
                                <option>FINANCE MANAGER</option>
                                <option>ACCOUNTANT</option>
                                <option>FINANCIAL ANALYST</option>
                                <option>TREASURER</option>
                            </select>
                        </div>

                        <div className="w-full">
                        <input type="file" className="file-input file-input-bordered file-input-primary w-full max-w-xs " onChange={(e) => setImage(e.target.files[0])} required />
                            </div>
                        {response && <h1 className="text-red-500 font-bold">{response}</h1>}
                        <div className="w-full">
                            {!isLoading && <button className="btn btn-primary w-full font-bold">Submit</button>}
                        </div>
                    </div>
                    </form>
                        {isLoading && <button className="btn btn-primary w-full font-bold"><span className="loading loading-spinner loading-md"></span></button>}
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>Close</button>
                </form>
            </dialog>
        </>
    );
}

export default accountCreation;
