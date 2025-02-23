import React, { useEffect, useState } from 'react';
import { useSocket } from '../context/SocketContext';

function CommandTerminal() {
  const [output, setOutput] = useState("");
  const [command, setCommand] = useState("");
  const [serverStatus, setServerStatus] = useState("Fetching...");

  const ALLOWED_COMMANDS = ["pm2 restart 0", "pm2 logs", "pm2 list"];

  const socket = useSocket();

  useEffect(() => {
    socket.emit("fetch-server-status");
    socket.emit("command", "pm2 logs");

    socket.on("terminal-output", (data) => {
        setOutput((prev) => prev + data);
    });

    socket.on("server-status", (data) => {
        setServerStatus(data);
    });

    return () => {
        socket.off("terminal-output");
        socket.off("server-status");
    };
}, []);

const fetchServerStatus = () => {
    setServerStatus("Fetching...");
    socket.emit("fetch-server-status");
};

const sendCommand = (e) => {
    e.preventDefault();
    if (!ALLOWED_COMMANDS.includes(command.trim())) {
        setOutput((prev) => prev + `❌ Command not allowed: ${command}\n`);
        return;
    }
    socket.emit("command", command);
    setCommand("");
};

return (
  <div className="h-full w-full bg-white bg-center bg-no-repeat">
     <div className="p-4 bg-black text-green-500 h-screen">
          <h2 className="text-white font-bold">Server Status:</h2>
          <pre className="bg-gray-900 p-2 rounded text-white">{serverStatus}</pre>
          <button onClick={fetchServerStatus} className="bg-blue-500 p-2 mt-2">Refresh Status</button>

          <h2 className="mt-4 text-white font-bold">Allowed Commands:</h2>
          <ul className="text-white list-disc ml-4">
              {ALLOWED_COMMANDS.map((cmd, index) => (
                  <li key={index}>{cmd}</li>
              ))}
          </ul>

          <h2 className="mt-4 text-white font-bold">Terminal Output:</h2>
          <pre className="overflow-auto h-3/6">{output}</pre>
          
          <form onSubmit={sendCommand} className="mt-5">
              <input 
                  type="text"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  className="bg-gray-800 text-white p-2 w-full"
                  placeholder="Enter command"
              />
          </form>
      </div>
  </div>
  );
}

export default CommandTerminal;
