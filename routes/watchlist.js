const express = require("express");

const watchlistController = require("../controllers/watchlist");

const router = express.Router();

// TODO: try to find a way to integrate "isAuth" middleware for protecting the following routes against unauthorized access
router.get("/all", watchlistController.fetchWatchlist);

router.post("/add-movie", watchlistController.addToWatchlist);

router.post("/remove-movie", watchlistController.removeFromWatchlist);

module.exports = router;
