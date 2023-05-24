import React, { useState } from 'react';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [repositories, setRepositories] = useState([]);
  const [sortBy, setSortBy] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    sortRepositories();
  };

  const handleSearch = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `https://api.github.com/users/${searchTerm}/repos?per_page=100`
      );
      const data = await response.json();

      if (response.ok) {
        setRepositories(data);
      } else {
        setRepositories([]);
        console.error('Error:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const sortRepositories = () => {
    const sortedRepositories = [...repositories];

    if (sortBy === 'stars') {
      console.log('Sort by star');
      sortedRepositories.sort(
        (a, b) => b.stargazers_count - a.stargazers_count
      );
    } else if (sortBy === 'forks') {
      console.log('sort by forks');
      sortedRepositories.sort((a, b) => b.forks_count - a.forks_count);
    }

    setRepositories(sortedRepositories);
  };

  return (
    <div className="container mx-auto">
      <form onSubmit={handleSearch} className="form">
        <input
          className="form-control"
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Enter GitHub username"
          required
        />
        <button className="btn m-1 btn-primary" type="submit">
          Search
        </button>
      </form>

      <div className="m-1">
        <label>
          Sort by:
          <select
            className="form-select m-1"
            value={sortBy}
            onChange={handleSortChange}
          >
            <option value="none" selected>None</option>
            <option value="stars">Stars</option>
            <option value="forks">Forks</option>
          </select>
        </label>
      </div>
      <div className="row container">
        {repositories.map((repo) => (
          <div
            key={repo.id}
            className="card m-1 col-md-4 col-lg-5 col-sm-3"
            style={{ width: '18rem' }}
          >
            <div className="card-body">
              <h5 className="card-title">{repo.name}</h5>
              <p className="card-text">
                <p>Stars: {repo.stargazers_count}</p>
                <p>Forks: {repo.forks_count}</p>
              </p>
              <a href={repo.html_url} class="card-link">
                Repo Link
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
