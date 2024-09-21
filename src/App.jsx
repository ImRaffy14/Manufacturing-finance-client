import React from "react";
import AdminPage from './Pages/AdminPage'
import Login from './Pages/Login'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SocketProvider } from './context/SocketContext.jsx'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
      <>
      <ToastContainer/>
      <BrowserRouter>
        <Routes>
            <Route path="/" element={ <Login/> } />
            <Route path="/Dashboard/*" element={<> <SocketProvider> <AdminPage/> </SocketProvider> </>  } />
        </Routes>
      </BrowserRouter>
      </>
  );
};

export default App;
