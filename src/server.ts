require('dotenv').config(); // Load environment variables from .env
const app = require('./app');
const http = require('http');
const connetDataBase = require('./config/db');
const server = http.createServer(app);

// Start server on the specified port
const PORT = process.env.PORT || 5000;

// Connect Mongodb
connetDataBase().then((res: any) => {
    console.log('res', res)

    // Create HTTP server
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch((err: any) => {
    console.log('err', err)
    process.exit(1)
});



export { };