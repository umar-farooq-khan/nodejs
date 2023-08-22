const http = require('http');
const PORT = 3000;
const cors = require("cors");
app.use(cors());
const server = http.createServer((req, res) => {
    // Manually setting the CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Allowed methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allowed headers

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World!');
});



server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});

/*
app.use(cors());

const http = require('http');
const PORT = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hellokoko World!');
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
*/
