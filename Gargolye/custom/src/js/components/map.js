const GOOGLE_MAP = (function() {
  
  let map = null;
  let bounds = null;
  let markerCluster = null;

  function createElement(insertLocation) {
    let mapElement = document.createElement("div");
    mapElement.setAttribute("id", "map");
    mapElement.classList.add("googleMap");
    insertLocation.appendChild(mapElement);
  }

  function clearMap() {
    // document.getElementById("map").innerHTML = "";
    let mapElement = document.getElementById("map");
    if (mapElement) mapElement.remove();
    map = null;
  }


  function initMap(zoom = 10, center, markers) {
    map = new google.maps.Map(document.getElementById("map"), {
      zoom: zoom,
      center: center,
      maxZoom: 18,
      fullscreenControl: false,
      // mapTypeControl: false,
    });

    if (markers.latLngObj.length > 0) {
      markerArray = markers.latLngObj.map((location, i) => {
        return new google.maps.Marker({
          position: location
        })
      })

      markerArray.forEach((marker, i) => {
        let infoWindow = new google.maps.InfoWindow({
          content: markers.markerLabels[i]
        })
        marker.addListener('click', function() {
          infoWindow.open(marker.get('map'), marker)
        })
      })
      
      markerCluster = new MarkerClusterer(map, markerArray,
        {
          imagePath: '/webroot/dist/assets/icons/google_maps/m',
      });
    }
    map.fitBounds(bounds)
    map.panToBounds(bounds)
  }

  //Calculates the center of the map for two given points
  function calcCenter(pos1, pos2) {
    return google.maps.geometry.spherical.interpolate(pos1, pos2, 0.5);
  }
  
  function createBoundry(array) {
    bounds = new google.maps.LatLngBounds();
    array.forEach(pos => {
      bounds.extend(pos)
    })
  }

  function createLatLngObj(pos) {
    return new google.maps.LatLng(pos);
  }

  function createMarkerArray(array, markerLabels) {
    latLngObj = array.map(el => {
      return createLatLngObj(el);
    });

    return {
      latLngObj,
      markerLabels
    };
  }

  function createMarkerLabel(text) {
    let displayText = ""
    text.forEach(el => {
      displayText += el + "<br>"
    })
    return new google.maps.MarkerLabel({text: displayText})
  }

  return {
    initMap,
    clearMap,
    createElement,
    createMarkerArray,
    createMarkerLabel,
    createBoundry,
    calcCenter
  };
})();
