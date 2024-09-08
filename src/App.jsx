import React from "react";
import AdminPage from './Pages/AdminPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

const App = () => {
  return (
      <>
      <BrowserRouter>
        <Routes>
            <Route path="/*" element={ <AdminPage/> } />
        </Routes>
      </BrowserRouter>
      </>
  );
};

export default App;
