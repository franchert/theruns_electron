// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

db.find({}).sort({score: -1}).exec(function (err, docs) {
    let keys = Object.keys(docs);
    let runs = {};
    keys.map((x) => {
        let run = {};
        run.id = docs[x].id;
        run.date = docs[x].date;
        run.distance = docs[x].distance;
        run.time = docs[x].time;
        run.score = docs[x].score;
        runs[x] = run;
        let container = document.getElementById('runContainer');
        let newRun = document.createElement('li');
        newRun.setAttribute("class","run");
        newRun.innerHTML = createRun(run);
        document.body.insertBefore(newRun, container);
    });
});

function createRun(runs) {
    return `<a onclick="openLink('https://www.strava.com/activities/${runs.id}')">
        <span>${runs.score}</span>
        <span>${runs.date}</span>
        <span>${runs.distance}</span>
        <span>${runs.time}</span>
    </a>`;
};