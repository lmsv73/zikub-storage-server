let stream = require('youtube-audio-stream');
let express = require('express');
let app = express();
let port = 3000;
let YOUTUBE_REG_EX = "youtu";

//launch the server
app.listen(port, function () {
    console.log(`Youtube audio streamer listening on port ${port}!`)
});

app.get(`/*${YOUTUBE_REG_EX}*`, function (req, res) {
    stream(req.url.slice(1)).pipe(res);
});
