let ytdl = require('ytdl-core');
let FFmpeg = require('fluent-ffmpeg');
let through = require('through2');
let xtend = require('xtend');
let fs = require('fs');

module.exports = streamify;

function streamify (uri, opt) {
    opt = xtend({
        videoFormat: 'mp4',
        quality: 'lowest',
        audioFormat: 'mp3',
        applyOptions: function () {}
    }, opt);

    let video = ytdl(uri, {filter: filterVideo, quality: opt.quality});

    function filterVideo (format) {
        return format.container === (opt.videoFormat)
    }

    let stream = opt.file
        ? fs.createWriteStream(opt.file)
        : through();

    let ffmpeg = new FFmpeg(video);
    opt.applyOptions(ffmpeg);
    let output = ffmpeg
        .format(opt.audioFormat)
        .pipe(stream);

    output.on('error', video.end.bind(video));
    output.on('error', stream.emit.bind(stream, 'error'));

    //to let the user manage the video events for using its info like duration, description, name, etc.
    stream.video = video;

    return stream;
}