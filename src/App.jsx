import React from "react";
import AdminPage from './Pages/AdminPage'
import Login from './Pages/Login'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

const App = () => {
  return (
      <>
      <BrowserRouter>
        <Routes>
            <Route path="/" element={ <Login/> } />
            <Route path="/Dashboard/*" element={ <AdminPage/> } />
        </Routes>
      </BrowserRouter>
      </>
  );
};

export default App;
