const strava = require('strava-v3');
const {shell} = require('electron')
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

  strava.athlete.listActivities({page:pag},function(err,payload,limits) {
    if(!err) {
      if(payload.length > 0){
        for(let i=0; i<payload.length; i++){
          db.find({id:payload[i]['id']}, function(err,docs){
            if(docs.length === 0){
              //score: scorer(payload[i]['distance']*0.000621371192,payload[i]['elapsed_time']),
              data = {
                id: payload[i]['id'],
                date: payload[i]['start_date_local'],
                distance: payload[i]['distance']*0.000621371192,
                time: payload[i]['elapsed_time']
              };
              db.insert(data, function(err,newDoc){});
            }
          });
        }
        var nextPage = pag + 1;
        refreshData(nextPage);
      } else{
        location.reload();
      }
    }
    else {
      console.log(err);
    }
  });
}


function scorer(distance,time){
  var pace = (time / 60) / distance;
  return (Math.round(((400 * Math.pow(distance,0.2)) - pace) * 100) / 100) + 60;
}