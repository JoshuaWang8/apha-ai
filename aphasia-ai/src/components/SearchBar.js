import React, { useState } from 'react';
import './SearchBar.css'


export const SearchBar = ({ onSearch, onSearchComplete }) =>
{
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = () =>
    {
        // only get a search response from the model if it is a valid search (ie. not empty)
        if (searchTerm.trim() !== '')
        {
            onSearch(searchTerm);

            // handle search result here (ie. wire it up to tf model to get the prediction output) for now just using dummy mock data
            const mockSearchResults = ['Result 1', 'Result 2', 'Result 3'];
            onSearchComplete(mockSearchResults);
        }
        else
        {
            onSearchComplete([]);
        }
    }

    const handleInputChange = (event) =>
    {
        setSearchTerm(event.target.value);
    }

    const handleKeyPress = (event) =>
    {
        if (event.key === 'Enter')
        {
            handleSearch();
        }
    }

    return (
        <div className='search-bar-container'>
            <input
                className='search-input'
                type='text'
                placeholder='search'
                value={searchTerm}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
            />
            <button className='search-button' onClick={handleSearch}> Search </button>
        </div>
    )
}

