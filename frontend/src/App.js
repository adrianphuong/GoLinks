import React from "react";
import {useState} from 'react'
import Repositories from "./Repositories";
import Pagination from './Pagination';
import axios from 'axios'

function App() {
  const [username, setUsername] = useState('');
  const [repositories, setRepositories] = useState([]);
  const[descending, setDescending] = useState('desc')
  const [sortBy, setSortBy] = useState('followers')

  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);

  const searchRepositories = async () => {
    // or const queryString = `q=${query}&sort=${sort}&order=${order}`;
    if(username) {
      setLoading(true)

      const response = await axios.get('https://golinks-a9az.onrender.com/api/searchusers', {
        params: {
          q: `user:${username}`,
          sort: sortBy,
          order: descending
        }
      });
      const items = response.data.items
      //const items = response.data.items.filter(item => item.login.includes(username))
      const repositoriesWithData = await Promise.all(items.map(async (item) => {
        try {
          const cachedData = localStorage.getItem(item.login);
          if (cachedData) {
            return JSON.parse(cachedData);
          }
          const repoCountResponse = await axios.get('https://golinks-a9az.onrender.com/api/getuserrepos', {
            params: {
              repo_url: item.repos_url
            }
          });
          if (repoCountResponse.status === 200) {
            const repoCount = repoCountResponse.data.length;
            const forksCount = repoCountResponse.data.filter(item => item.forks_count > 0).reduce((total, item) => total + item.forks_count, 0);
            const languages = repoCountResponse.data.filter(item => item.language)
            const languageCount = {}
            for (const i of languages) {
              const l = i.language;
              languageCount[l] = (languageCount[l] || 0) + 1;
            }
            console.log(languageCount)
            const data = { ...item, repo_count: repoCount , fork_count: forksCount, languages: languageCount};
            localStorage.setItem(item.login, JSON.stringify(data));
            return data;
          }
        } catch (error) {
          console.error(`Error fetching repository count for ${item.login}:`, error);
          return { ...item, repo_count: 'N/A' };
        }
      }));
      setRepositories(repositoriesWithData);
      console.log(repositoriesWithData)
      setLoading(false)
    }
    else {
      setRepositories([]);
    }
  }

  const lastIndex = currentPage * postsPerPage;
  const startIndex = lastIndex - postsPerPage
  let currentPosts = repositories
  if(currentPosts.length > lastIndex) {
    currentPosts = repositories.slice(startIndex, lastIndex);
  }

  const paginate = (number) => setCurrentPage(number);

  return (
    <div className="w-full bg-neutral-900 h-screen overflow-y-auto">
      <h1 className="text-4xl text-center m-auto font-bold text-neutral-200 select-none pt-20">Learn about your own repositories.</h1>
      <div className="search-container flex justify-center w-full">
        <input type = "text" value = {username} className="w-1/3 border-2 rounded-xl block mt-5 bg-neutral-900 border-neutral-800 p-2 text-neutral-300" placeholder="Search..." onChange={(e) => setUsername(e.target.value)}></input>
        <button onClick={searchRepositories}className="Search mt-5 px-8 ml-2 block rounded-xl bg-neutral-800 text-neutral-200 hover:bg-neutral-700 transition-all">{loading ? "Loading..." : "Search"}</button>
      </div>
      <div className="sort-container w-1/3 bg-neutral-900 border-2 border-neutral-800 p-6 m-auto mt-4 rounded-xl flex">
        <div className="m-auto">
          <label className="text-lg text-neutral-400 mr-2">Order by:</label>
          <select onChange={(e) => setSortBy(e.target.value)} className="w-40 rounded-md p-1 bg-neutral-800 mr-5 text-neutral-400" name = "sortby" id = "sortby">
            <option value = "followers">Followers</option>
            <option value = "repositories">Repositories</option>
            <option value = "joined">Join Date</option>
          </select>
          <select onChange={(e) => setDescending(e.target.value)} className="w-40 rounded-md p-1 bg-neutral-800 text-neutral-400" name = "sort" id = "sort">
            <option value = "desc">Descending</option>
            <option value = "asc">Ascending</option>
          </select>
        </div>
      </div>
      <Repositories repositories={currentPosts}/>
      <h2 className="results-found w-full text-center mt-3 text-neutral-500">{repositories.length} repositories found.</h2>
      <Pagination postsPerPage={postsPerPage} totalPosts={repositories.length} paginate={paginate} currentPage={currentPage}/>
    </div>
  );
}

export default App;
