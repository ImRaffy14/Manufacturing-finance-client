
function accountCreation () {
    return(
        <>         
        {/* Open the modal using document.getElementById('ID').showModal() method */}
        <button className="btn" onClick={()=>document.getElementById('my_modal_2').showModal()}>open modal</button>
        <dialog id="my_modal_2" className="modal">
        <div className="modal-box shadow-xl">
            <div className="flex flex-col justify-center gap-4">
                <h1 className="font-bold mb-4 text-lg">CREATE ACCOUNT</h1>

                <div className="flex gap-4">
                    <div className="w-full ">
                        <label className=" block text-gray-700 text-sm font-bold mb-2" for="username">
                            Username
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username"></input>
                    </div>

                    <div className="w-full">
                        <label className="block text-gray-700 text-sm font-bold mb-2" for="password">
                            Password
                        </label>
                        <input class="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************"></input>
                    </div>
                </div>
                
                <div className="flex gap-4">
                    <div className="w-full">
                        <label className=" block text-gray-700 text-sm font-bold mb-2" for="email">
                            Email Address
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="text" placeholder="Email"></input>
                    </div>

                    <div className="w-full">
                        <label className=" block text-gray-700 text-sm font-bold mb-2" for="name">
                            Full Name
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="Full Name"></input>
                    </div>
                </div>

                <div className="mt-2">
                <select className="select select-bordered w-[230px]">
                    <option disabled selected>Select Role</option>
                    <option>ADMIN</option>
                    <option>Financial Officer</option>
                    <option>Auditor</option>
                    <option>BURAT</option>
                    </select>
                </div>

                <div class="">
                    <button className="btn btn-primary w-full font-bold">Submit</button>
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