import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";

import './Aboutme.css';

const AboutMe = ({ showAboutMe, fadeOutAnimation, isFadingOut, closeAboutMe }) => {
    
    const [centerImage, setCenterImage] = useState(true);
    const [animationFinished, setAnimationFinished] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [closing, setClosing] = useState(false);

    const checkIsMobile = useCallback(() => {
        if (window.innerWidth <= 1024) {
            setIsMobile(true);
        } else {
            setIsMobile(false);
        }
    }, []);

    useEffect(() => {
        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);

        return () => {
            window.removeEventListener('resize', checkIsMobile);
        };
    }, [checkIsMobile]);

    useEffect(() => {
        let timer = null;
        let animationTimer = null;

        if (showAboutMe) {
            timer = setTimeout(() => {
                setCenterImage(false);
            }, 500);

            animationTimer = setTimeout(() => {
                setAnimationFinished(true);
            }, 1000);
        }

        return () => {
            clearTimeout(timer);
            clearTimeout(animationTimer);
        };
    }, [showAboutMe]);


    const handleClick = useCallback(() => {
        setClosing(true);
        setAnimationFinished(false);

        const timer = setTimeout(() => {
            setCenterImage(true);
        }, 500);

        const closeDelay = setTimeout(() => {
            fadeOutAnimation();
        }, 1000);

        const closeDetails = setTimeout(() => {
            setClosing(false);
            closeAboutMe();
        }, 1500);

        return () => {
            clearTimeout(timer);
            clearTimeout(closeDelay);
            clearTimeout(closeDetails);

        };
    }, [fadeOutAnimation, closeAboutMe]);

    const cssVars = useMemo(() => {

        return {
            '--color1': "white",
            '--color2': "#001f4d",
            '--innerHeight': `${window.innerHeight}px`,
        };
    }, []);

    return (
        <div
            style={{ ...cssVars }}
            className={`aboutme-container ${isFadingOut ? "fadeOut" : "fadeIn"}`}>

            <div
                className="close-button"
                style={{ display: animationFinished ? "block" : "none" }}
                onClick={handleClick}
            />
            <div className={`aboutme-details ${isMobile && !centerImage ? "move-to-top" : "move-to-bottom"}`}>
                <img
                    src="https://res.cloudinary.com/dslilw3b5/image/upload/v1684252953/Portefolio%20Perso/avatar_kvnam9.jpg"
                    alt='aboutme'
                    className={`aboutme-image ${centerImage && !isMobile ? 'center' : 'left'}`}
                />
                <div
                    className="aboutme-text"
                    style={!isMobile ? { display: animationFinished ? 'block' : 'none' } : null}
                >
                    <div className={`aboutme-text-content ${animationFinished ? 'fadeIn' : closing ? "fadeOut" : ""}`}>
                        <h1 className="title">Léo Baccialone</h1>
                        <div>
                            <ul>
                                <li>
                                    <span>POSTE</span>
                                    <span>Web Développeur</span>
                                </li>
                                <li>
                                    <span>LANGAGES & FRAMEWORKS</span>
                                    <span>Javascript • React • Node.js • Webflow • HTML • CSS • SASS</span>
                                </li>
                                <li>
                                    <span>EMAIL</span>
                                    <span><a href='mailto:baccialone.leo@gmail.com'><FontAwesomeIcon icon={faEnvelope} size='lg' /></a></span>
                                </li>
                                <li>
                                    <span>LINKEDIN</span>
                                    <span><a href='https://www.linkedin.com/in/l%C3%A9o-baccialone-453351131/' target='_blank' rel='noreferrer'><FontAwesomeIcon icon={faLinkedin} size='xl' /></a></span>
                                </li>
                                <li>
                                    <span>TÉLÉPHONE</span>
                                    <span><a href='tel:+33641962452'><FontAwesomeIcon icon={faPhone} size='lg' /></a></span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default React.memo(AboutMe);
