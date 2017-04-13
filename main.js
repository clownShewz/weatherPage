$( document ).ready(function(){

    console.log('ready');
    var weatherType = 'currently';
    setActionButton('current');
    var weatherData = "";

    //teet button
    //$('#tweet').attr('href','https://twitter.com/intent/tweet?text=' );

    //change weather display
    $('#action').on('click',function() {
            setActionButton(weatherType);
        });


    var display = function(type,data){

       var displayText ="";

        console.log('current' + data);
        //TODO: ADD FUNCITON TO SPLIT SUMMARY TEXT WITH A NEWLINE
        switch(type){
            case 'current':
                displayText = '<div class="card"> <div class="card-block">'
                displayText += convertTime('date',data.currently.time) + '</br>' + 'Temp: ' + data.currently.temperature + '<br>' + 'Rain: ' +cleanPct(data.currently.precipProbability) +'\%<br>' + data.currently.summary;
                displayText += '</div><div id="icon"></div></div>';
                displayText += '</br>';
                displayText += '<i class="'+ mapIcon(data.currently.icon) +'"></i>';
                $("p").html(displayText);
                break;

            case 'daily':
                displayText = '<div class=row>';
                data.daily.data.slice(0,5).map(function(d,i) {
                    displayText += '<div class="card"> <div class="card-block" style="width:100%">'
                        //+'<span class="cneter-text"> ' + mapIcon(d.icon) +'</span><br>'
                        + convertTime('date',d.time) + '</br>' + 'Avg Temp: ' + Math.round((d.temperatureMax + d.temperatureMin) / 2, 2) + '<br>' + 'Rain: ' + cleanPct(d.precipProbability)+'\%<br><span class="small-font">' + splitDetails(d.summary)
                        + '</span>' + '</div><div id="icon' +i +'"></div></div>';
                    displayText += '<i class="'+ mapIcon(d.icon) +'"></i>';
                });

                    $("p").html(displayText + '</div>');

                    break;

            case 'hourly':
                    displayText = '<div class=row>';

                    data.hourly.data.slice(0,6).map(function(d) {
                            displayText += '<div class="card"> <div class="card-block" style="width:100%">'
                                //+'<span class="cneter-text"> ' + mapIcon(d.icon) +'</span><br>'
                                + convertTime('time',d.time) + '</br>' + 'Temp: ' + d.temperature + '<br>' + 'Rain: ' + cleanPct(d.precipProbability )+'\%<br>' + splitDetails(d.summary)
                         + '</div></div>'});
                            displayText += '<i class="'+ mapIcon(d.icon) +'"></i>';

                    $("p").html(displayText + '</div>');

            case 'alerts':
                    displayText = '<div class="row alert"><p>'+ data.alerts.title +'</p>';
                    displayText +='</br><p>'+ data.alerts.description +'</p>';
                    displayText +='</br><a href="' + data.alerts.url+ '"></a></div>'
            case 'error':
                    $("p").html('An error retrieving weather data for your area has occurred. Please try refreshing the page' );
                    break;

            };

    };

    //get current weather and store it.
    function getWeather (type){
        console.log('getting weather...');
        $('#spinner').show("slow");
        navigator.geolocation.getCurrentPosition(function(userLocation) {
                //$.getJSON('http://localhost:3030/weather/' + userLocation.coords.latitude + "," + userLocation.coords.longitude, function (data){
                $.getJSON('https://zvr6zr7so8.execute-api.us-east-1.amazonaws.com/beta/weather/' + userLocation.coords.latitude + "," +userLocation.coords.longitude , function (data) {
                    console.log(data);
                    //if(data.alerts.length>1) {
                   //     displayAlert('alert',data,display);
                   // }
                   // else{
                        display(type,data);

                }).fail(function(){
                    $('#spinner').hide("fast");
                    console.log('error getting weather data');
                    display('error',null);
                }).done(function(){
                    $('#spinner').hide("fast");
                });
        });
    };

    function convertTime(type,time){
        d = new Date(0);
        d.setSeconds(time);
        if (type == 'time'){
            return d.toLocaleTimeString();
        }else if(type=='date'){
            return d.toDateString();
        }

    }

    function cleanPct(pctToClean){
        pctToClean *= 100;
        return Math.floor(pctToClean);

    }

    function displayAlert(type,data,cb){
        display('alert',data);
        cb(type,data);
    }

    function splitDetails(details){
        var newDetails = details.split(" ");

        for(var i=0; i<newDetails.length; i+5){
            newDetails.splice(i,0,'</br>');
        }

        return newDetails.join(" ");

    }

    function setActionButton(display){
         switch(display){
             case 'current':
                $('#action').html('Display Daily');
                 weatherType = 'daily';
                 getWeather('current', display);
               break;
             case 'daily':
                 $('#action').html('Display Hourly');
                 weatherType = 'hourly';
                 getWeather('daily', display);
                 break;
             case 'hourly':
                 $('#action').html('Display Current');
                 weatherType = 'current';
                 getWeather('hourly', display);
                 break;
          }
    };

    function mapIcon(icon){
        //map icon value from api to icon library
        console.log(icon);
        var iconName ="";
        switch(icon) {
            case 'clear-day':
                iconName="fa-sun-o fa-4x";
                break;
            case 'clear-night':
                iconName="fa fa-moon-o fa-4x";
                break;
            case 'snow':
                iconName  = "fa fa-snowflake-o fa-4x";
                break;
            case 'rain':
                iconName="fa fa-umbrella fa-4x";
                break;
            case 'sleet':
                iconName="fa fa-umbrella fa-4x";
                break;
            case 'wind':
                iconName="fa fa-cloud fa-4x";
                break;
            case 'fog':
                iconName = "fa fa-low-vision fa-4x";
                break;
            case 'cloudy':
                iconName="fa fa-cloud fa-4x";
                break;
            case 'partly-cloudy-day':
                iconName = "fa fa-cloud fa-4x";
                break;
            case 'partly-cloudy-night':
                iconName ="fa fa-cloud fa-4x";
                break;
            case 'hot':
                iconName="fa fa-thermometer-full fa-4x";
                break;
            case 'cold':
                iconName = "fa fa-thermometer-empty fa-4x";
                break;
            default:
                iconName = "fa fa-thermometer-half fa-4x";
                break;
            }
             return iconName;
        };







});