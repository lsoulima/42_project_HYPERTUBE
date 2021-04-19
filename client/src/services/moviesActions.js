import axios from "axios";
const API_URL = "http://localhost:3001/api";

//* Get Movies list
export const moviesListAction = async (token, page, sort, filter, search) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page: page,
      sort: sort,
      genre: filter?.genre,
      quality: filter?.quality,
      rating: filter?.rating,
      search: typeof search != "undefined" && search ? search : "",
    },
  };
  try {
    const res = await axios.get(API_URL + "/movies/list", config);
    if (res.data) return res.data;
  } catch (error) {
    return error.response.data;
  }
};

//* Get Movies data Details

export const movieDetailsAction = async (token, movieId) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const res = await axios.get(API_URL + "/movies/id/" + movieId, config);
    if (res) return res.data;
  } catch (error) {
    return error.response?.data;
  }
};

//* Get Movies Suggestions
export const movieSuggestions = async (token, movieId) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const res = await axios.get(
      API_URL + "/movies/suggestions/id/" + movieId,
      config
    );
    if (res) return res.data;
  } catch (error) {
    return error.response?.data;
  }
};

//* Post Movies to Favorite list

export const addMovieToFavorite = async (token, movieInfo) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const res = await axios.post(
      API_URL + "/movies/add/tofavorite",
      movieInfo,
      config
    );

    if (res) return res.data;
  } catch (error) {
    return error.response?.data;
  }
};

//* Get Favorite list Movies

export const getFavoriteMovies = async (token) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const res = await axios.get(API_URL + "/movies/favorite", config);

    if (res) return res.data;
  } catch (error) {
    return error.response?.data;
  }
};

//* Delete Favorite list Movies

export const DeleteFavoriteMovies = async (token, movieId) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const res = await axios.delete(
      API_URL + "/movies/delete/fromfavorite/" + movieId,
      config
    );

    if (res) return res.data;
  } catch (error) {
    return error.response?.data;
  }
};
//* Post Movies to Watched list

export const addMovieToWatched = async (token, movieInfo) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const res = await axios.post(
      API_URL + "/movies/add/towatch",
      movieInfo,
      config
    );
    if (res) return res.data;
  } catch (error) {
    return error.response?.data;
  }
};

//* Get Watched list Movies

export const getWatchedMovies = async (token) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const res = await axios.get(API_URL + "/movies/watched", config);

    if (res) return res.data;
  } catch (error) {
    return error.response?.data;
  }
};

//* Post Comment on a movie

export const addCommentToMovie = async (token, comment, movieId) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const res = await axios.post(
      API_URL + "/comments/add/" + movieId,
      {
        body: comment,
      },
      config
    );
    if (res) return res.data;
  } catch (error) {
    return error.response.data;
  }
};

//* Get Comments of a movie

export const getMoviesComments = async (token, movieId) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const res = await axios.get(API_URL + "/comments/list/" + movieId, config);
    if (res) return res.data;
  } catch (error) {
    return error.response?.data;
  }
};

//* Delete comment of a movie
export const deleteCommentMovie = async (token, commentid) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const res = await axios.delete(
      API_URL + "/comments/delete/" + commentid,
      config
    );
    if (res) return res.data;
  } catch (error) {
    return error.response.data;
  }
};
