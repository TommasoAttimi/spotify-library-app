const express = require("express");
const router = express.Router();
const spotifyApi = require("../spotifyAuth");

router.get("/login", (req, res) => {
  const scopes = [
    "user-library-read",
    "playlist-read-private",
    "user-read-playback-state",
    "user-modify-playback-state",
  ];
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
  res.redirect(authorizeURL);
});

router.get("/callback", async (req, res) => {
  const code = req.query.code;
  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token } = data.body;
    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);
    res.redirect(
      `http://localhost:3000?access_token=${access_token}&refresh_token=${refresh_token}`
    );
  } catch (error) {
    res.redirect("/login");
  }
});

module.exports = router;
