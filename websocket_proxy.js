const WebSocket = require('ws');
const http = require('http');

// Create a WebSocket server on port 3001
const server = http.createServer();
const wss = new WebSocket.Server({ server });

// Port where Claude Flow's WebSocket server is running
const targetPort = 3000;
const targetUrl = `ws://localhost:${targetPort}/ws`;

console.log(`WebSocket proxy starting...`);
console.log(`Forwarding connections from port 3001 to ${targetUrl}`);

wss.on('connection', function connection(clientWs) {
  console.log('Client connected to proxy');
  
  // Connect to the target WebSocket server
  const targetWs = new WebSocket(targetUrl);
  
  targetWs.on('open', function open() {
    console.log('Connected to target WebSocket server');
    
    // Forward messages from client to target
    clientWs.on('message', function incoming(message) {
      console.log(`Client -> Target: ${message}`);
      targetWs.send(message);
    });
    
    // Forward messages from target to client, with modifications if needed
    targetWs.on('message', function incoming(message) {
      let data = message.toString();
      console.log(`Target -> Client (original): ${data}`);
      
      // Try to parse as JSON
      try {
        const jsonData = JSON.parse(data);
        
        // Check if this is a tool result message
        if (jsonData.type === 'tool_result') {
          // Ensure the detailed field exists
          if (!jsonData.detailed) {
            console.log('Adding missing detailed field');
            jsonData.detailed = {
              name: jsonData.id || 'unknown',
              result: {
                status: 'success',
                value: jsonData.content || {}
              }
            };
          }
          data = JSON.stringify(jsonData);
        }
      } catch (e) {
        // Not JSON or other error, just pass through
        console.log('Not JSON or error parsing:', e.message);
      }
      
      console.log(`Target -> Client (modified): ${data}`);
      clientWs.send(data);
    });
  });
  
  targetWs.on('error', function error(err) {
    console.error('Error connecting to target:', err);
    clientWs.close();
  });
  
  // Handle client disconnection
  clientWs.on('close', function close() {
    console.log('Client disconnected');
    targetWs.close();
  });
  
  // Handle target disconnection
  targetWs.on('close', function close() {
    console.log('Target disconnected');
    clientWs.close();
  });
});

server.listen(3001, function listening() {
  console.log('WebSocket proxy listening on port 3001');
  console.log('To use this proxy with Claude Flow, run:');
  console.log('npx claude-flow@2.0.0-alpha.66 start --ui --ws-url ws://localhost:3001');
});
