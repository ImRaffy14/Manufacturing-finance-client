import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios'

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};


export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    const isAuthenticated = () => {
        const token = localStorage.getItem('token');
        return !!token
      };

    useEffect(() => {
        if(isAuthenticated()){

            const newSocket = io.connect(import.meta.env.VITE_SERVER_URL, {
                withCredentials: true,
                transports: ['websocket'],
            });
            setSocket(newSocket);
            return () => {
                newSocket.disconnect();
            };
        }else{
            return;
        }
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};