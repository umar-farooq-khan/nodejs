const express = require('express');
const cors = require('cors');
const PORT = 3000;

const app = express();
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});