import React, { useState } from 'react';

function CommandTerminal() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() !== '') {
      setOutput([...output, { command: input, result: 'Command executed successfully' }]);
      setInput('');
    }
  };

  return (
    <div className="h-full w-full bg-white bg-center bg-no-repeat">
      <div className="bg-black text-green-500 font-mono h-[60vh] flex flex-col p-5">
        {/* Terminal Header */}
        <div className="text-xs mb-3">
          <span>Welcome to the Command Terminal</span>
        </div>

        {/* Notes or Instructions Section */}
        <div className="text-xs text-gray-400 mb-4">
          <p>Type your command below and press Enter.</p>
        </div>

        {/* Terminal Output Section */}
        <div className="overflow-y-auto flex-1 mb-4">
          <div>
            {output.map((item, index) => (
              <div key={index}>
                <div className="text-green-500">{`$ ${item.command}`}</div>
                <div className="text-gray-400">{item.result}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Command Input - Positioned at the bottom */}
        <form onSubmit={handleSubmit} className="flex">
          <span className="text-green-500 mr-2">$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="bg-black text-green-500 flex-1 border-b border-green-500 outline-none"
            placeholder="Type a command..."
          />
        </form>
      </div>
    </div>
  );
}

export default CommandTerminal;
