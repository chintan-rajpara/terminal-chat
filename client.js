// client.js
const net = require('net');
const readline = require('readline');

const client = new net.Socket();
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

client.connect(5000, 'localhost', () => {
    console.log('Connected to server');
});

client.on('data', (data) => {
    const message = data.toString().trim();

    // Clear current input line and print the new message
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    console.log(message);

    // Reprint the prompt after the message
    rl.prompt(true);
});

rl.on('line', (input) => {
    client.write(input + '\n');
    rl.prompt(); // Prompt again for the next message
});

client.on('close', () => {
    console.log('\nDisconnected from chat');
    process.exit(0);
});

client.on('error', (err) => {
    console.error('Connection error:', err.message);
});
