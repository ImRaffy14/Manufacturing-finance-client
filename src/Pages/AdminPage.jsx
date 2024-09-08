import Dashboard from '../Components/Dashboard';
import Search from '../Components/Search';
import Sidebar from '../Components/Sidebar';

function AdminPage () {
    return(
        <>
       <div className="flex">
            <Sidebar />
        <div className="flex-col w-full">
        <Search />
        <Dashboard />
      </div>
    </div>
        </>
    )
}

export default AdminPage