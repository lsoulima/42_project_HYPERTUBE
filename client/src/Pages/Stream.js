import React, { useEffect, useContext, useState } from "react";
import styled from "styled-components";
import ReactPlayer from "react-player";
import { HyperContext } from "../Context/context";
import {
  movieDetailsAction,
  movieSuggestions,
  addMovieToFavorite,
  addMovieToWatched,
  DeleteFavoriteMovies,
  addCommentToMovie,
  getMoviesComments,
  deleteCommentMovie,
} from "../services/moviesActions";
import { useHistory } from "react-router";
import { Avatar, Grid, Paper } from "@material-ui/core";
import StarIcon from "@material-ui/icons/Star";
import StarHalfIcon from "@material-ui/icons/StarHalf";
import moment from "moment";
import Alert from "@material-ui/lab/Alert";
import { Snackbar } from "@material-ui/core";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";

const Container = styled.div`
  padding-top: 100px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  max-width: 90%;
  margin: 0 auto;
  .suggestions_like {
    margin: 0;
    font-size: 30px;
    font-weight: 700;
    line-height: 64px;
    letter-spacing: -1px;
    color: ${(props) => props.theme.text};
    margin-top: 50px;
    text-align: center;
    position: relative;
  }
`;

const MyVideo = styled.div`
  .quality {
    display: flex;
    justify-content: center;
    color: ${(props) => props.theme.background_grey_5};
    padding: 25px 0 !important;

    .quality_item {
      display: flex;
      flex-wrap: wrap;
      div {
        cursor: pointer;
        background: ${(props) => props.theme.background_grey_2};
        color: #fff;
        padding: 10px 15px;
        font-size: 12px;
        margin-right: 15px;
        border-radius: 25px;
        :hover {
          transform: scale(1.02);
          transition: all 0.4s;
          height: auto;
          box-shadow: 0px 0px 12px #cdcdcd;
          background-color: red;
        }
      }
    }
  }
  .divider {
    width: 100%;
    border-bottom: 1px solid ${(props) => props.theme.background_grey_2};
  }
  height: 700px;
  width: 90%;
  @media (max-width: 1440px) {
    width: 100%;
  }
  @media (min-width: 2000px) {
    width: 60%;
  }
`;

const CommentSection = styled.div`
  background: transparent;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 100px;
  width: 100%;
  .title {
    margin: 0;
    font-size: 30px;
    font-weight: 700;
    line-height: 64px;
    letter-spacing: -1px;
    color: ${(props) => props.theme.text};
    margin-top: 50px;
    text-align: center;
    position: relative;
  }
  .input_area {
    width: 90%;
    text-align: center;
  }
  .comment_input {
    cursor: text;
    width: 88%;
    height: 100px;
    color: ${(props) => props.theme.background};
    background: ${(props) => props.theme.cards};
    border: 2px solid ${(props) => props.theme.border};
    border-radius: 15px;
    font-family: inherit;
    font-size: 1.2rem;
    padding: 0.6rem 1.6rem;
    @media (max-width: 768px) {
      /* width: auto; */
      font-size: 0.8rem;
    }
    :hover {
      transform: scale(1.02);
      transition: all 0.4s;
      box-shadow: 0px 0px 12px #cdcdcd;
    }
  }
  .comment_input:focus {
    outline: none;
  }
  input.comment_input {
    color: ${(props) => props.theme.text};
  }

  .comments_list {
    width: 80%;
    text-align: center;

    .comment_item {
      padding: 40px 20px;
      margin: 30px 0;
      border-radius: 15px;
      background-color: ${(props) => props.theme.cards};
      color: ${(props) => props.theme.text};
      box-shadow: 0px 0px 12px #cdcdcd;
    }
  }
`;

const Suggestions = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
`;

const MyCard = styled.div`
  cursor: pointer;
  position: relative;
  display: block;
  width: 480px;
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

  .bright_back_error {
    background: url("./img/404.svg");
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
      .minutes {
        display: inline-block;
        margin-top: 15px;
        color: #555;
        padding: 5px;
        border-radius: 5px;
        border: 1px solid rgba(0, 0, 0, 0.05);
      }
      .type {
        display: inline-block;
        color: #959595;
        margin-left: 10px;
      }
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

  @media (min-width: 300px) {
    width: 100%;
    .movie_header {
      h1 {
        font-size: 1.5rem;
      }
      div {
        font-size: 1rem;
      }
    }
  }
  @media (min-width: 768px) {
    width: 45%;
  }
  @media (min-width: 1440px) {
    width: 30%;
  }
  @media (min-width: 2500px) {
    width: 20%;
  }
`;

const MovieDetailes = styled.div`
  width: 100%;
  margin-top: 115px;
  display: flex;
  justify-content: space-evenly;
  @media (max-width: 768px) {
    flex-direction: column-reverse;
  }
  @media (min-width: 1024px) {
    width: 90%;
  }
  @media (min-width: 2000px) {
    width: 60%;
  }
`;

const MainContainer = styled.div`
  background: ${(props) => props.theme.background};
  min-height: 100vh;
  .divider {
    width: 100%;
    border-bottom: 1px solid ${(props) => props.theme.background_grey_2};
  }
  .movie_section {
    height: 100%;
    flex-basis: 11%;
    min-width: 250px;
    div:first-of-type {
      height: 300px;
      margin: 15px;
      img {
        height: 100%;
        width: 100%;
      }
    }
    div:last-of-type {
      margin: 15px;
      background: ${(props) => props.theme.background_btn};
      height: 50px;
      text-align: center;
      line-height: 70px;
      color: #ffe600;
      border-radius: 5px;
      cursor: pointer;
    }
  }
  .detail_section {
    display: flex;
    flex-direction: column;
    flex-basis: 70%;

    .detail_section_name {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0 30px;
      div {
        color: #fff;
        span:first-of-type {
          color: ${(props) => props.theme.background_grey_2};
          margin-right: 20px;
        }
        span:last-of-type {
          background-color: ${(props) => props.theme.background_grey_2};
          padding: 0 10px;
        }
      }
      h1 {
        margin: 0;
        font-size: 55px;
        font-weight: 600;
        line-height: 70px;
        letter-spacing: -1px;
        color: ${(props) => props.theme.text};
      }
      @media (max-width: 768px) {
        h1 {
          font-size: 40px;
        }
      }
    }
    .detail_section_duration {
      color: ${(props) => props.theme.background_grey_5};
      padding-bottom: 35px !important;
      padding-top: 35px !important;
      span:nth-child(2) {
        margin: 0 3px;
      }
      .movie_genre {
        margin: 20px 0;
        display: flex;
        flex-wrap: wrap;
        div {
          background: ${(props) => props.theme.background_grey_2};
          color: #fff;
          padding: 10px 15px;
          font-size: 12px;
          margin-right: 5px;
          border-radius: 25px;
        }
      }
    }
    .detail_section_description {
      color: ${(props) => props.theme.text};
      font-size: 14px;
      font-weight: 400;
      line-height: 24px;
      letter-spacing: 0.5px;
      padding-bottom: 30px;
    }
    .detail_section_movieInfo {
      .detail_section_director {
        width: 100%;
        display: flex;
        align-items: flex-start;
        min-height: 4.6rem;
        padding: 20px 0;
        font-size: 11px;
        .director {
          color: ${(props) => props.theme.background_grey_5};
          flex-basis: 15%;
          width: 100%;
        }
        .director_value {
          margin-left: 25px;
          bottom: 2px;
          color: ${(props) => props.theme.text};
        }
      }
      .mini_divider {
        width: 50%;
        height: 1px;
        background: ${(props) => props.theme.background_grey_2};
      }
    }
  }
  @media (max-width: 768px) {
    flex-direction: column;
    .movie_section {
      div:first-of-type {
        height: auto;
        margin: 15px;
        img {
          display: none;
        }
      }
    }
  }
`;

export default function Stream() {
  const { t } = useTranslation();
  const { state, lng } = useContext(HyperContext);
  const { userInfos } = useContext(HyperContext);
  const [details, setDetails] = useState({});
  const [subtitles, setSubtitles] = useState({
    en: "",
    fr: "",
    ar: "",
  });
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState({});
  const [favorite, setFavorite] = useState({});
  const [cmtMsg, setcmtMsg] = useState({});
  // eslint-disable-next-line
  const [watched, setWatched] = useState({});
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [hashsrc, setHashQuality] = useState("");
  const movieKey = window.location.search.split("=")[0];
  const movieID = window.location.search.split("=")[1];

  const handleClose = (reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    setDone(false);
  };

  const timeConvert = (n) => {
    const num = n;
    const hours = num / 60;
    const rhours = Math.floor(hours);
    const minutes = (hours - rhours) * 60;
    const rminutes = Math.round(minutes);
    return rhours + " hour(s) " + rminutes + " minute(s).";
  };

  //* LOAD MOVIES SUGGESTIONS
  const LoeadmovieSuggestions = async () => {
    const response = await movieSuggestions(state.token, movieID);
    setSuggestions(response);
  };

  //* HANDLE CLICK MOVIES SUGGESTIONS
  let history = useHistory();
  const handleClickMovie = (id) => {
    if (id) {
      history.push("/stream?film_id=" + id);
    }
  };

  //* ADD MOVIE TO FAVORITE LIST
  const handleAddToFavorite = async () => {
    const movieInfo = {
      movieId: details.id,
      title: details.title,
      year: details.year,
      image: details.image,
      rating: details.rating,
    };

    const responce = await addMovieToFavorite(state.token, movieInfo);

    if (responce) {
      setFavorite(responce);
      setDetails({ ...details, favorite: true });
      setOpen(true);
    }
  };

  //* DELETE MOVIE FROM FAVORITE LIST
  const handleRemoveFromFavorite = async () => {
    const responce = await DeleteFavoriteMovies(state.token, details.id);

    if (responce) {
      setFavorite(responce);
      setDetails({ ...details, favorite: false });
      setOpen(true);
    }
  };

  //* ADD MOVIE TO WATCHED LIST
  // eslint-disable-next-line
  const handleAddToWatched = async () => {
    const movieInfo = {
      movieId: details.id,
      title: details.title,
      year: details.year,
      image: details.image,
      rating: details.rating,
    };

    const responce = await addMovieToWatched(state.token, movieInfo);

    if (responce) {
      setWatched(responce);
    }
  };

  //* HANDLE COMMENT INPUT
  const handleOnChange = (e) => {
    setComment(e.target.value);
  };

  //* HANDLE SUBMIT COMMENTS
  const handleOnSubmit = async (e) => {
    e.preventDefault();

    const res = await addCommentToMovie(state.token, comment, details.id);

    if (res.success === false) {
      setcmtMsg({
        success: false,
        error: "No Comment added !",
      });
      setDone(true);
    } else {
      setComments([...comments, res.comment]);
      setcmtMsg({
        success: true,
        message: res.message,
      });
      setDone(true);
      setComment("");
    }
  };

  //* HANDLE LOAD COMMENTS OF MOVIE
  const loadComments = async (movieid) => {
    const res = await getMoviesComments(state.token, movieid);

    if (res?.success === false) {
      setcmtMsg({
        success: false,
        error: "No Comment found !",
      });
      setDone(true);
    } else {
      setComments(res);
    }
  };

  //* HANDLE DELETE COMMENT OF A MOVIE
  const handleDeleteComment = async (commentid) => {
    const res = await deleteCommentMovie(state.token, commentid);

    if (res.success === false) {
      setcmtMsg({
        success: false,
        error: "No Comment delelted !",
      });
      setDone(true);
    } else {
      setComments(comments.filter((item) => item._id !== commentid));
      setcmtMsg({
        success: true,
        message: res.message,
      });
      setDone(true);
    }
  };

  //* LOAD SUBTITLES OF A MOVIE
  const handleSetSubtitles = async (imdb) => {
    await axios
      .get("http://localhost:3001/api/movies/subtitles/" + imdb)
      .then((res) => {
        if (res.success === false) {
          //! Print Error
        } else if (res.ar === "not found") {
          setSubtitles({
            ...subtitles,
            en: `http://localhost:3001/api/public/subtitles/${imdb}en.vtt`,
            fr: `http://localhost:3001/api/public/subtitles/${imdb}fr.vtt`,
          });
        } else {
          setSubtitles({
            ...subtitles,
            en: `http://localhost:3001/api/public/subtitles/${imdb}en.vtt`,
            fr: `http://localhost:3001/api/public/subtitles/${imdb}fr.vtt`,
            ar: `http://localhost:3001/api/public/subtitles/${imdb}ar.vtt`,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const loadMovieDetails = async () => {
      if (movieID && movieKey === "?film_id") {
        const response = await movieDetailsAction(state.token, movieID);
        if (response?.success === false) {
          setError(response);
        } else {
          setDetails(response);
          await handleSetSubtitles(response.imdb);
          setHashQuality(response.torrents[0].hash);
        }
      } else {
        setError({
          error: "No movie id found !",
        });
      }
    };
    loadMovieDetails();
    LoeadmovieSuggestions();
    loadComments(movieID);
    // eslint-disable-next-line
  }, [movieID]);

  return (
    <MainContainer>
      {error.error ? (
        <Container>
          <MyCard>
            <div className='info_section'>
              <div className='movie_header'>
                <img className='cover' src='./img/404.svg' alt='cover' />
                <h1>{t(error.error)}</h1>
              </div>
            </div>
          </MyCard>
        </Container>
      ) : (
        <Container>
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={open}
            autoHideDuration={3000}
            onClose={handleClose}>
            {favorite.success === true ? (
              <Alert onClose={handleClose} severity='success' variant='filled'>
                {t(favorite.message)}
              </Alert>
            ) : (
              <Alert onClose={handleClose} severity='info' variant='filled'>
                {t(favorite.error)}
              </Alert>
            )}
          </Snackbar>
          <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            open={done}
            autoHideDuration={3000}
            onClose={handleClose}>
            {cmtMsg.success === true ? (
              <Alert onClose={handleClose} severity='success' variant='filled'>
                {t(cmtMsg.message)}
              </Alert>
            ) : (
              <Alert onClose={handleClose} severity='info' variant='filled'>
                {t(cmtMsg.error)}
              </Alert>
            )}
          </Snackbar>
          <MyVideo>
            <ReactPlayer
              url={[
                {
                  src: hashsrc
                    ? "http://localhost:3001/api/movies/stream/" + hashsrc
                    : "",
                  type: "video/webm",
                },
              ]}
              controls={true}
              width='100%'
              height='100%'
              onStart={handleAddToWatched}
              config={{
                file: {
                  attributes: {
                    crossOrigin: "anonymous",
                  },
                  tracks: [
                    {
                      kind: "subtitles",
                      src: subtitles.en,
                      srcLang: "en",
                      default: lng === "en",
                    },
                    {
                      kind: "subtitles",
                      src: subtitles.fr,
                      srcLang: "fr",
                      default: lng === "fr",
                    },
                    {
                      kind: "subtitles",
                      src: subtitles.ar,
                      srcLang: "ar",
                    },
                  ],
                },
              }}
            />
            <div className='divider quality'>
              <div className='quality_item'>
                {details?.torrents?.map((item, index) => (
                  <div key={index} onClick={() => setHashQuality(item.hash)}>
                    {item.quality}
                  </div>
                ))}
              </div>
            </div>
          </MyVideo>
          <MovieDetailes>
            <div className='movie_section'>
              <div>
                <img src={details.image} alt='cover' />
              </div>
              {details?.favorite ? (
                <div
                  onClick={() => {
                    handleRemoveFromFavorite();
                  }}>
                  <StarHalfIcon fontSize='large' />
                </div>
              ) : (
                <div
                  onClick={() => {
                    handleAddToFavorite();
                  }}>
                  <StarIcon fontSize='large' />
                </div>
              )}
            </div>
            <div className='detail_section'>
              <div className='divider detail_section_name'>
                <h1>{details?.title_long}</h1>
                <div>
                  <span>{t("Rating")}: </span>
                  <span>{details?.rating}</span>
                </div>
              </div>
              <div className='detail_section_duration'>
                <span>{timeConvert(details?.runtime)}</span>
                <div className='movie_genre'>
                  {details?.genres?.map((item, index) => (
                    <div key={index}>{item}</div>
                  ))}
                </div>
                <div className=' divider detail_section_description'>
                  {details?.descripton}
                </div>
              </div>

              <div className=' detail_section_movieInfo'>
                <div className='detail_section_director'>
                  <div className='director'>{t("ACTORS")}</div>
                  <div className='director_value'>{details?.actors}</div>
                </div>
              </div>
            </div>
          </MovieDetailes>
          <div className='suggestions_like'>{t("You May Also Like")}</div>
          <Suggestions>
            {suggestions?.map((movie, id) => (
              <MyCard
                key={id}
                onClick={() => {
                  handleClickMovie(movie.id);
                }}>
                <div className='info_section'>
                  <div className='movie_header'>
                    <img className='cover' src={movie?.image} alt='cover' />
                    <h1>{movie?.title}</h1>
                    <div>
                      <span>Rating: </span>
                      <span>{movie?.rating}</span>
                    </div>
                  </div>
                </div>
                <div
                  className='blur_back'
                  style={{
                    backgroundImage: `url(${movie?.image})`,
                  }}></div>
                <i className='las la-play-circle play_button' />
              </MyCard>
            ))}
          </Suggestions>
          <CommentSection>
            <div className='title'>{t("Comments")}</div>
            <div className='comments_list'>
              {comments.map((comment, index) => (
                <Paper className='comment_item' key={index}>
                  <Grid container wrap='nowrap' spacing={2}>
                    <Grid item>
                      <Avatar
                        alt='UserProfile'
                        src={
                          comment.userId?.profile
                            ? comment.userId?.profile
                            : "./img/avatar.jpeg"
                        }
                      />
                    </Grid>
                    <Grid justifycontent='left' item xs zeroMinWidth>
                      <h3
                        style={{
                          margin: 0,
                          textAlign: "left",
                          cursor: "pointer",
                        }}>
                        <Link
                          to={
                            comment.userId.username === userInfos.username
                              ? "/profile"
                              : `/profile/${comment?.userId.username}`
                          }
                          style={{ color: "gray" }}>
                          {comment.userId.username}
                        </Link>
                      </h3>
                      <p style={{ textAlign: "left" }}>{comment.content}</p>
                      <p style={{ textAlign: "right", color: "gray" }}>
                        {moment(comment.createdAt).from()}
                      </p>
                    </Grid>
                    <Grid>
                      {userInfos.id === comment.userId._id ? (
                        <i
                          className='las la-trash'
                          style={{ fontSize: "25px", cursor: "pointer" }}
                          onClick={() => handleDeleteComment(comment._id)}></i>
                      ) : (
                        ""
                      )}
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </div>
            <div className='input_area'>
              <form onSubmit={handleOnSubmit}>
                <input
                  className='comment_input'
                  type='Comment'
                  maxLength={100}
                  value={comment}
                  placeholder={t("Comment")}
                  onChange={handleOnChange}
                />
              </form>
            </div>
          </CommentSection>
        </Container>
      )}
    </MainContainer>
  );
}
