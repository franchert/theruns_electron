const strava = require('strava-v3');
const {shell} = require('electron');
// Persistent datastore with manual loading
var Datastore = require('nedb');
var db = new Datastore({
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
                for (var i = 0; i < payload.length; i++) {
                    data = {
                        id: payload[i]['id'],
                        date: payload[i]['start_date_local'],
                        distance: payload[i]['distance'] * 0.000621371192,
                        time: payload[i]['elapsed_time'],
                        score: scorer(payload[i]['distance'], payload[i]['elapsed_time'])
                    };
                    db.update({id: payload[i]['id']}, data, {upsert: true}, function (err, docs) {
                    });
                }
                var nextPage = pag + 1;
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
    const pace = (time / 60) / distance;
    //return (Math.round(((400 * Math.pow(pace, 0.2)) - distance) * 100) / 100) + 60;
    return Math.pow(distance, 1.2) * pace
}