import React, { useState } from 'react';
import './FileUploader.css';

const FileUploader = ({ onFileUpload }) =>
{
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) =>
    {
        const file = event.target.files[0];
        setSelectedFile(file);
        onFileUpload(file);
    };

    return (
        <div className='file-uploader-container'>
            <label htmlFor='file-input' className='file-input-label'>
                <div> Click to Upload </div>
                <input type="file" accept=".pdf, .jpg, .jpeg, .png, .docx" onChange={handleFileChange} />
            </label>
        </div>
    );
};

export default FileUploader;