const strava = require('strava-v3');
const {shell} = require('electron');
// Persistent datastore with manual loading
const Datastore = require('nedb');
let db = new Datastore({
    filename: 'data/datafile',
    autoload: true
});

function refreshData(pag) {
    document.getElementById('refresh-button').setAttribute('disabled', true);
    // setTimeout(function(){
    //   document.getElementById('refresh-button').removeAttribute('disabled');
    // },15000)

    strava.athlete.listActivities({page: pag}, function (err, payload, limits) {
        //console.log(payload);
        if (!err) {
            if (payload.length > 0) {
                for (let i = 0; i < payload.length; i++) {
                    data = {
                        id: payload[i]['id'],
                        date: payload[i]['start_date_local'],
                        distance: Math.round((payload[i]['distance'] * 0.000621371192)*100)/100,
                        time: payload[i]['elapsed_time'],
                        score: Math.round(scorer(Math.round((payload[i]['distance'] * 0.000621371192)*100)/100, payload[i]['elapsed_time'])*100)/100
                    };
                    db.update({id: payload[i]['id']}, data, {upsert: true}, function (err, docs) {
                    });
                }
                const nextPage = pag + 1;
                refreshData(nextPage);
            } else {
                location.reload();
            }
        }
        else {
            console.log(err);
        }
    });
}

function openLink(url){
    shell.openExternal(url);
}

function scorer(distance, time) {
    const pace = ((time / 60) / distance) * 60;
    return ((Math.round(((400 * Math.pow(distance, 0.15)) - pace) * 100) / 100) + 50).toString().padStart(2,'0');;
}

function toPace(distance, time) {
    const pace = ((time / 60) / distance) * 60;
    const min = Math.floor(pace/60);
    const sec = Math.floor(pace % 60);
    return min + ":" + sec.toString().padStart(2,'0');
}
