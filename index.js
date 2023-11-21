const express = require('express');
const { createServer } = require('http');
const { Server } = require('ws');
const path = require('path');
const cors = require('cors');
const app = express();

// Enable CORS for all routes
app.use(cors());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// The 'catchall' handler: for any request that doesn't match one above, 
// send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

const PORT = process.env.PORT || 8080;
const server = createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const wss = new Server({ server });

wss.on('connection', ws => {
  console.log('New WebSocket connection');

  ws.on('message', message => {
    console.log('Received message:', message);

    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === ws.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('error', error => {
    console.error('WebSocket error:', error);
  });
});
