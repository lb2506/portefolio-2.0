import React from 'react';
import './CornerTexts.css';

const CornerTexts = ({ onCategoryClick, isCategoryShow }) => {

    return (
        <div>
            <div className="top-left-text">
                <span>LÉO</span>
                <span>BACCIALONE</span>
            </div>
            <div className="bottom-left-text">
                <span>WEB</span>
                <span>DEVELOPER</span>
            </div>
            <nav className="top-right-menu">
                <ul>
                    <li>
                        <button
                            className={isCategoryShow ? 'bold' : ''}
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
