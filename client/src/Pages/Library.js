import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Typography,
  Slider,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@material-ui/core";
import InfiniteScroll from "react-infinite-scroll-component";
import { moviesListAction } from "../services/moviesActions";
import { HyperContext } from "../Context/context";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { useHistory } from "react-router";
import { useTranslation } from "react-i18next";

const Container = styled.div`
  margin: 0 20px 20px 20px;
  padding-top: 50px;
  display: flex;
  justify-content: space-between;

  .second_card {
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    flex-basis: 48%;
    border-radius: 15px;
    background-color: ${(props) => props.theme.cards};
    .submit {
      background-color: red;
    }
  }
  .second_card__container {
    width: 100%;
    display: flex;
    justify-content: space-around;
  }
  .first_card {
    padding: 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    flex-basis: 48%;
    border-radius: 15px;
    background-color: ${(props) => props.theme.cards};
    height: 200px;
    .MuiTypography-root {
      color: ${(props) => props.theme.text};
    }
  }
  .second_card__container > div {
    text-align: center;
    min-width: 100px;
    color: ${(props) => props.theme.text};
  }
  .second_card__container > div:nth-child(2),
  .second_card__container > div:nth-child(3) {
    .MuiFormControl-root {
      min-width: 100px;
      padding-bottom: 28px;
    }
    .MuiInputBase-root {
      color: ${(props) => props.theme.text};
    }
  }
  .radioContainer {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    color: ${(props) => props.theme.text};
  }

  @media (max-width: 768px) {
    flex-direction: column;
    .first_card,
    .second_card {
      margin-bottom: 20px;
    }
  }

  @media (max-width: 480px) {
    .second_card__container {
      flex-direction: column;
      align-items: center;
    }
  }
  @media (max-width: 480px) {
    & {
      justify-content: center;
      .second_card__container div {
        text-align: center;
        width: 90% !important;
      }
    }
    .radioContainer {
      flex-direction: column;
      align-items: center;
    }
  }
`;

const MySlider = styled(Slider)`
  color: red;
`;

const MessageCard = styled.div`
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
    }
  }
  @media (max-width: 550px) {
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
`;

const MovieCard = styled.div`
  cursor: pointer;
  margin: 10px;
  width: 240px;
  height: 382px;
  position: relative;
  /* border: 5px solid #fff; */
  transition: all 0.8s;
  border-radius: 7px;
  box-shadow: 0px 4px 15px ${(props) => props.theme.background_grey_2};
  img {
    border-radius: 7px;
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
    .watch {
      position: relative;
      text-align: center;
      .watchBtn {
        width: 100px;
        padding: 10px;
        border: 2px solid red;
        color: white;
      }
      .test1 {
        height: 2px;
        width: 50px;
        background: red;
        position: absolute;
        top: 50%;
        left: -40%;
      }
      .test2 {
        height: 2px;
        width: 50px;
        background: red;
        position: absolute;
        top: 50%;
        right: -40%;
      }
    }
  }
  .eye {
    position: absolute;
    top: 0;
    right: 10px;
    color: #fff;
    font-size: 30px;
  }
`;

const FormControlMdf = styled(FormControl)`
  .MuiFormLabel-root.Mui-focused {
    color: red; //${(props) => props.theme.text};
  }
  .MuiInput-underline:after {
    border: 1px solid #333;
  }
  .MuiInput-underline:hover:not(.Mui-disabled):before {
    border-bottom: 2px solid #333;
  }
  .MuiFormLabel-root {
    color: red; //${(props) => props.theme.text};
  }
  .MuiSelect-icon {
    color: ${(props) => props.theme.text};
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 80%;
  margin: 0 auto;
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const FilterCard = styled.div`
  .MuiRadio-colorSecondary.Mui-checked {
    color: red;
  }
`;

const MainContainer = styled.div`
  background: ${(props) => props.theme.background};
  min-height: 100vh;
`;

const SearchCard = styled.div`
  background: transparent;
  display: flex;
  padding-top: 40px;
  justify-content: center;

  .search {
    background: ${(props) => props.theme.cards};
    border: 2px solid ${(props) => props.theme.border};
    width: 400px;
    border-radius: 50px;
    color: ${(props) => props.theme.background};
    font-family: inherit;
    font-size: 1.2rem;
    padding: 0.6rem 1.6rem;
    @media (max-width: 768px) {
      width: auto;
      font-size: 0.8rem;
    }
  }
  .search:focus {
    outline: none;
  }
  input.search {
    color: ${(props) => props.theme.text};
  }
`;

export default function Library() {
  const { t } = useTranslation();
  const { state } = useContext(HyperContext);
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [radioValue, setRadioValue] = useState("like_count");
  const [isloading, setIsloading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState({});
  const [filter, setFilter] = useState({
    rating: 0,
    quality: "",
    genre: "",
  });
  const [hovered, setHovered] = useState(false);
  const toggleHover = (value) => setHovered(value);
  let history = useHistory();

  //* FILTER HANDLERS

  const handleReatingChange = (event, newvalue) => {
    setFilter({ ...filter, rating: newvalue });
  };
  const handleQualityChange = (event) => {
    setFilter({ ...filter, quality: event.target.value });
  };
  const handleGenreChange = (event) => {
    setFilter({ ...filter, genre: event.target.value });
  };

  const handleSubmitFilter = () => {
    setIsloading(true);
    setPage(1);
    fetchMoviesWithSortFilterSearch(page, radioValue, filter, searchTerm);
  };

  //* SORT HANDLERS

  const handleChangeRadio = (event) => {
    setRadioValue(event.target.value);
    setIsloading(true);
    setPage(1);
    setMovies([]);
    fetchMoviesWithSortFilterSearch(
      page,
      event.target.value,
      filter,
      searchTerm
    );
  };
  //* FETCH NORMAL
  const fetchMovies = async (page, sort, filter, search) => {
    const res = await moviesListAction(state.token, page, sort, filter, search);

    if (res?.success === false) {
      setError(res.error);
    } else {
      setMovies([...movies, ...res]);
      setTimeout(() => {
        setIsloading(false);
      }, 1500);
    }
  };
  //* FETCH MOVIES WITH SORT OR FILTER OR SEARCH
  const fetchMoviesWithSortFilterSearch = async (
    page,
    sort,
    filter,
    search
  ) => {
    const res = await moviesListAction(state.token, page, sort, filter, search);

    if (res?.success === false) {
      setError(res);
    } else {
      setMovies(res);
      setTimeout(() => {
        setIsloading(false);
      }, 1500);
    }
  };

  //* SEARCH HANDLERS

  const handleOnSubmit = (e) => {
    setIsloading(true);
    e.preventDefault();
    !searchTerm ? setRadioValue("like_count") : setRadioValue("title");
    setFilter({
      rating: 0,
      quality: "",
      genre: "",
    });
    setPage(1);
    setMovies([]);
    fetchMoviesWithSortFilterSearch(page, radioValue, filter, searchTerm);
  };

  const handleOnChange = (e) => {
    setSearchTerm(e.target.value);
  };

  //* HANDLE CLICK MOVIES

  const handleClickMovie = (id) => {
    if (id) {
      history.push("/stream?film_id=" + id);
    }
  };
  useEffect(() => {
    fetchMovies(page, radioValue, filter, searchTerm);
    // eslint-disable-next-line
  }, [page, radioValue, filter]);

  return (
    <MainContainer>
      <SearchCard>
        <form onSubmit={handleOnSubmit}>
          <input
            className="search"
            type="search"
            placeholder={t("Search")}
            value={searchTerm}
            onChange={handleOnChange}
          />
        </form>
      </SearchCard>
      <Container>
        <div className="first_card">
          <Typography>{t("Sort by")} :</Typography>
          <FilterCard style={{ width: "100%" }}>
            <FormControl error component="fieldset" style={{ width: "100%" }}>
              <RadioGroup
                value={radioValue}
                onChange={(e) => handleChangeRadio(e)}
                className="radioContainer"
              >
                <FormControlLabel
                  value="like_count"
                  control={<Radio />}
                  label={t("Popularity")}
                />
                <FormControlLabel
                  value="year"
                  control={<Radio />}
                  label={t("Year")}
                />
                <FormControlLabel
                  value="title"
                  control={<Radio />}
                  label={t("Title")}
                />
              </RadioGroup>
            </FormControl>
          </FilterCard>
        </div>
        <div className="second_card">
          <div className="second_card__container">
            <div>
              <Typography id="range-slider">{t("Rating")}</Typography>
              <MySlider
                value={filter.rating}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                onChange={handleReatingChange}
                max={9}
              />
            </div>
            <div>
              <FormControlMdf>
                <InputLabel
                  id="demo-simple-select-helper-label"
                  style={{ color: "white" }}
                >
                  {t("gender")}
                </InputLabel>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  value={filter.genre}
                  onChange={handleGenreChange}
                >
                  <MenuItem value="Action">Action</MenuItem>
                  <MenuItem value="Drama">Drama</MenuItem>
                  <MenuItem value="Horror">Horror</MenuItem>
                  <MenuItem value="Comedy">Comedy</MenuItem>
                  <MenuItem value="Crime">Crime</MenuItem>
                  <MenuItem value="Adventure">Adventure</MenuItem>
                  <MenuItem value="Biography">Biography</MenuItem>
                  <MenuItem value="Documentary">Documentary</MenuItem>
                  <MenuItem value="Family">Family</MenuItem>
                </Select>
              </FormControlMdf>
            </div>
            <div>
              <FormControlMdf>
                <InputLabel
                  id="demo-simple-select-helper-label"
                  style={{ color: "white" }}
                >
                  {t("Quality")}
                </InputLabel>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  value={filter.quality}
                  onChange={handleQualityChange}
                >
                  <MenuItem value="720p">720p</MenuItem>
                  <MenuItem value="1080p">1080p</MenuItem>
                  <MenuItem value="2160p">2160p</MenuItem>
                  <MenuItem value="3D">3D</MenuItem>
                </Select>
              </FormControlMdf>
            </div>
          </div>
          <Button
            type="submit"
            variant="contained"
            className="submit"
            color="primary"
            onClick={handleSubmitFilter}
          >
            {t("Filter")}
          </Button>
        </div>
      </Container>
      {error.error ? (
        <Container>
          <MessageCard>
            <div className="info_section">
              <div className="movie_header">
                <img className="cover" src="./img/404.svg" alt="cover" />
                <h1>{t(error.error)}</h1>
              </div>
            </div>
          </MessageCard>
        </Container>
      ) : (
        <InfiniteScroll
          dataLength={movies.length} //This is important field to render the next data
          next={() => setPage(page + 1)}
          hasMore={true}
          style={{ display: "flex", justifyContent: "center" }}
        >
          {isloading ? (
            <div
              id="loader"
              style={{
                padding: "100px",
                borderRadius: "15px",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
              }}
            >
              <Loader
                type="Grid"
                color="red"
                height={150}
                width={150}
                timeout={1500}
              />
            </div>
          ) : movies.length === 0 ? (
            <Container>
              <MessageCard>
                <div className="info_section">
                  <div className="movie_header">
                    <img className="cover" src="./img/404.svg" alt="cover" />
                    <h1>{t("No movies found")}</h1>
                  </div>
                </div>
              </MessageCard>
            </Container>
          ) : (
            <CardContainer>
              {movies.map((movie, index) => (
                <MovieCard
                  key={index}
                  onClick={() => {
                    handleClickMovie(movie.id);
                  }}
                  onMouseEnter={() => toggleHover(true)}
                  onMouseLeave={() => toggleHover(false)}
                >
                  <img
                    src={movie?.image} //poster_big}
                    width="100%"
                    height="100%"
                    alt="cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://t.ly/teEM";
                    }}
                  />
                  {movie?.watched ? (
                    <div className="eye ">
                      <i className="las la-eye"></i>
                    </div>
                  ) : (
                    ""
                  )}

                  <div className="backHover">
                    <div className="imdbPlace">
                      <h6>{movie.rating}</h6>
                    </div>
                    <div className="watch">
                      <div
                        className={
                          hovered
                            ? "watchBtn animate__animated  animate__backInDown animate__faster"
                            : "watchBtn"
                        }
                      >
                        {t("Watch")}
                      </div>
                      <div
                        className={
                          hovered
                            ? "test1 animate__animated  animate__backInLeft animate__faster"
                            : "test1"
                        }
                      ></div>
                      <div
                        className={
                          hovered
                            ? "test2 animate__animated  animate__backInRight animate__faster"
                            : "test2"
                        }
                      ></div>
                    </div>
                    <div className="mvName">
                      <h4>{movie.title}</h4>
                      <h6>{movie.year}</h6>
                    </div>
                  </div>
                </MovieCard>
              ))}
            </CardContainer>
          )}
        </InfiniteScroll>
      )}
    </MainContainer>
  );
}
