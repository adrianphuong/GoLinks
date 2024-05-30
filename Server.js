const axios = require('axios');
const express = require('express');
const cors = require('cors');

const apiUrl = "https://api.github.com/search/users"; // change upon different searches
// /search/code
// 
const headers = { // universal throughout?
    "Accept": "application/vnd.github.v3+json"
  };



const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.get('/api/searchusers', async (req,res) => {
    const query = req.query.q
    const stars = req.query.stars || 'stars'
    const order = req.query.order || 'desc'
    try {
        const response = await axios.get(apiUrl, {headers, 
            params: {
                q: query, // query
                sort: stars, // QUALIFIER 1
                order: order // QUALIFIER 2
            }
        });
        res.json(response.data)
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching data from GitHub API.' });
    }
});

app.listen(PORT, () => {
    console.log("Server is running on " + PORT + "!");
});