import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};


export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [token, setToken] = useState(true)

    useEffect(() => {
        if(token){
            const newSocket = io.connect('http://localhost:4000');
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