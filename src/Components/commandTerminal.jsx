import React, { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";

function CommandTerminal() {
  const [output, setOutput] = useState("");
  const [command, setCommand] = useState("");
  const [serverStatus, setServerStatus] = useState("Fetching...");
  const [noAccess, setNoAccess] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const ALLOWED_COMMANDS = ["pm2 restart 0", "pm2 logs", "pm2 list"];
  const socket = useSocket();

  useEffect(() => {
    socket.emit("check_if_allowed");

    socket.on("terminal-output", (data) => {
      setOutput((prev) => prev + data);
    });

    socket.on("server-status", (data) => {
      setServerStatus(data);
    });

    const handleAccessStatus = (response) => {
      if (response.status) {
        console.log(response.status);
        socket.emit("fetch-server-status");
        socket.emit("command", "pm2 logs");
        setIsLoading(false);
        setNoAccess(false);
      } else {
        setIsLoading(false);
      }
    };

    socket.on("access_status", handleAccessStatus);

    return () => {
      socket.off("terminal-output");
      socket.off("server-status");
      socket.off("access_status");
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
      setCommand("");
      return;
    }
    setOutput((prev) => prev + `✅ Command executed: ${command}\n`);
    socket.emit("command", command);
    setCommand("");
  };

  if (isLoading) {
    return <div className="flex w-full h-screen items-center justify-center bg-gray-900 text-white">Loading...</div>;
  }

  if (noAccess) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-900 text-white p-4 text-center">
        <div>
          <h1 className="text-3xl font-bold">Access Denied</h1>
          <p className="mt-2 text-lg">You do not have permission to access the terminal.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-auto w-full bg-gray-900 text-green-500 p-4 overflow-hidden">
      <div className="mb-4">
        <h2 className="text-white font-bold">Server Status:</h2>
        <pre className="bg-gray-800 p-2 rounded text-white overflow-x-auto">{serverStatus}</pre>
        <button onClick={fetchServerStatus} className="bg-blue-500 px-4 py-2 mt-2 rounded hover:bg-blue-600 transition">Refresh Status</button>
      </div>
      
      <div className="mb-4">
        <h2 className="text-white font-bold">Allowed Commands:</h2>
        <ul className="text-white list-disc ml-4">
          {ALLOWED_COMMANDS.map((cmd, index) => (
            <li key={index} className="break-words">{cmd}</li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col flex-1 mb-4">
        <h2 className="text-white font-bold">Terminal Output:</h2>
        <pre className="overflow-auto h-80 md:h-[30vh] lg:h-[50vh] bg-gray-800 p-2 rounded text-white border border-gray-700">{output}</pre>
      </div>

      <form onSubmit={sendCommand} className="mt-auto">
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          className="bg-gray-800 text-white p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="Enter command"
        />
      </form>
    </div>
  );
}

export default CommandTerminal;
