import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import Carousel from "react-elastic-carousel";
import { HyperContext } from "../Context/context";
import { getFavoriteMovies } from "../services/moviesActions";
import { useHistory } from "react-router";
import { useTranslation } from "react-i18next";

const MyCard = styled.div`
  cursor: pointer;
  margin: 10px;
  width: 240px;
  height: 380px;
  position: relative;
  /* border: 5px solid #fff; */
  transition: all 0.8s;
  border-radius: 7px;
  box-shadow: 0px 4px 15px ${(props) => props.theme.background_grey_2};
  img {
    border-radius: 7px;
  }
  :focus {
    outline: none;
  }
  .backHover {
    border-radius: 7px;
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
  &:hover .backHover {
    background: rgba(54, 54, 54, 0.7);
    box-shadow: 0px 0px 50px -25px rgba(255, 0, 0, 0.8);
  }
  &:hover {
    transform: scale(1.05);
    transition: all 0.7s;
    /* border: 5px solid #ffffff; */
  }
  &:hover .backHover {
    opacity: 1;
  }
  &:hover .eye {
    z-index: 100;
  }
  .backHover {
    opacity: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    .mvName {
      width: 100%;
      color: #fff;
      padding: 10px;
      text-align: center;
      border-radius: 7px;
      background: url("./img/mask-title.png");
      h4,
      h6 {
        text-shadow: 0 0 10px rgb(0 0 0 / 60%);
      }
    }
    .imdbPlace {
      margin: 5px;
      width: 40px;
      height: 30px;
      background: red;
      align-self: flex-start;
      border-radius: 7px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      h6 {
        font-family: ui-sans-serif;
        color: #fff;
        font-size: 15px;
      }
    }
    :hover .play_button {
      opacity: 1;
    }
    .play_button {
      font-size: 70px;
      position: absolute;
      top: 50%;
      opacity: 0;
      z-index: 100;
      color: white;
      left: 50%;
      transform: translate(-50%, -50%);
      :hover {
        color: #ff8585;
        transition: all 0.9s;
      }
    }
  }
  .eye {
    position: absolute;
    top: 0;
    right: 10px;
    color: #ffe600;
    font-size: 30px;
  }
`;
const List = styled.div`
  width: 80%;
  .rec.rec-arrow {
    box-sizing: border-box;
    -webkit-transition: all 0.3s ease;
    transition: all 0.3s ease;
    font-size: 1.6em;
    background: none;
    color: red;
    border: none;
    padding: 0;
    width: 20px;
    min-width: 20px;
    line-height: 50px;
    -webkit-align-self: center;
    -ms-flex-item-align: center;
    align-self: center;
    cursor: pointer;
    outline: none;
    border-radius: 0;
  }
`;
const MessageCard = styled.div`
  position: relative;
  display: block;
  width: 100%;
  min-height: 300px;
  height: 100px;
  margin: 40px 10px;
  overflow: hidden;
  border-radius: 10px;
  transition: all 0.4s;
  box-shadow: 0px 0px 80x -25px rgb(0 0 0 / 50%);
  transition: all 0.4s;
  :hover {
    transform: scale(1.02);
    transition: all 0.4s;
    height: auto;
  }
  .blur_back {
    position: absolute;
    top: 0;
    z-index: 1;
    height: 100%;
    right: 0;
    background-size: cover;
    border-radius: 11px;
    width: 100%;
    background-position: 50% 50% !important;
  }
  .info_section {
    position: relative;
    width: 100%;
    height: 100%;
    background-blend-mode: multiply;
    z-index: 2;
    border-radius: 10px;
    background: linear-gradient(to top, #e5e6e6 50%, transparent 100%);
    display: inline-grid;
    .movie_header {
      position: relative;
      padding: 25px;
      height: 40%;
      width: 100%;
      margin-top: 85px;
      .cover {
        position: relative;
        float: left;
        margin-right: 20px;
        height: 120px;
        box-shadow: 0 0 20px -10px rgb(0 0 0 / 50%);
      }
      h1 {
        color: black;
        font-weight: 400;
      }
      h4 {
        color: #555;
        font-weight: 400;
      }
    }
  }
`;

const FavoriteList = () => {
  const { t } = useTranslation();
  const { state } = useContext(HyperContext);
  // eslint-disable-next-line
  const [hovered, setHovered] = useState(false);
  const toggleHover = (value) => setHovered(value);
  let history = useHistory();
  const breakPoints = [
    { width: 1, itemsToShow: 1 },
    { width: 425, itemsToShow: 2, itemsToScroll: 2 },
    { width: 550, itemsToShow: 3 },
    { width: 768, itemsToShow: 4 },
    { width: 1024, itemsToShow: 5 },
    { width: 1440, itemsToShow: 6 },
  ];

  const [favoriteMovies, setFavoriteMovies] = useState([]);

  /*  HANDLE CLICK ON FAVORITE MOVIES */
  const handleClickMovie = (id) => {
    if (id) {
      history.push("/stream?film_id=" + id);
    }
  };
  useEffect(() => {
    const getFavoriteMoviesList = async () => {
      const res = await getFavoriteMovies(state.token);
      setFavoriteMovies(res);
    };
    getFavoriteMoviesList();
  }, [state.token]);

  return (
    <List>
      {favoriteMovies?.length === 0 ? (
        <MessageCard>
          <div className='info_section'>
            <div className='movie_header'>
              <img className='cover' src='./img/favorite.svg' alt='cover' />
              <h1>{t("Go like some movies")}</h1>
            </div>
          </div>
        </MessageCard>
      ) : (
        <Carousel
          autoPlaySpeed={2000}
          breakPoints={breakPoints}
          pagination={false}
          enableAutoPlay>
          {favoriteMovies?.map((movie, id) => (
            <MyCard
              key={id}
              onClick={() => {
                handleClickMovie(movie?.movieId);
              }}
              onMouseEnter={() => toggleHover(true)}
              onMouseLeave={() => toggleHover(false)}>
              <img
                src={movie?.image}
                width='100%'
                height='100%'
                alt='cover'
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://t.ly/teEM";
                }}
              />

              <div className='eye'>
                <i className='las la-star  animate__animated animate__tada animate__infinite'></i>
              </div>
              <div className='backHover'>
                <div className='imdbPlace'>
                  <h6>{movie?.rating}</h6>
                </div>
                <i className='las la-play-circle play_button' />
                <div className='mvName'>
                  <h4>{movie?.title}</h4>
                  <h6>{movie?.year}</h6>
                </div>
              </div>
            </MyCard>
          ))}
        </Carousel>
      )}
    </List>
  );
};

export default FavoriteList;
