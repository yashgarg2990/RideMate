import React, { createContext, useEffect } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext(null);

const socket = io(`${import.meta.env.VITE_BASE_URL}`)
 console.log("in socket context file ")
 console.log(socket )
const SocketProvider = ({ children }) => {
    useEffect(() => {
        const handleConnect = () => {
            console.log('✅ Connected to server');
        };

        const handleDisconnect = () => {
            console.log('❌ Disconnected from server');
        };

        socket.on('connect', handleConnect);
        socket.on('disconnect', handleDisconnect);

        return () => {
            socket.off('connect', handleConnect);
            socket.off('disconnect', handleDisconnect);
        };
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;
