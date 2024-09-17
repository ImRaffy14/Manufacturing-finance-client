import React from 'react'
import { useState } from 'react';
import DataTable from 'react-data-table-component';

function viewAllAccounts() {
    const [searchText, setSearchText] = useState('');
    
    const columns = [
        { name: 'Username', selector: row => row.username },
        { name: 'Password', selector: row => row.password },
        { name: 'Email', selector: row => row.email },
        { name: 'Full Name', selector: row => row.name },
        { name: 'Role', selector: row => row.role },
      ];
      
      const data = [
        { username: 'burachi', password: 'malaking burat', email: 'buratatat@gmail.com', name: 'Edinburgh', role: 'Doctor'},
        { username: 'burachi', password: 'malaking burat', email: 'buratatat@gmail.com', name: 'Edinburgh', role: 'Doctor'},
        { username: 'burachi', password: 'malaking burat', email: 'buratatat@gmail.com', name: 'Edinburgh', role: 'Doctor'},
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
    

  return (
<>
        <div className="max-w-screen-2xl mx-auto mt-4">
            <div className="items-center justify-center bg-white rounded-lg shadow-xl border border-gray-300">
                <div className="mx-4">
                    <div className="overflow-x-auto w-full">
                        <DataTable
                            title="Accounts List"
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
</>

  )
}

export default viewAllAccounts
