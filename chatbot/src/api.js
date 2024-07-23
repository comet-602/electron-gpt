export const sendMessage = async (message) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
  
      const data = await response.json();
      return data.message;
    } catch (error) {
      console.error('Error:', error);
      return 'Error: Unable to communicate with the server.';
    }
  };