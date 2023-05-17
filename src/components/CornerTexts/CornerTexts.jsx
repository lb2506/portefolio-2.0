import React from 'react';
import './CornerTexts.css';

const CornerTexts = ({ onCategoryClick, onAboutMeClick, isCategoryShow, isAboutMeShow }) => {

    return (
        <div>
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
                    <li>
                        <button
                            className={isAboutMeShow ? 'bold' : ''}
                            onClick={(e) => {
                                e.stopPropagation();
                                onAboutMeClick();
                            }}
                        >
                            ABOUT ME
                        </button>
                    </li>

                </ul>
            </nav>
        </div>
    );
};

export default React.memo(CornerTexts);
