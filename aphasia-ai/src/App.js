import './App.css';
import { SearchBar } from './components/SearchBar';

function App()
{
    const handleSearch = (searchTerm) =>
    {
        // Perform the search logic here... ie. api call to tf to get output etc
        console.log(`Searching for: ${searchTerm}`);
    }

    return (
        <div className="App">
            <header className="App-header">
                <SearchBar onSearch={handleSearch} />
            </header>
        </div>
    );
}

export default App;
