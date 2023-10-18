import React from 'react';
import { MdOutlineSummarize } from 'react-icons/md';
import { LiaFileUploadSolid } from 'react-icons/lia';
import { LuUpload, LuFileCog2, LuFileText, LuArrowRight } from 'react-icons/lu';
import { Template } from './Template';
import Instruction from '../assets/Instructions-img.png';

import './Instructions.css'

export const Instructions = () => {
    return (
        <Template>
            <div className='instruction-page'>
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
                    <LuArrowRight color='white' />
                    <div className="summarise-instruction">
                        <h2>
                            We Summarise the file
                        </h2>
                        <LuFileCog2 size={200} color='navy' />

                    </div>
                    <LuArrowRight color='white' />
                    <div className="output-instruction">
                        <h2>
                            View Output
                        </h2>
                        <LuFileText size={200} color='navy' />
                    </div>
                </div>
                <div className='features-section-heading'>
                    <h1> Features </h1>
                </div>
                <div className='features-content'>
                    <ul className='features-list'>
                        <l1 className='feature-name'> <span className='feature-title'> Dictionary Definition: </span> select a word and right click to view defintion </l1>
                        <l1 className='feature-name'> <span className='feature-title'> Keyword Highlighting: </span> press highlight keywords to view important words in summary </l1>
                        <l1 className='feature-name'> <span className='feature-title'> Voice Assistance: </span>  press voice assistance button to start listening to speech for summarisation </l1>
                        <l1 className='feature-name'> <span className='feature-title'> Text-to-Voice: </span> press read results to listen to the output summary </l1>
                    </ul>

                    <div className='feature-img'>
                        <img src={Instruction} width='900px' style={{ padding: '10px' }} />
                    </div>
                </div>
                <div className='get-started'>
                    <a className='link-button' href='/'> Get Started </a>
                </div>
            </div>
        </Template>
    )
}