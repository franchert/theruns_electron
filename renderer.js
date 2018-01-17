// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const moment = require('moment');
db.find({}).sort({score: -1}).exec(function (err, docs) {
    mapData('byScore', docs);
});
db.find({}).sort({date: -1}).exec(function (err, docs) {
    mapData('byDate', docs);
});

function mapData(container, docs) {
    let keys = Object.keys(docs);
    let runs = {};
    keys.map((x) => {
        //console.log(x);
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
        //run.place = x;
        runs[x] = run;
        let ctr = document.getElementById(container);
        let newRun = document.createElement('li');
        newRun.setAttribute("class","run");
        newRun.innerHTML = createRun(run);
        ctr.appendChild(newRun);
    });
}

function createRun(runs) {
    return `<a onclick="openLink('https://www.strava.com/activities/${runs.id}')">
        <span>${runs.score}</span>
        <span>${runs.distance}</span>
        <span>${runs.timeString}</span>
        <span></span>
        <span>${runs.pace}</span>
        <span>${runs.date}</span>
    </a>`;
}

function formatDate(date) {
    return date;
}