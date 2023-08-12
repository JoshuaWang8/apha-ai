import React from 'react';
import './SearchResultOutput.css'

export const SearchResultOutput = ({ searchTerm, results, isVisible }) =>
{
    return (
        <div className={`search-result-blob ${isVisible ? 'visible' : ''}`}>
            {isVisible &&
                <div>
                    <p>Search results for: {searchTerm}</p>
                    <ul>
                        {results.map((result, index) => (
                            <li key={index}>{result}</li>
                        ))}
                    </ul>
                </div>
            }
        </div>
    )
}