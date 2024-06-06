import React, {useState} from 'react'

export const Repositories = ({repositories}) => {
  const [isOpen, setIsOpen] = useState(true)
  const [currentUser ,setCurrentUser] = useState('')

  const openUserStatistics = async (user) => {
    setCurrentUser(user);
    setIsOpen(true);
  };

  return (
    <div>{isOpen && currentUser && (
        <div className='absolute left-0 right-0 top-1/4 w-[700px] ml-auto mr-auto z-50 bg-white rounded-xl p-3 h-96'>
            <h1 className='text-xl font-bold inline-block text-neutral-800'>Statistics for: <b>{currentUser.login}</b></h1>
            <button onClick={() => setIsOpen(false)} className='absolute right-0 text-white w-10 h-10 mr-2 hover:scale-105 transition-all text-lg bg-neutral-800 rounded-xl'>X</button>
            <div className='container flex justify-center'>
              <img className='mt-8 w-60 h-60 mr-20 rounded-full align-middle border-2' src = {currentUser.avatar_url}/>
              <div className='information-container text-neutral-800'>
                  <h1 className='text-xl'><b>{currentUser.repo_count}</b> repositories found</h1>
                  <h1 className='text-xl'><b>{currentUser.fork_count}</b> total forks</h1>
                  <h1 className='text-xl font-bold'>Most used languages:</h1>
                  <ul className='h-40 w-80 mt-4 mb-2 p-2 border-2 bg-neutral-100 text-neutral-600 rounded-lg overflow-y-auto overflow-x-auto'>
                  {Object.keys(currentUser.languages).sort(function(a,b){return currentUser.languages[a]-currentUser.languages[b]}).reverse().map(language => (
                      <h1 className='' key={language}><b>{language}:</b> {currentUser.languages[language]}</h1>
                  ))}
                  </ul>
                  <a className='px-4 py-2 mt-5 w-80 text-end block bg-neutral-100 text-neutral-500 hover:text-neutral-600 border-2 hover:bg-neutral-300 transition-all rounded-xl font-semibold' href = {currentUser.html_url} target="_blank" rel = 'noreferrer noopener'>Open on GitHub</a>
              </div>
            </div>
        </div>
        )}
        <ul className="w-2/3 mt-5 m-auto bg-neutral-900 border-2 border-neutral-800 text-neutral-400 select-none p-8 rounded-lg">
            {repositories.map(repo => (
            <li onClick={() => openUserStatistics(repo)} className='w-full border-2 cursor-pointer transition-all hover:text-neutral-300 mb-2 rounded-xl p-4' key={repo.id}>
                <h1 className="font-bold inline-block" target="_blank" rel = 'noopener'>
                {repo.login}
                </h1>
                <h1 className='float-right'>{repo.repo_count} Repositories</h1>
            </li>
            ))}
    </ul>
  </div>
  )
}

export default Repositories;