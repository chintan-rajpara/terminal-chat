// server.js
const net = require('net');

const clients = [];

const server = net.createServer((socket) => {
    socket.write('Enter your name:\n');

    let username = '';

    socket.once('data', (data) => {
        username = data.toString().trim();
        socket.username = username;
        clients.push(socket);

        // 👉 Send connected user list to the new user
        const userList = clients
            .filter(client => client !== socket)
            .map(client => `- ${client.username}`)
            .join('\n');

        if (userList) {
            socket.write(`🧑‍🤝‍🧑 Users currently in chat:\n${userList}\n`);
        } else {
            socket.write('🧍 You are the only one here for now.\n');
        }

        // 👉 Notify everyone about the new user
        for (let client of clients) {
            if (client !== socket) {
                client.write(`📢 ${username} has joined the chat.\n`);
            } else {
                client.write(`✅ Welcome, ${username}! Start chatting...\n`);
            }
        }

        // 👉 On data (chat messages)
        socket.on('data', (msg) => {
            for (let client of clients) {
                if (client !== socket) {
                    client.write(`${username}: ${msg}`);
                }
            }
        });

        // 👉 On disconnect
        const handleDisconnect = () => {
            if (clients.includes(socket)) {
                clients.splice(clients.indexOf(socket), 1);
                for (let client of clients) {
                    client.write(`👋 ${username} has left the chat.\n`);
                }
            }
        };

        socket.on('end', handleDisconnect);
        socket.on('close', handleDisconnect);
        socket.on('error', (err) => {
            console.error('Socket error:', err.message);
            handleDisconnect();
        });
    });
});

const PORT = 5000;
server.listen(PORT, () => {
    console.log(`💬 Chat server running on port ${PORT}`);
});
