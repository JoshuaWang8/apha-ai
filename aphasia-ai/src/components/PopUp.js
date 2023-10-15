import React from "react";
import "../App.css";

function Popup({ data, position }) {
    if (!data) {
        // If data is not available yet, return null or a loading indicator
        return null;
    }

    if (position.x > 880) {
        position.x = 880;
    }

    // Calculate the position for the popup based on the click coordinates
    const popupStyle = {
        position: "absolute",
        top: `${position.y}px`,
        left: `${position.x}px`,
        background: 'white',
    };

    return (
        <div className="popup" style={popupStyle}>
            <p style={{ fontWeight: "bold" }}>{data.word}</p>
            {data.meanings && data.meanings[0] && data.meanings[0].definitions && (
                <>
                    <span>Definition: </span>
                    <span>{data.meanings[0].definitions[0].definition}</span>
                </>
            )}
        </div>
    );
}

export default Popup;