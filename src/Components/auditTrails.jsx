import React from 'react'
import { useState } from 'react';
import DataTable from 'react-data-table-component';

function auditTrails() {
    const [searchText, setSearchText] = useState('');
    
    const columns = [
        { name: 'ID', selector: row => row.id },
        { name: 'Name', selector: row => row.name },
        { name: 'Position', selector: row => row.position },
        { name: 'Office', selector: row => row.office },
        { name: 'Age', selector: row => row.age },
        { name: 'Start Date', selector: row => row.startDate },
        { name: 'Salary', selector: row => row.salary },
      ];
      
      const data = [
        { id: 1, name: 'Tiger Nixon', position: 'System Architect', office: 'Edinburgh', age: 61, startDate: '2011/04/25', salary: '$320,800' },
        { id: 1, name: 'Tiger Nixon', position: 'System Architect', office: 'Edinburgh', age: 61, startDate: '2011/04/25', salary: '$320,800' },
        { id: 1, name: 'Tiger Nixon', position: 'System Architect', office: 'Edinburgh', age: 61, startDate: '2011/04/25', salary: '$320,800' },
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
                            title="Audit Trails"
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

export default auditTrails
