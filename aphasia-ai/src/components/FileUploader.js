import React, { useState } from 'react';
import { useRef } from 'react';
import { getDocument } from 'pdfjs-dist/webpack';
import { MdOutlineFileUpload, MdOutlineSummarize, MdOutlineClear } from 'react-icons/md';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import './FileUploader.css';

const FileUploader = ({ onProcessingComplete }) => {
    const [filename, setFilename] = useState('');
    const [uploadedFile, setUploadedFile] = useState('');
    const [onFileProcessClicked, setOnFileProcessClicked] = useState(false);
    const [loadingSummary, setLoadingSummary] = useState(false);
    const hiddenFileInput = useRef(null);

    const handleFileUploadClick = event => {
        hiddenFileInput.current.click();
    };
    const [keywords, setKeywords] = useState([]);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const buffer = e.target.result;
                const arr = new Uint8Array(buffer);
                const fileNameSplit = file.name.split("."); // For getting file type

                // Check file type to use correct file reader
                if (fileNameSplit[fileNameSplit.length - 1] === "pdf") {
                    try {
                        const pdfFile = await getDocument(arr).promise; // Get pdf file
                        let text = '';

                        for (let i = 1; i <= pdfFile.numPages; i++) { // Read all pages
                            const page = await pdfFile.getPage(i);
                            const textContent = await page.getTextContent(); // Extract raw text from pdf file
                            const pageText = textContent.items.map((item) => item.str).join(' ');
                            text += pageText + '\n';
                        }
                        setUploadedFile(text); // Set extracted text

                    } catch (error) {
                        console.error('Error reading PDF:', error);
                    }
                } else { // If docx file
                    const zip = new PizZip(reader.result); // Zip file
                    const docFile = new Docxtemplater().loadZip(zip); // Load zipped docx file
                    const text = docFile.getFullText(); // Extract text
                    const formattedText = text.replace(/([.!?])(?!\d)/g, "$1 "); // Add spaces since reader squashes all sentences together
                    setUploadedFile(formattedText);
                }
            }
            setOnFileProcessClicked(false);
            setFilename(file.name);
            reader.readAsArrayBuffer(file);
        }
    }

    async function handleFileProcessing() {
        // Split text into sections
        const sections = splitTextIntoSections(uploadedFile);
        let fullText = '';

        setLoadingSummary(true);

        // Process each section
        for (let i = 0; i < sections.length; i++) {
            // Split the text into sentences
            const textChunks = sections[i]['content'].split(/[.!?]+\s/).filter(Boolean);
            const chunkSize = 25; // Set chunk size
            const processedChunks = [];

            for (let i = 0; i < textChunks.length; i += chunkSize) {
                const chunk = textChunks.slice(i, i + chunkSize).join(' ');
                try {
                    const response = await fetch(
                        "https://api-inference.huggingface.co/models/VCInit/autotrain-aphasia-simplification-92527144747",
                        {
                            headers: { Authorization: "Bearer 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" },
                            method: "POST",
                            body: JSON.stringify({
                                "inputs": chunk
                            }),
                        }
                    );

                    const result = await response.json();
                    processedChunks.push(result[0].summary_text);
                } catch (error) {
                    console.error('Error processing chunk:', error);
                }
            }

            // Join the processed chunks
            const processedText = processedChunks.join(' ');
            fullText += processedText.toLowerCase().replace(/[[(.,][^\]).,]*[\]).,]/g, '') + ' ';
            sections[i]['content'] = processedText;
        }

        // Find keywords and complete processing
        findKeywords(fullText);
        onProcessingComplete(filename, sections, keywords);
        setOnFileProcessClicked(true);
        setLoadingSummary(false);
    }

    function splitTextIntoSections(rawText) {
        // Define common headings found in research papers
        const sectionHeaders = ['Abstract', 'Introduction', 'Literature', 'Literature Review', 'Methodology', 'Method', 'Data', 'Results', 'Discussion', 'Conclusion', 'Recommendations', 'Acknowledgments', 'Author Contributions', 'References', 'Appendices', 'Figures and Tables'];
        const usedSections = [];
        let usingUsedSection = false;

        // Extract sections if the input is a research paper
        if (isResearchPaper(rawText)) {
            const sections = [];
            let currentSection = '';
            let currentSectionContent = '';
            let referencesReached = false;

            // Split the raw text into lines
            const lines = rawText.split(/(?<=[.])/g);

            // Iterate through the lines
            lines.forEach(line => {
                const lineTrimmed = line.trim();

                if (!referencesReached) { // Stop parsing if already reached references
                    // Check if we have found a new section
                    const matchingSectionHeader = sectionHeaders.find(header => line.includes(header));

                    // Add same sections but with different names
                    if (
                        ((matchingSectionHeader === 'Method') || (matchingSectionHeader === 'Methodology'))
                        && !usedSections.includes(matchingSectionHeader)
                    ) {
                        usedSections.push('Method');
                        usedSections.push('Methodology');
                        usingUsedSection = true;
                    }
                    if (
                        ((matchingSectionHeader === 'Literature') || (matchingSectionHeader === 'Literature Review'))
                        && !usedSections.includes(matchingSectionHeader)
                    ) {
                        usedSections.push('Literature');
                        usedSections.push('Literature Review');
                        usingUsedSection = true;
                    }

                    // Check if the line matches a section header
                    if (
                        matchingSectionHeader
                        && !sections.some(section => section.title === matchingSectionHeader)
                        && currentSection !== matchingSectionHeader
                        && (!usedSections.includes(matchingSectionHeader) || usingUsedSection)
                    ) {
                        if (lineTrimmed.includes('References') || lineTrimmed.includes('Acknowledgements')) {
                            referencesReached = true; // Set the flag when "References" is reached
                        } else {
                            // If there's content in the current section, save it
                            if (currentSectionContent !== '') {
                                sections.push({
                                    title: currentSection,
                                    content: currentSectionContent
                                });
                            }

                            // Start a new section
                            currentSection = matchingSectionHeader;
                            currentSectionContent = lineTrimmed.replace(matchingSectionHeader, '').trim();
                            usingUsedSection = false;
                        }
                    } else {
                        // Append the line to the current section's content
                        currentSectionContent += line;
                    }
                }
            });

            // Add the last section if it has content
            if (currentSectionContent) {
                sections.push({
                    title: currentSection,
                    content: currentSectionContent
                });
            }
            return sections;
        }
        return [{ title: '', content: rawText }];
    }

    function isResearchPaper(text) {
        // Convert text to lowercase for case-insensitive matching
        const lowercaseText = text.toLowerCase();

        // Check for the presence of common section headers
        const sections = ['abstract', 'introduction', 'literature', 'literature review', 'methodology', 'method', 'data', 'results', 'discussion', 'conclusion', 'recommendations', 'acknowledgments', 'author contributions', 'references', 'appendices', 'figures and tables'];

        // Count number of found headings
        let headings = 0;
        for (const header of sections) {
            if (lowercaseText.includes(header)) {
                headings++;
            }
            if (headings >= 4) {
                break;
            }
        }

        // Check for the presence of citations and a references section
        const hasCitations = /\(\d{4}\)/.test(text);
        const hasReferences = lowercaseText.includes("references");

        // Combine all checks
        return headings >= 4 && (hasCitations || hasReferences);
    }

    function findKeywords(inputText) {
        // Tokenize the text into terms (words or phrases)
        const terms = inputText.split(/\s+/);

        // Calculate Term Frequency (TF) for each term
        const termFrequency = {};
        terms.forEach(term => {
            termFrequency[term] = (termFrequency[term] || 0) + 1;
        });

        // Calculate Inverse Document Frequency (IDF)
        const inverseDocumentFrequency = {};
        terms.forEach(term => {
            inverseDocumentFrequency[term] = Math.log(terms.length / (terms.filter(element => element === term).length + 1));
        });

        // Calculate TF-IDF score for each term
        const keywords = Object.keys(termFrequency).map(term => ({
            term,
            tfidf: termFrequency[term] * inverseDocumentFrequency[term],
        }));

        // Sort keywords by TF-IDF score
        keywords.sort((a, b) => b.tfidf - a.tfidf);

        // Get keywords based on the threshold
        const stopwords = [
            "a", "an", "and", "the", "in", "of", "on", "at", "for", "to", "with", "by", "as", "but", "or", "not", "is", "it", "he",
            "she", "you", "I", "we", "they", "this", "that", "these", "those", "my", "your", "his", "her", "its", "our", "their",
            "all", "any", "some", "many", "few", "more", "most", "much", "no", "none", "nor", "every", "each", "either", "neither",
            "both", "such", "what", "which", "who", "whom", "whose", "why", "how", "where", "when", "wherever", "whenever",
            "whether", "while", "before", "after", "during", "since", "until", "because", "although", "if", "unless", "since",
            "while", "so", "be", "can", "us", "also", "through", "was", "had", "were", "about", "here", "are", "has"
        ];

        let keywordCount = 0;
        let i = 0;
        const keywordsToHighlight = [];
        // Only take keywords which are not a stopword
        while (keywordCount < (keywords.length) * 10 / 100) {
            if (!stopwords.includes(keywords[i]['term'])) {
                keywordsToHighlight.push(keywords[i]['term']);
                keywordCount++;
            }
            i++;
        }
        setKeywords(keywordsToHighlight);
    }

    function handleFileClear() {
        setFilename('');
        setUploadedFile('')
        setKeywords([])
        onProcessingComplete('', [], []);
    }

    return (
        <div className='uploader-and-processer'>
            <div className='file-upload'>
                <button className="button-upload" onClick={handleFileUploadClick}>
                    Upload File <MdOutlineFileUpload />
                </button>
                <input
                    type="file"
                    accept=".pdf, .docx"
                    onChange={handleFileUpload}
                    ref={hiddenFileInput}
                    style={{ display: 'none' }} // Make the file input element invisible
                />
                <label className='upload-file-name'>
                    {filename}
                </label>
            </div>

            {uploadedFile.length > 0 &&
                (<div className='file-process'>
                    <button className="button-process" onClick={handleFileClear}> Clear File <MdOutlineClear /> </button>
                    <button className="button-process" onClick={handleFileProcessing}> {onFileProcessClicked ? 'Highlight Keywords' : 'Process File'} <MdOutlineSummarize /> </button>
                    {loadingSummary && <span> loading... </span>}
                </div>)}
        </div>
    );
};

export default FileUploader;