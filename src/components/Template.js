import { Header } from "./Header";
import './Template.css';

export const Template = ({ children }) => {
    return (
        <>
            <Header />
            <main>
                {children}
            </main>
        </>
    );
}
