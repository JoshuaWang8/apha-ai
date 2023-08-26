import React from 'react';
import './FileUploadOutput.css'

export const FileUploadOutput = ({ filename, results, isVisible }) =>
{
    return (
        <div className={`file-output-blob ${isVisible ? 'visible' : ''}`}>
            {isVisible &&
                <div>
                    <p>File results for: {filename}</p>
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