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
        <div className='absolute left-0 right-0 w-[700px] ml-auto mr-auto z-50 bg-black/70 rounded-xl p-3 h-96'>
            <h1 className='text-white text-xl font-bold inline-block'>Statistics - {currentUser.login}</h1>
            <button onClick={() => setIsOpen(false)} className='absolute right-0 text-white w-10 h-10 mr-2 hover:scale-125 transition-all text-lg bg-neutral-800 rounded-xl'>X</button>
            <div className='information-container'>
                <h1 className='text-xl text-white'>{currentUser.repo_count} repositories found</h1>
                <h1 className='text-xl text-white'>{currentUser.fork_count} total forks</h1>
                <h1 className='text-xl text-white'>Language Counts:</h1>
                <ul className='h-40 w-80 mt-4 mb-2 bg-neutral-900 rounded-lg overflow-y-auto overflow-x-auto'>
                {Object.keys(currentUser.languages).sort(function(a,b){return currentUser.languages[a]-currentUser.languages[b]}).reverse().map(language => (
                    <h1 className='text-white' key={language}>{language}: {currentUser.languages[language]}</h1>
                ))}
                </ul>
                <a className='px-4 py-2 mt-5 w-1/3 block bg-neutral-700 text-neutral-300 hover:text-neutral-200 hover:bg-neutral-600 transition-all rounded-xl' href = {currentUser.html_url} target="_blank" rel = 'noreferrer noopener'>Open on github</a>
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