// All Earthquakes from the Past 7 Days
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson" 

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
  console.log(data)
});

// earthquakeData == data.features
function createFeatures(earthquakeData) {
  
    function radiusSize(magnitude) {
      return magnitude * 15000;   // meter
    }
    // circle color based on the magnitude
    function chooseColor(magnitude) {
      // switch (magnitude){
      //   case (magnitude < 1):
      //     return "#ccff33";
      //   case (magnitude < 2):
      //     return "#ffff33";
      //   case (magnitude < 3):
      //     return "#ffcc33";
      //   case (magnitude < 4):
      //     return "#ff9933";
      //   case (magnitude < 5):
      //     return "#ff6633";
      //   default:
      //     return "#ff3333";
      // }
      if (magnitude < 1) {
        return "#ccff33"
      }
      else if (magnitude < 2) {
        return "#ffff33"
      }
      else if (magnitude < 3) {
        return "#ffcc33"
      }
      else if (magnitude < 4) {
        return "#ff9933"
      }
      else if (magnitude < 5) {
        return "#ff6633"
      }
      else {
        return "#ff3333"
      }
    };

    // use circle to draw
    // var earthquakeMarkers = [];
    // for (var i = 0; i < earthquakeData.length; i++) {
    //   // Setting the marker radius for the state by passing population into the markerSize function
    //   // [earthquakeData[i].geometry.coordinates[1],earthquakeData[i].geometry.coordinates[0]]
    //   earthquakeMarkers.push(
    //     L.circle([earthquakeData[i].geometry.coordinates[1],earthquakeData[i].geometry.coordinates[0]],{
    //       stroke: false,
    //       fillOpacity: 0.5,
    //       color: "white",
    //       fillColor: chooseColor(earthquakeData[i].properties.mag),
    //       radius: radiusSize(earthquakeData[i].properties.mag)
    //     }).bindPopup("<h3>" + feature.properties.place +"</h3><hr><p>" +  new Date(feature.properties.time) + "</p>")
    //   );
    // }
    // console.log(earthquakeMarkers);
    // var earthquakesX = L.layerGroup(earthquakeMarkers);

    //how to zoom in????????
    function zoomToFeature(e) {
      // map.setView([e.latlng], 10);
      // map.fitBounds(e.target.getMaxZoom());
      map.fitBounds([event.latlng])
    };

    function X (e){
      map.setView(e.latlng, 1);
    };
    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function featureF(feature,layer) {
    // Set mouse events to change map styling
        // var info = L.control({position: 'bottomleft'});
        layer.on({
            mouseover: function(event) {
                layer = event.target;
                layer.setStyle({
                  fillOpacity: 0.8,
                });
                // try to update info?????
                // info.update(layer.feature.properties);
            },
            mouseout: function(event) {
                layer = event.target;
                layer.setStyle({
                  fillOpacity: 0.5
                });
                // try to update info?????
                // info.update();
            },
            click: function(event) {
                layer = event.target; 
                layer.setStyle({
                  weight: 2,
                  // dashArray: '',
                  fillOpacity: 1
                  // fillColor: 'red'
                });
                // try to zoomin when click?????????
                // zoomToFeature; //inside click
                // var latLngs = [event.target.getLatLng()];
                // var markerBounds = L.latLngBounds(latLngs);
                // myMap.fitBounds(markerBounds);
            }
        });
            // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
        layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" +  new Date(feature.properties.time) + "</p>");
    };
   
  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
                               
    var earthquakes = L.geoJSON(earthquakeData, {   //// feature array
      //Must use pointToLayer to make it circle, otherwise it will be marker
      pointToLayer: function(earthquakeData, latlng) {
        // why I can not use circleMarker !!!   circle has more function  
        return L.circle(latlng, {
          radius: radiusSize(earthquakeData.properties.mag),
          fillColor: chooseColor(earthquakeData.properties.mag),
          fillOpacity: 0.5,
          stroke: true,  //edge
          weight: 0.5,
          color: "red",
        });
      },
      onEachFeature: featureF
      // style: {
      //   "weight": 1,
      //   "opacity": 0.1
      // }
    });
    // Sending our earthquakes layer to the createMap function
    // addTo myMap
    createMap(earthquakes);
};//end createFeatures

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });
//mapbox
  var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "satellite-streets-v11",
    accessToken: API_KEY
  });

  var outdoormap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "outdoors-v11",
    accessToken: API_KEY
  });

  // Create the a new faultline layer!!!
  //The new operator lets developers create an instance of a user-defined object type or of one of the built-in object types that has a constructor function.
  var faultLine = new L.LayerGroup();

  // the faultline !!! must the raw data
  var faultlineUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";
  
  // Create the faultlines and add to the faultline layer
  d3.json(faultlineUrl, function(data) {
    L.geoJSON(data, {
      style: function() {
        return {color: "orange", fillOpacity: 0}
      }
    }).addTo(faultLine)
  })

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    'Satellite': satellitemap,    // key
    "Grayscale": lightmap,
    "Dark Map": darkmap,
    'Outdoors': outdoormap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    'Earthquakes': earthquakes,
    'Fault Lines': faultLine
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [satellitemap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

// zoomcenter and zoomin
  myMap.on('popupopen', function(centerMarker) {
    const zoomLvl = 6;
    var cM = myMap.project(centerMarker.popup._latlng);
    cM.y -= centerMarker.popup._container.clientHeight/zoomLvl
    myMap.setView(myMap.unproject(cM),zoomLvl, {animate: true});
  });

  function getColor(d) {
    return d > 5 ? '#ff3333' :   //return d === 'Road Surface'  ? "#de2d26" :
           d > 4  ? '#ff6633' :
           d > 3  ? '#ff9933' :
           d > 2  ? '#ffcc33' :
           d > 1  ? '#ffff33' :
                    '#ccff33';
  };

  // Add legend to the map
  var legend = L.control({position: 'bottomright'});
  
      legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend');
          mags = [0, 1, 2, 3, 4, 5],
          labels = ['<strong>Magnitude</strong><br><hr>'];
  
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < mags.length; i++) {
          div.innerHTML += labels.push(               //!!!! must <li>
              '<li style="background-color:' + getColor(mags[i] + 1) + '"></li> ' +
              mags[i] + (mags[i + 1] ? '&ndash;' + mags[i + 1] + '<br>' : '+'));
          }
          div.innerHTML = labels.join('');
  
      return div;
      };
  
  legend.addTo(myMap);


  var info = L.control({position: 'bottomleft'});

  info.onAdd = function (map) {
      this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
      this.update();
      return this._div;
  };
  // method that we will use to update the control based on feature properties passed
  info.update = function (props) {
    this._div.innerHTML = '<h4>Earthquakes from the Past 7 Days</h4>' //+  (props ?
        //'<b>' + props.place + '</b><br />' + props.mag + ' people / mi<sup>2</sup>'
        //: 'Hover over a state');
  };

  info.addTo(myMap);

}; // createmap

















  // Set up the legend
  // var legend = L.control({ position: "bottomright" });
  // legend.onAdd = function() {
  //   var div = L.DomUtil.create("div", "info legend");
  //   var limits = geojson.options.limits;
  //   var colors = geojson.options.colors;
  //   var labels = [];

  //   // Add min & max
  //   var legendInfo = "<h1>Median Income</h1>" +
  //     "<div class=\"labels\">" +
  //       "<div class=\"min\">" + limits[0] + "</div>" +
  //       "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
  //     "</div>";

  //   div.innerHTML = legendInfo;

  //   limits.forEach(function(limit, index) {
  //     labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
  //   });

  //   div.innerHTML += "<ul>" + labels.join("") + "</ul>";
  //   return div;
  // };

  

