import './Header.css';

export const Header = () => {
    return (
        <header class="page-header">
            <div class="header">
                <h2>
                    <a href="/" class="header-icon-link"> Home </a>
                </h2>
                <h2>
                    <a href="/usage" class="header-icon-link">How to use</a>
                </h2>
                <h2>
                    <a href="/disclaimer" class="header-icon-link">Disclaimer</a>
                </h2>
            </div>
        </header>
    );
}