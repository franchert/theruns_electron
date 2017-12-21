// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.


      const strava = require('strava-v3');
      const {shell} = require('electron')

      strava.athlete.listActivities({},function(err,payload,limits) {
        let str = '<table>';
          if(!err) {
            console.log(payload);
            for(let i=0; i<payload.length; i++){
              str += '<tr>'; 
              str += '<td><a target="_blank" href="https://www.strava.com/activities/' + payload[i]['id'] + '">Link</a></td>';
              str += '<td>' + payload[i]['start_date_local'] + '</td>';
              str += '<td>' + payload[i]['distance'] + '</td>';
              str += '<td>' + payload[i]['elapsed_time'] + '</td>';
              //str += '<td>' + payload[i]['elev_high'] + '</td>';
              //str += '<td>' + payload[i]['elev_low'] + '</td>';
              str += '</tr>';
            }
            console.log(payload);
          }
          else {
              console.log(err);
          }
          str += '</table>';
          console.log(str);
        document.write(str);
      });