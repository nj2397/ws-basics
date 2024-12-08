const express = require('express');
const app = express()
const server = require('http').createServer(app);
const { v4: uuid4 } = require('uuid');

const WebSocket = require('ws');

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    // Generate a unique ID for the connected client
    const clientId = uuid4();

    // Attach the client ID to the WebSocket connection
    ws.clientId = clientId;

    // Send the client ID back to the connected client
    ws.send(`id: ${clientId}`)
    // Get array of all connected client IDs
    const clientIds = [...wss.clients].map(client => client.clientId)

    console.log('clientIds --> ', clientIds)

    // Handle incoming messages from clients
    ws.on('message', ( message ) => {
        // Parse the incoming message data
        const parsedData = JSON.parse(message);
        const { targetClientId, message: clientMessage } = parsedData;

        console.log('targetClientId: clientMessage --> ', targetClientId, clientMessage)

        // Find the target client to send message to
        const targetClient = [...wss.clients].find(client => client.clientId === targetClientId)

        // Send message if target client exists and connection is open
        if (targetClient && targetClient.readyState === WebSocket.OPEN) 
            targetClient.send(`msg:${clientMessage}`)
            
    })

    // Handle client disconnection
    ws.on('close', ( close ) => {
        console.log(`Client ${clientId} disconnected`)
    })

})


server.listen(3000, () => console.log("Listening on port:3000"))

//  ------------------------------------------------------------------------------------- //