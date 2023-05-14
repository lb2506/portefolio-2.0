import React, { useCallback } from 'react';
import './CornerTexts.css';
import { useNavigate, useLocation } from 'react-router-dom';

const CornerTexts = ({ onCategoryClick, isCategoryShow }) => {

    const navigate = useNavigate();
    const location = useLocation();

    const isHome = location.pathname === "/";

    const handleCanvasClick = useCallback(() => {
        if (isCategoryShow) {
            onCategoryClick();
        } else {
            navigate("/");
        }
    }, [isCategoryShow, onCategoryClick, navigate]);

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
                        <button className={!isCategoryShow && isHome ? 'bold' : ''}>PROJETS</button>
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
                            CATEGORIES
                        </button>
                    </li>
                </ul>
            </nav>
            <div className="bottom-right-links">
                <span><a href='mailto:baccialone.leo@gmail.com'>EMAIL</a></span>
                <span><a href='https://www.linkedin.com/in/l%C3%A9o-baccialone-453351131/' target='_blank' rel='noreferrer' >LINKEDIN</a></span>
            </div>
        </div>
    );
};

export default React.memo(CornerTexts);
