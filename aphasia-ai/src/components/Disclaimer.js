import React from 'react';
import "./Disclaimer.css";
import { Template } from './Template';

export const Disclaimer = () => {
    return (
        <Template>
            <div className='disclaimer-content'>
                <div className='disclaimer-section-heading'>
                    <h1> Disclaimer for Aphasia Text Summarisation </h1>
                </div>

                <div className="disclaimer-container">
                    <div className="disclaimer-instruction">
                        <h2>
                            This Application uses a language model to create text summaries for aphasia patients. Please be aware of its limitations:
                        </h2>
                        <ul>
                            <li>
                                Summaries may not always be completely accurate or reliable.
                            </li>
                            <li>
                                The summaries may have biases or be insensitive.
                            </li>
                            <li>
                                This app is intended as a complementary tool and should not replace professional advice or treatment.
                            </li>
                            <li>
                                apha.ai does not store any of the uploaded information. The machine learning model is also not trained on any of the uploaded information.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </Template>
    );
}