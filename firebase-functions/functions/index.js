const functions = require("firebase-functions");
const fetch = require("node-fetch");
const admin = require("firebase-admin");

admin.initializeApp();

const CLIENT_ID = "e7046a4937da4182b586c352a0c66d3d";
const CLIENT_SECRET = "f1fd4fdf4d4f4156902c45f94a7c2e88";
const BASIC_AUTH = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

exports.spotifyToken = functions.https.onRequest(async (req, res) => {
  try {
    const { code, redirectUri } = req.body;

    if (!code || !redirectUri) {
      return res.status(400).json({ error: "Missing code or redirectUri" });
    }

    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${BASIC_AUTH}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri
      })
    });

    const data = await tokenRes.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error("[Firebase] Token exchange error:", err);
    return res.status(500).json({ error: "Token exchange failed" });
  }
});
