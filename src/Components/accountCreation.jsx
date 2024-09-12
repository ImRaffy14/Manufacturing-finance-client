
function accountCreation () {
    return(
        <>          

                    {/* Open the modal using document.getElementById('ID').showModal() method */}
                    <button className="btn" onClick={()=>document.getElementById('my_modal_2').showModal()}>open modal</button>
                    <dialog id="my_modal_2" className="modal">
                    <div className="modal-box h-[560px] w-[600px] max-w-full">
                    <div className="flex justify-center">
                        <div className="w-full ">

                                <div className="flex gap-4"> 
                                    <div className="w-full mb-4">
                                        <label className=" block text-gray-700 text-sm font-bold mb-2" for="username">
                                            Username
                                        </label>
                                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username"></input>
                                    </div>

                                    <div className="w-full mb-6">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" for="password">
                                        Password
                                    </label>
                                    <input class="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************"></input>

                                </div>

                                </div>  
                                <div className="mb-4">
                                    <label className=" block text-gray-700 text-sm font-bold mb-2" for="email">
                                        Email Address
                                    </label>
                                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="text" placeholder="Email"></input>
                                </div>

                                <div className="mb-4">
                                    <label className=" block text-gray-700 text-sm font-bold mb-2" for="name">
                                        Full Name
                                    </label>
                                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="Full Name"></input>
                                </div>

                                <div className="flex">
                                    <div className="dropdown">
                                        <div tabIndex={0} role="button" className="btn w-[200px] font-bold">Select Role</div>
                                            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                                                            <li><a>Admin</a></li>
                                                            <li><a>Auditor</a></li>
                                                            <li><a>Finance Officer</a></li>
                                                            <li><a>Role</a></li>
                                                            <li><a>Roler</a></li>
                                                            <li><a>Rolers</a></li>
                                            </ul>
                                    </div>
                                </div>
                                <div class="mt-[20px]">
                                                    <button className="btn btn-primary w-full text-xl">Submit</button>
                                                </div>

                       
                        </div>
                    </div>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                    </form>
                    </dialog>
        </> 
    )
}

export default accountCreation