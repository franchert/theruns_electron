// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const moment = require('moment');
db.find({}).sort({score: -1}).exec(function (err, docs) {
    mapData('byScore', docs);
    let keys = Object.keys(docs);
    keys.map((x) => {
        const val = parseInt(x,10) + 1;
        db.update({id:docs[x].id},{ $set: { place: val }},{},function (err, numReplaced) {});
    });
});
db.find({}).sort({date: -1}).exec(function (err, docs) {
    mapData('byDate', docs);
});
db.find({}).sort({distance: -1}).exec(function (err, docs) {
    mapData('byDistance', docs);
});

function mapData(container, docs) {
    let keys = Object.keys(docs);
    let runs = {};
    keys.map((x) => {
        const hours = Math.floor(docs[x].time/3600);
        let minutes = (Math.floor(docs[x].time/60) % 60);
        minutes = (minutes < 10 && hours === 0) ? minutes : minutes.toString().padStart(2,'0');
        const seconds = (Math.floor(docs[x].time) % 60).toString().padStart(2,'0');
        let run = {};
        run.id = docs[x].id;
        run.date = moment(docs[x].date).format('MM/DD/YYYY');
        run.distance = docs[x].distance;
        run.time = docs[x].time;
        run.pace = toPace(run.distance, run.time);
        run.timeString = (hours !== 0 ? hours + ":" : "") + minutes + ":" + seconds;
        run.score = docs[x].score;
        run.place = docs[x].place || "-";
        runs[x] = run;
        let ctr = document.getElementById(container);
        let newRun = document.createElement('li');
        newRun.setAttribute("class","run");
        newRun.innerHTML = createRun(run);
        ctr.appendChild(newRun);
    });
}

function createRun(runs) {
    return `<a class="run-link" data-score="${runs.score}" onclick="openLink('https://www.strava.com/activities/${runs.id}')">
        <span class="r-place">${runs.place}</span>
        <span class="r-score">${runs.score}</span>
        <span class="r-distance">${runs.distance}</span>
        <span class="r-pace">${runs.pace}</span>
        <span class="r-time">${runs.timeString}</span>
        <span class="r-date">${runs.date}</span>
    </a>`;
}

function formatDate(date) {
    return date;
}