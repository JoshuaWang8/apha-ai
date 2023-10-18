# apha.ai: Reading Support for Aphasia Patients

## Project Team
- Chiao-Hsi Joshua Wang
- Shubh Gupta
- Virat Chaudhary
- Pranav
- Siwei Wang
- Haozhe Ding

## Contents
1. [Project Overview](#project-overview)
    - [Key Features](#key-features)
    - [How it Works](#how-it-works)
2. [Project Dependencies](#project-dependencies)
    - [Libraries](#libraries)
    - [APIs](#apis)
3. [Repository Overview](#repository-overview)
4. [Running the Application](#running-the-application)
5. [References](#references)

## Project Overview
apha.ai is a web application built in React.js, designed to assist individuals with aphasia in comprehending and interacting with text content. Aphasia is a language disorder which can make it challenging for patients to understand, express and organize their thoughts in words. This application harnesses the power of artificial intelligence to provide a supportive and accessible tool to help patients interact with text more easily.

### Key Features
1. Aphasia-centred design: The application has been designed with ease-of-use for aphasia patients in mind, following usability guidelines backed by research.
2. Text Summarization: Inputted texts are summarized using a customized large language model to enhance the readability and simplify text for users.
3. Text-to-Speech Conversion: apha.ai includes a text-to-speech feature that enables users to listen to text, assisting users with comprehension.
4. Keyword Highlighting: The app employs text highlighting to visually show keywords to users, helping to convey the most important aspects of the text.
5. Built-in Dictionary: To ensure users, regardless of comprehension ability, can easily understand text, a dictionary feature has been included, allowing users to define words they may not understand.

### How it Works
apha.ai leverages natural language processing models and algorithms to perform the following key tasks:
- Text Parsing and Summarization: The application processes the text content, and passes sections of it one at a time to a fine-tuned Bidirectional Auto-Regressing Transformer (BART) model to summarize inputted text.
- Keyword Highlighting: A frequency-based algorithm is used for predicting potential keywords in the summarized texts.
- Text-to-Speech, Speech-to-Text and Dictionary Features: Open-sourced libraries detailed below were used for implementing these features.

The pipeline used by apha.ai to process text is secure and does not save user data at any point in the process. The machine learning model implemented is used only for inference and is not trained on any inputted user data.

## Project Dependencies and Requirements
### Libraries
apha.ai makes use of multiple open-source libraries:
- PDF.js
- PizZip
- Docxtemplater
- Axios
- React Icons
- React Speech Recognition

### APIs
The following APIs are also used by apha.ai to provide certain functionality:
- HuggingFace API
- SpeechSynthesisUtterance API
- Dictionary API

### Browser Support
For the voice-to-text feature to work, a compatible browser which supports Web Speech API is required. According to the React Speech Recognition Library [[Reference 6]](#references), the following browsers are supported as of May 2021:
- Chrome (desktop)
- Safari 14.1
- Microsoft Edge
- Chrome (Android)
- Android webview
- Samsung Internet

It is recommended that users use one of the above browsers. The voice-to-text feature cannot be used on any other browsers, though all other features will remain functional.

## Repository Overview
```
aphasia-ai-reading/
    README.md
    aphasia-ai/
        public/
        src/
            assets/
            components/
```
The above shows the structure of this repository. The `aphasia-ai/` directory contains the major project files for this React application, with the App file and its components all under the `src/` directory.

## Running the Application
To run this app locally, first download or clone the repository. Next, navigate to the directory where you have saved the project, and install all the required libraries listed under the [Libraries](#libraries) section by running `npm install` in the command line. Finally, navigate into the `aphasia-ai-reading/aphasia-ai/` directory and run `npm start` to run the application in development mode and open [http://localhost:3000](http://localhost:3000) to view the application locally.

**Note**: The README under `/aphasia-ai/README.md` contains the original README generated from creating the React project, which provides more usage details for the web application.

**Note**: The app needs around 2 minutes to load before any summarizations can be made, due to an API bottleneck.

## References
[1] PDF.js Library, from https://www.npmjs.com/package/pdfjs

[2] PizZip Library, from https://www.npmjs.com/package/pizzip

[3] Docxtemplater Library, from https://www.npmjs.com/package/docxtemplater

[4] Axios Library, from https://www.npmjs.com/package/axios

[5] React Icons Library, from https://www.npmjs.com/package/react-icons

[6] React Speech Recognition Library, from https://www.npmjs.com/package/react-speech-recognition

[7] HuggingFace AutoTrain, from https://huggingface.co/autotrain

[8] SpeechSynthesis API, from https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis

[9] Dictionary API, from https://dictionaryapi.dev/
