import React, { useCallback } from 'react';
import './CornerTexts.css';
import { useNavigate, useLocation } from 'react-router-dom';

const CornerTexts = ({ onCategoryClick, isCategoryShow }) => {

    const navigate = useNavigate();
    const location = useLocation();

    const isHome = location.pathname === "/";
    const isContact = location.pathname === "/contact";

    const handleCanvasClick = useCallback(() => {
        if (isCategoryShow) {
            onCategoryClick();
        } else {
            navigate("/");
        }
    }, [isCategoryShow, onCategoryClick, navigate]);

    const handleContactClick = React.useCallback(() => {
        navigate("/contact");
    }, [navigate]);

    return (
        <div>
            <div className="top-left-text">Léo B.</div>
            <div className="bottom-left-text">
                <span>WEB</span>
                <span>DEVELOPER</span>
            </div>
            <nav className="top-right-menu">
                <ul>
                    <li onClick={handleCanvasClick}>
                        <button className={!isCategoryShow && isHome ? 'bold' : ''}>CANVAS</button>
                    </li>
                    <li>
                        <button
                            className={isCategoryShow ? 'bold' : ''}
                            disabled={location.pathname === "/contact"}
                            onClick={(e) => {
                                e.stopPropagation();
                                onCategoryClick();
                            }}
                        >
                            CATEGORY
                        </button>
                    </li>
                    <li onClick={handleContactClick}>
                        <button className={isContact ? 'bold' : ''}>CONTACT</button>
                    </li>
                </ul>
            </nav>
            <div className="bottom-right-links">
                <span>EMAIL</span>
                <span>INSTAGRAM</span>
                <span>TWITTER</span>
            </div>
        </div>
    );
};

export default React.memo(CornerTexts);
