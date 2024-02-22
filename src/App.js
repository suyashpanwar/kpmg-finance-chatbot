import React, { useState } from 'react';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [userQuery, setUserQuery] = useState('');
  const [messages, setMessages] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUserQueryChange = (e) => {
    setUserQuery(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert('Please select a file!');
      return;
    }


    const formData = new FormData();
    formData.append('file', file);

    try {

      const response = await fetch('http://localhost:5000/convert', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Conversion failed');
      }


      setMessages((prevMessages) => [
        ...prevMessages,
        { user: 'User', text: `File uploaded: ${file.name}` },
        { user: 'Bot', text: 'Excel file ready for download!' },
      ]);


      setFile(null);
    } catch (error) {
      console.error('Conversion error:', error);
      alert('Conversion failed. Please try again.');
    }

    if (userQuery.trim() !== '') {

      const botResponse = await fetchBotResponse(userQuery);


      setMessages((prevMessages) => [
        ...prevMessages,
        { user: 'User', text: userQuery },
        { user: 'Bot', text: botResponse },
      ]);


      setUserQuery('');
    }
  };


  const fetchBotResponse = async (query) => {

    return `Bot response to: ${query}`;
  };

  return (
    <div className="App">
      <h1>KPMG </h1>
      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div key={index} className={message.user === 'User' ? 'user-message' : 'bot-message'}>
              <strong>{message.user}:</strong> {message.text}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            name="file"
            id="file"
            accept=".pdf"
            onChange={handleFileChange}
            required
            disabled={file !== null}
          />
          <input
            type="text"
            name="userQuery"
            placeholder="Type your question..."
            value={userQuery}
            onChange={handleUserQueryChange}
          />
          <button type="submit" disabled={file === null && userQuery.trim() === ''}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
