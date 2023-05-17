import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Stage, Layer } from "react-konva";
import "../App.css";
import "../animations.css";

import EnlargedImage from "./EnlargedImage";
import ImageGridComponent from './ImageGridComponent';
import BlackBackground from "./BlackBackground";
import { useWindowSize } from '../hooks/useWindowSize';
import { useLoadedImages } from '../hooks/useLoadedImages';
import ProjectDetails from './ProjectDetails/ProjectDetails';
import projects from '../projects.json';
import CornerTexts from "./CornerTexts/CornerTexts";
import Category from "./Category/Category";
import AboutMe from "./AboutMe/Aboutme";


const GRID_SIZE = 100;

const bigProjects = [0, 6];
const bigProjetsFerequency = 4;

const imagesColor = projects.map((project) => project.imageColor);
const imagesGray = projects.map((project) => project.imageGray);

const generateDeterministicImageIndexGrid = (size) => {
  const rowCoefficient = 9;
  const colCoefficient = 6;
  const modCoefficient = imagesColor.length;

  const grid = Array(size)
    .fill(null)
    .map((_, rowIndex) =>
      Array(size)
        .fill(null)
        .map((_, colIndex) => (rowIndex * rowCoefficient + colIndex * colCoefficient) % modCoefficient)
    );
  return grid;
};

const Home = () => {
  const [isMobile, setIsMobile] = useState(null);
  const [stagePos, setStagePos] = useState({ x: 14600, y: -19700 });
  const randomImageIndexGrid = useMemo(() => generateDeterministicImageIndexGrid(GRID_SIZE), []);
  const [hoveredImageIndices, setHoveredImageIndices] = useState({});
  const [enlargedImgData, setEnlargedImgData] = useState(null);
  const [isReturning, setIsReturning] = useState(false);
  const [showBlackBackground, setShowBlackBackground] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [hiddenImage, setHiddenImage] = useState(null);
  const { images, imagesGrayscale } = useLoadedImages(imagesColor, imagesGray);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showCategory, setShowCategory] = useState(false)
  const [showAboutMe, setShowAboutMe] = useState(false)

  const [WIDTH, setWIDTH] = useState(250);
  const [HEIGHT, setHEIGHT] = useState(250);
  const [LARGE_WIDTH, setLARGE_WIDTH] = useState(514);
  const [LARGE_HEIGHT, setLARGE_HEIGHT] = useState(514);
  const [MARGIN, setMARGIN] = useState(16);

  const checkIsMobile = useCallback(() => {
    if (window.innerWidth <= 768) {
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
    if (isMobile) {
      setWIDTH(125);
      setHEIGHT(125);
      setLARGE_WIDTH(257);
      setLARGE_HEIGHT(257);
      setMARGIN(8);
    } else {
      setWIDTH(250);
      setHEIGHT(250);
      setLARGE_WIDTH(514);
      setLARGE_HEIGHT(514);
      setMARGIN(16);
    }
  }, [isMobile]);

  useEffect(() => {
    if (isFadingOut) {
      const timer = setTimeout(() => {
        setShowBlackBackground(false);
        setIsFadingOut(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isFadingOut]);


  const isUnderLargeImage = useCallback((x, y, gridSize, bigProjetsFerequency) => {
    const checkPosition = (x, y) => {
  const indexX = Math.abs(x / (WIDTH + MARGIN)) % gridSize;
  const indexY = Math.abs(y / (HEIGHT + MARGIN)) % gridSize;

  if (randomImageIndexGrid[indexX]) {
    const imageIndex = randomImageIndexGrid[indexX][indexY];
    return bigProjects.includes(imageIndex) && (Math.abs(x / (WIDTH + MARGIN)) + Math.abs(y / (HEIGHT + MARGIN))) % bigProjetsFerequency === 0;
  }

  return false;
};


    const left = checkPosition(x - (WIDTH + MARGIN), y);
    const top = checkPosition(x, y - (HEIGHT + MARGIN));
    const topLeft = checkPosition(x - (WIDTH + MARGIN), y - (HEIGHT + MARGIN));

    return left || top || topLeft;
  }, [randomImageIndexGrid,WIDTH,MARGIN,HEIGHT]);


  const { width: windowWidth, height: windowHeight } = useWindowSize();

  const startX = Math.floor((-stagePos.x - windowWidth) / (WIDTH + MARGIN)) * (WIDTH + MARGIN);
  const endX = Math.floor((-stagePos.x + windowWidth * 2) / (WIDTH + MARGIN)) * (WIDTH + MARGIN);

  const startY = Math.floor((-stagePos.y - windowHeight) / (HEIGHT + MARGIN)) * (HEIGHT + MARGIN);
  const endY = Math.floor((-stagePos.y + windowHeight * 2) / (HEIGHT + MARGIN)) * (HEIGHT + MARGIN);

  const handleMouseEnter = useCallback((x, y) => {
    setHoveredImageIndices((prevHoveredIndices) => {
      return { ...prevHoveredIndices, [`${x}-${y}`]: true };
    });
  }, []);

  const handleMouseLeave = useCallback((x, y) => {
    setHoveredImageIndices((prevHoveredIndices) => {
      const newHoveredIndices = { ...prevHoveredIndices };
      delete newHoveredIndices[`${x}-${y}`];
      return newHoveredIndices;
    });
  }, []);

  const handleWheel = useCallback(
    (e) => {
      e.evt.preventDefault();

      const updatePosition = () => {
        const newStagePos = {
          x: stagePos.x - e.evt.deltaX,
          y: stagePos.y - e.evt.deltaY,
        };

        setStagePos(newStagePos);
      };

      requestAnimationFrame(updatePosition);
    },
    [stagePos]
  );

  const handleClickOnEnlargedImage = () => {
    setIsReturning(true);
    setTimeout(() => {
      handleMouseLeave(hiddenImage.x, hiddenImage.y);
      setHiddenImage(null);
      setEnlargedImgData(null);
      setIsReturning(false);
      setSelectedProject(null)
    }, 500);
    setIsFadingOut(true);
  };


  const shouldEnlargeFirstImage = useCallback((x, y, imageIndex) => {
    return (
      bigProjects.includes(imageIndex) &&
      (Math.abs(x / (WIDTH + MARGIN)) + Math.abs(y / (HEIGHT + MARGIN))) % bigProjetsFerequency === 0);
  }, [WIDTH,MARGIN,HEIGHT]);

  const handleClick = useCallback((x, y) => {
    const indexX = Math.abs(x / (WIDTH + MARGIN)) % GRID_SIZE;
    const indexY = Math.abs(y / (HEIGHT + MARGIN)) % GRID_SIZE;
    const imageIndex = randomImageIndexGrid[indexX][indexY];
    const isEnlarged = shouldEnlargeFirstImage(x, y, imageIndex);

    const imgWidth = isEnlarged ? LARGE_WIDTH : WIDTH;
    const imgHeight = isEnlarged ? LARGE_HEIGHT : HEIGHT;

    setEnlargedImgData({
      src: images[imageIndex].src,
      x: x + stagePos.x,
      y: y + stagePos.y,
      width: imgWidth,
      height: imgHeight,
    });

    setHiddenImage({ x, y, imageIndex });
    setShowBlackBackground(true);
    setSelectedProject(projects[imageIndex]);
    setTimeout(() => {
      setShowProjectDetails(true);
    }, 500)
  }, [randomImageIndexGrid, images, stagePos, shouldEnlargeFirstImage,WIDTH,MARGIN,HEIGHT,LARGE_HEIGHT,LARGE_WIDTH]);


  const EnlargedImageComponent = useMemo(() => {
    if (!enlargedImgData) return null;

    return (
      <EnlargedImage
        enlargedImgData={enlargedImgData}
        windowWidth={windowWidth}
        windowHeight={windowHeight}
        isReturning={isReturning}
      />
    );
  }, [enlargedImgData, windowWidth, windowHeight, isReturning]);

  return (
    <>
      <CornerTexts
        onCategoryClick={() => {setShowAboutMe(false); setShowCategory(!showCategory)}}
        onAboutMeClick={() => {setShowCategory(false); setShowAboutMe(!showAboutMe)}}
        isCategoryShow={showCategory}
        isAboutMeShow={showAboutMe}
      />
      {showCategory && (
        <Category onCategoryClick={() => setShowCategory(!showCategory)} isVisible={showCategory} />
      )}
      {showAboutMe && (
        <AboutMe
        showAboutMe={showAboutMe}
        fadeOutAnimation={() => {setIsFadingOut(true)}}
        closeAboutMe={() => setShowAboutMe(false)}
        isFadingOut={isFadingOut}
        />
      )}
      <Stage
        className="container"
        x={stagePos.x}
        y={stagePos.y}
        width={windowWidth}
        height={windowHeight}
        draggable
        onWheel={handleWheel}
        onDragEnd={(e) => {
          setStagePos(e.currentTarget.position());
        }}
      >
        <Layer>
          <ImageGridComponent
            startX={startX}
            endX={endX}
            startY={startY}
            endY={endY}
            hoveredImageIndices={hoveredImageIndices}
            images={images}
            imagesGrayscale={imagesGrayscale}
            handleMouseEnter={handleMouseEnter}
            handleMouseLeave={handleMouseLeave}
            handleClick={handleClick}
            randomImageIndexGrid={randomImageIndexGrid}
            hiddenImage={hiddenImage}
            isUnderLargeImage={isUnderLargeImage}
            WIDTH={WIDTH}
            HEIGHT={HEIGHT}
            MARGIN={MARGIN}
            GRID_SIZE={GRID_SIZE}
            bigProjetsFerequency={bigProjetsFerequency}
            LARGE_HEIGHT={LARGE_HEIGHT}
            LARGE_WIDTH={LARGE_WIDTH}
            shouldEnlargeFirstImage={shouldEnlargeFirstImage}
          />
        </Layer>
      </Stage>
      <ProjectDetails
        showDetails={showProjectDetails}
        project={selectedProject}
        handleClickOnEnlargedImage={handleClickOnEnlargedImage}
        onDetailsClose={() => setShowProjectDetails(false)}
      />
      {EnlargedImageComponent}
      <BlackBackground
        showBlackBackground={showBlackBackground}
        isFadingOut={isFadingOut}
        project={selectedProject}
      />
    </>
  );
};

export default Home;