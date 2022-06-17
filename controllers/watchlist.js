const User = require("../models/user");

exports.fetchWatchlist = async (req, res, next) => {
  const { userId } = req.query;

  try {
    const foundUser = (await User.find()).find(
      (user) => user._id.toString() === userId
    );
    if (!foundUser) {
      res.status(404).json({
        reason: {
          userId: {
            message: "A user with this id could not be found",
            value: userId,
          },
        },
      });
      return;
    }

    res.status(200).json({
      message: "User watchlist fetched successfully",
      watchlist: foundUser.watchlist,
    });
  } catch (error) {
    if (!error.statusCode) error.statusCode = 500;
    next(error);
  }
};

exports.addToWatchlist = async (req, res, next) => {
  const { id, title, rate, releaseDate, duration, budget } = req.body;
  const { userId } = req.query;

  try {
    const foundUser = (await User.find()).find(
      (user) => user._id.toString() === userId
    );
    if (!foundUser) {
      res.status(404).json({
        reason: {
          userId: {
            message:
              "In order to add the movie to watchlist, please login/signup first.",
            value: userId,
          },
        },
      });
      return;
    }

    const foundMovie = foundUser.watchlist.find((movie) => movie.id === id);

    if (foundMovie) {
      res.status(403).json({
        reason: {
          movieId: {
            message: "Movie with this id is already in the watchlist",
            value: id,
          },
        },
      });
      return;
    }

    const movie = {
      id,
      title,
      rate,
      releaseDate,
      duration,
      budget,
    };
    foundUser.watchlist = [...foundUser.watchlist, movie];
    await foundUser.save();

    res.status(200).json({
      message: "Movie is added to watchlist successfully",
      addedMovie: { ...movie },
    });
  } catch (error) {
    if (!error.statusCode) error.statusCode = 500;
    next(error);
  }
};

exports.removeFromWatchlist = async (req, res, next) => {
  const { id } = req.body;
  const { userId } = req.query;

  try {
    const foundUser = (await User.find()).find(
      (user) => user._id.toString() === userId
    );
    if (!foundUser) {
      res.status(404).json({
        reason: {
          userId: {
            message: "A user with this id could not be found",
            value: userId,
          },
        },
      });
      return;
    }

    const foundMovie = foundUser.watchlist.find((movie) => movie.id === id);

    if (!foundMovie) {
      res.status(404).json({
        reason: {
          [id]: {
            message: "Movie with this id is not found",
            value: id,
          },
        },
      });
      return;
    }
    foundUser.watchlist = [...foundUser.watchlist].filter(
      (movie) => movie.id !== id
    );
    await foundUser.save();

    res.status(200).json({
      message: "Movie is removed from watchlist successfully",
      id,
    });
  } catch (error) {
    if (!error.statusCode) error.statusCode = 500;
    next(error);
  }
};
