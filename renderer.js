// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

db.find({}, function (err, docs) {
    let keys = Object.keys(docs);
    let runs = {};
    keys.map((x) => {
        let run = {};
        run.id = docs[x].id;
        run.date = docs[x].date;
        run.distance = docs[x].distance;
        run.time = docs[x].time;
        runs[x] = run;
        let container = document.getElementById('runContainer');
        let newRun = document.createElement('li');
        newRun.setAttribute("class","run");
        newRun.innerHTML = createRun(run);
        document.body.insertBefore(newRun, container);
    });
    console.log(runs);

});

function createRun(runs) {
    return `<a onclick="openLink('https://www.strava.com/activities/${runs.id}')">
        <span>${runs.date}</span>
        <span>${runs.distance}</span>
        <span>${runs.time}</span>
        <span>${scorer(runs.distance, runs.time)}</span>
    </a>`;
};

function scorer(distance, time) {
    const pace = (time / 60) / distance;
    return (Math.round(((400 * Math.pow(distance, 0.2)) - pace) * 100) / 100) + 60;
}