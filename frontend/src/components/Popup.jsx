import React, { useState, useEffect } from 'react';
import './Popup-style.css';

const Popup = ({ isOpen, onClose, onSubmit }) => {
    const [label, setLabel] = useState('');

    useEffect(() => {
        if (isOpen) {
            setLabel('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = () => {
        onSubmit(label);
        onClose();
    };

    return (
        <div className="popup-overlay">
            <div className="popup">
                <h2>Label:</h2>
                <input
                    type="text"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    className="popup-input"
                />
                <button onClick={handleSubmit} className="text-white text-lg font-bold bg-sky-700 hover:bg-sky-800 rounded-lg text-sm px-5 py-2.5" > Submit</button>
            </div>
        </div>
    );
};

export default Popup;
