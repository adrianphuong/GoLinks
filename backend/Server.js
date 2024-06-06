const axios = require('axios');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
GITHUB_TOKEN = process.env.GITHUB_TOKEN

const apiUrl = "https://api.github.com/search/users"; // change upon different searches
// /search/code
// 
const headers = { // universal throughout?
    "Accept": "application/vnd.github.v3+json",
    Authorization : `token ${process.env.GITHUB_TOKEN}`
  };



const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.get('/api/searchusers', async (req,res) => {
    const query = req.query.q
    const sort = req.query.sort || 'repositories'
    const order = req.query.order || 'asc'
    try {
        const response = await axios.get(apiUrl, {headers, 
            params: {
                q: query,
                sort: sort,
                order: order
            }
        });
        console.log(response.data)
        res.json(response.data)
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching data from GitHub API.' });
    }
});

app.get('/api/getuserrepos', async (req,res) => {
    const url = req.query.repo_url
    try {
        const response = await axios.get(url, {headers, 
            params: {
                per_page: 100
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