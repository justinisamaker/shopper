document.addEventListener('DOMContentLoaded', function(){

  var _deviceId,
      _accessToken,
      _checkInterval = 60000;

  var _roomStatuses = {
    yin_yang: false,
    wayne_garth: false,
    laverne_shirley: false
  };

  // load local config
  function loadJSON(callback) {   
    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', '/js-src/deviceconf.json', true);
    xobj.onreadystatechange = function () {
      if (xobj.readyState == 4 && xobj.status == "200") {
        callback(xobj.responseText);
      }
     };
     xobj.send(null);  
  }

  // set our device id and access token for API calls
  loadJSON(function(response){
    var confResponse = JSON.parse(response);
    for(var i = 0, j = confResponse.devices.length; i<j; i++){
      _deviceId = confResponse.deviceId;
      _accessToken = confResponse.accessToken;
      montiorMotion(confResponse.devices[i].deviceName, confResponse.devices[i].deviceId, confResponse.devices[i].accessToken, i);
    }
  });

  // listen for motionDetected events 
  var montiorMotion = function(thisDeviceName, thisDeviceId, thisToken){
    var eventSource = new window.EventSource('https://api.spark.io/v1/devices/' + thisDeviceId + '/events/?access_token=' + thisToken);
  
    eventSource.addEventListener('motionDetected', function(e){
      var data = e.data;
      var obj = JSON.parse(data);
      var targetRoom = obj.data;

      // if a room is already active, dump the response, otherwise light up the detected room
      if(_roomStatuses[targetRoom] === false){
        _roomStatuses[targetRoom] = true;
        addHighlightMapRoom(targetRoom);
        updateRoomAvailability();

        // activate the room for x seconds until we check for motion again
        setTimeout(function(){
          removeHighlightMapRoom(targetRoom);
          _roomStatuses[targetRoom] = false;
        }, _checkInterval);
      }
    }, false);
  };

  // highlight the active room on the map
  var addHighlightMapRoom = function(targetRoom){
    document.getElementById(targetRoom).style.fill = "#F8CC01";
    document.getElementById('list_' + targetRoom).className ='active-room';
  };

  // remove the highlight of the active room on the map
  var removeHighlightMapRoom = function(targetRoom){
    document.getElementById(targetRoom).style.fill = "#039ED5";
    document.getElementById('list_' + targetRoom).className = 'inactive-room';
  };

  // highlight active rooms in the room list
  var updateRoomAvailability = function(){
    var activeRooms = document.getElementsByClassName('active-room');
    var roomList = document.getElementById('room_list');
    for(var i = 0; i < activeRooms.length; i++){
      // hide the reserve button
      activeRooms[i].childNodes[3].style.display = 'none';
      //show the occupied button
      activeRooms[i].childNodes[5].style.display = 'block';
    }
  };

  // listen for reserve click
  function clickReserve(){
    var reserveButtons = document.getElementsByClassName('reserve-button');
    for(var i = 0; i < reserveButtons.length; i++){
      reserveButtons[i].addEventListener('click', function(){
        this.parentNode.className = 'active-room';
        this.style.display = 'none';
      });
    }
  }

});

// document.getElementById('open-rooms').innerHTML = _openRooms;