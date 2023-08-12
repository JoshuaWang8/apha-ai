import React, { useState } from 'react';
import './SearchBar.css'


export const SearchBar = ({ onSearch }) =>
{
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = () =>
    {
        onSearch(searchTerm);
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

