import React from "react";
import {useState} from 'react'
import Repositories from "./Repositories";
import Pagination from './Pagination';
import axios from 'axios'

function App() {
  const [username, setUsername] = useState('');
  const [repositories, setRepositories] = useState([]);

  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);

  const searchRepositories = async () => {
    // or const queryString = `q=${query}&sort=${sort}&order=${order}`;
    if(username) {
      setLoading(true)
      const response = await axios.get('http://localhost:4000/api/searchusers', {
        params: {
          q: username
        }
      });
      const items = response.data.items
      const repositoriesWithData = await Promise.all(items.map(async (item) => {
        try {
          const cachedData = localStorage.getItem(item.login);
          if (cachedData) {
            return JSON.parse(cachedData);
          }

          const repoCountResponse = await axios.get(item.repos_url, {
            headers: {
              Authorization : `token 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`
            }
          });
          if (repoCountResponse.status === 200) {
            const repoCount = repoCountResponse.data.length;
            const forksCount = repoCountResponse.data.filter(repo => repo.fork).length;
            const data = { ...item, repo_count: repoCount , fork_count: forksCount};
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
  const startIndex = lastIndex - postsPerPage;
  const currentPosts = repositories.slice(startIndex, lastIndex);

  const paginate = (number) => setCurrentPage(number);

  return (
    <div className="w-full bg-neutral-900 h-screen">
      <h1 className="text-4xl text-center m-auto font-bold text-neutral-200 select-none pt-20">Learn about your own repositories.</h1>
      <div className="search-container flex justify-center w-full">
        <input type = "text" value = {username} className="w-1/3 border-2 rounded-xl block mt-5 bg-neutral-900 border-neutral-800 p-2 text-neutral-300" placeholder="Search..." onChange={(e) => setUsername(e.target.value)}></input>
        <button onClick={searchRepositories}className="Search mt-5 px-8 ml-2 block rounded-xl bg-neutral-800 text-neutral-200 hover:bg-neutral-700 transition-all">{loading ? "Loading..." : "Search"}</button>
      </div>
      <Repositories repositories={currentPosts}/>
      <h2 className="results-found w-full text-center mt-3 text-neutral-500">{repositories.length} repositories found.</h2>
      <Pagination postsPerPage={postsPerPage} totalPosts={repositories.length} paginate={paginate} currentPage={currentPage}/>
    </div>
  );
}

export default App;
