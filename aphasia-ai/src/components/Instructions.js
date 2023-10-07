import React from 'react';
import { MdOutlineSummarize } from 'react-icons/md';
import { LiaFileUploadSolid } from 'react-icons/lia';
import { LuUpload, LuFileCog2, LuFileText, LuArrowRight } from 'react-icons/lu';

import './Instructions.css'

export const Instructions = () => {
    return (
        <>
            <div className='instruction-section-heading'>
                <h1> How it Works? </h1>
            </div>
            <div className="instructions-container">
                <div className="upload-instruction">
                    <h2>
                        Upload a file
                    </h2>
                    <LuUpload size={200} color='navy' />
                </div>
                <LuArrowRight />
                <div className="summarise-instruction">
                    <h2>
                        We Summarise the file
                    </h2>
                    <LuFileCog2 size={200} color='navy' />

                </div>
                <LuArrowRight />
                <div className="output-instruction">
                    <h2>
                        View Output
                    </h2>
                    <LuFileText size={200} color='navy' />
                </div>
            </div>
        </>
    )
}