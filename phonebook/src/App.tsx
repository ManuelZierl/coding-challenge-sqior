import React, { useState } from 'react';
import './App.css';
import { PhonebookReferenceImplementation, PhonebookEntry, FusePhonebook } from './Phonebook';
import { PhonebookSamples } from './PhonebookSamples';

// const phonebook = new PhonebookReferenceImplementation(PhonebookSamples);
const phonebook = new FusePhonebook(PhonebookSamples);


interface SearchResultsProps {
  results: PhonebookEntry[];
}

const SearchResults: React.FC<SearchResultsProps> = ({ results  }) => {
  console.log("search results constructed");
  return (
    <ul className="search-results">
      {results.map((result, index) => (
        <li key={index} className="search-result">
          <span className="name">{result.firstName} <b>{result.lastName}</b> </span>
          <span className="phone">{result.phoneNumber}</span>
        </li>
      ))}
    </ul>
  );
}


function App() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<PhonebookEntry[]>([]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    setSearchTerm(input);
    const filteredResults = phonebook.match(input);
    console.log(filteredResults);
    setSearchResults(filteredResults);
  };


  return (
    <div className="App">
      <header className="App-header">
        <div className='input-container'>
        <input
            type='text'
            autoFocus
            className="input"
            placeholder='Type to search for phonebook entries'
            value={searchTerm}
            onChange={handleInputChange}
          />
          {searchResults.length > 0 && <SearchResults results={searchResults} />}
        </div>
      </header>
    </div>
  );
}

export default App;
