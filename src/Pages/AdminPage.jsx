import Dashboard from '../Components/Dashboard';
import Search from '../Components/Search';
import Sidebar from '../Components/Sidebar';
import { Routes, Route } from 'react-router-dom'
import Page1 from '../Pages/page1'

function AdminPage () {
    return(
        <>
            <div className="flex">
                <Sidebar />
                <div className="flex-col w-full">
                    <Search />
                    <Routes>
                        <Route path="/" element={ <Dashboard/> } />
                        <Route path="page1" element={ <Page1/> } />
                    </Routes>
                </div>
            </div>
        </>
    )
}

export default AdminPage