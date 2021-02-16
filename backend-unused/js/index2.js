import { db } from "../backend-db/db.js";
import { createHTMLMapMarker } from "./map-marker-extend.js";
import { mapOptionsStatic } from "./map-options-static.js";
import { mapOptionsCover } from "./map-options-cover.js";
// import { searchForm } from "./search.js";

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

// window.addEventListener("resize", reportWindowSize);
// function reportWindowSize() {

//   var width =
//     window.innerWidth ||
//     document.documentElement.clientWidth ||
//     document.body.clientWidth;

//   var height =
//     window.innerHeight ||
//     document.documentElement.clientHeight ||
//     document.body.clientHeight;

//   console.log(width, height);
// }

// axios
//   .get("https://maps.googleapis.com/maps/api/directions/json", {
//     params: {
//       key: "AIzaSyCQUu01hvcUZo14XTn4dqKqW2sNG_fpGik",
//       mode: "walking",
//       origin: "Toronto",
//       destination: "Montreal",
//     },
//   })
//   .then(function (response) {
//     console.log(response);
//   })
//   .catch(function (e) {
//     console.log(e);
//   });

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

// // SWIPE SWIPE SWIPE SWIPE SWIPE SWIPE SWIPE SWIPE SWIPE SWIPE
// card.addEventListener("touchstart", handleTouchStart, false);
// card.addEventListener("touchmove", handleTouchMove, false);

// var xDown = null;
// var yDown = null;

// function getTouches(evt) {
//   return (
//     evt.touches || // browser API
//     evt.originalEvent.touches
//   ); // jQuery
// }

// function handleTouchStart(evt) {
//   const firstTouch = getTouches(evt)[0];
//   xDown = firstTouch.clientX;
//   yDown = firstTouch.clientY;
// }

// function handleTouchMove(evt) {
//   if (!xDown || !yDown) {
//     return;
//   }

//   var xUp = evt.touches[0].clientX;
//   var yUp = evt.touches[0].clientY;

//   var xDiff = xDown - xUp;
//   var yDiff = yDown - yUp;

//   if (Math.abs(xDiff) > Math.abs(yDiff)) {
//     /*most significant*/
//     if (xDiff > 0) {
//       /* left swipe */
//       console.log("left swipe");
//     } else {
//       /* right swipe */
//       console.log("right swipe");
//     }
//   } else {
//     if (yDiff > 0) {
//       /* up swipe */
//       console.log("up swipe");
//     } else {
//       /* down swipe */
//       console.log("down swipe");
//     }
//   }
//   /* reset values */
//   xDown = null;
//   yDown = null;
// }
// // SWIPE SWIPE SWIPE SWIPE SWIPE SWIPE SWIPE SWIPE SWIPE SWIPE

for (let city of db.cities) {
  let cityValue = city[4];
  let cityText =
    city[1] === city[2] || city[2].length === 0
      ? `${city[1]}, ${city[3]} [${city[4]}]`
      : `${city[1]}, ${city[2]}, ${city[3]} [${city[4]}]`;
  //   console.log(cityValue, cityText);
  let newNode = document.createElement("option");
  newNode.innerHTML = cityText;
  newNode.setAttribute("data-value", cityValue);
  //   console.log(newNode);
  document.getElementById("input-city-list").appendChild(newNode);
}

let defaultCheckIn = new Date().addDays(1).toString("yyyy-MM-dd");
let defaultCheckOut = new Date().addDays(2).toString("yyyy-MM-dd");
document.getElementById("input-checkin").value = defaultCheckIn;
document.getElementById("input-checkout").value = defaultCheckOut;
document.getElementById("input-checkin").min = defaultCheckIn;
document.getElementById("input-checkout").min = defaultCheckOut;

if (
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
) {
  // true for mobile device
  console.log("device: mobile");
  });
} else {
  // false for not mobile device
  console.log("device: desktop");
}

const map = new google.maps.Map(
  document.getElementById("map"),
  mapOptionsStatic
  // mapOptionsCover
);

let xCurrentView = map.getCenter().lng();
let yCurrentView = map.getCenter().lat();
let zoomCurrentView = map.getZoom();
let isCardMode_TimeInMS = null;
let markerHotelActive = null;

// Create hotel markers.
let markers = [];
for (let index in db.hotels) {
  let hotel = db.hotels[index];
  //   console.log(hotel);
  const latLng = new google.maps.LatLng(hotel[3], hotel[4]);
  markers[index] = createHTMLMapMarker({
    latlng: latLng,
    map: map,
    html: `
      <div id="hotel${hotel[0]}" class="marker">
          <div class="price">$${hotel[5]}</div>
          <div class="star"><img src="../svg/star.svg"></div>
          <div class="rating">${hotel[6].toFixed(1)}</div>
          <div class="reviews">(${
            Math.floor(hotel[7] / 20) > 99 ? 99 : Math.floor(hotel[7] / 20)
            //   hotel[7]
          })</div>
      </div>
    `,
  });
  //   markers[index].addListener("click", () => {});

  //   console.log(`hotel${hotel[0]}`);

  markers[index].addListener("click", () => {
    if (
      document.getElementById("card").getAttribute("class") === "card-inactive"
    ) {
      map.setOptions({
        gestureHandling: "none",
        zoomControl: false,
      });

      let newNode = document.createElement("div");
      newNode.innerHTML = `<div id="map-overlay"></div>`;
      document.getElementById("map").appendChild(newNode);

      // Save current map view.
      zoomCurrentView = map.getZoom();
      map.setZoom(18);
      xCurrentView = map.getCenter().lng();
      yCurrentView = map.getCenter().lat();

      console.log(
        `https://maps.googleapis.com/maps/api/directions/json?mode=walking&origin=${hotel[3]},${hotel[4]}&destination=1.303981012,103.8322417&key=AIzaSyCQUu01hvcUZo14XTn4dqKqW2sNG_fpGik`
      );
      let durationInMinutes = null;
      let distanceInKM = null;
      let directionsService = new google.maps.DirectionsService();
      let directionsDisplay = new google.maps.DirectionsRenderer({
        map: map,
        // preserveViewport: true,
        // suppressMarkers: true,
      });
      directionsDisplay.setMap(map);
      directionsService.route(
        {
          origin: `${hotel[3]},${hotel[4]}`,
          destination: "1.303981012,103.8322417", // nearest station
          travelMode: "WALKING",
        },
        function (response, status) {
          if (status === "OK") {
            // See the data in the console
            console.log(response);

            // Pass data to the map
            // directionsDisplay.setDirections(response);

            let durationTextArr = response.routes[0].legs[0].duration.text.split(
              " "
            );
            let distanceTextArr = response.routes[0].legs[0].distance.text.split(
              " "
            );
            durationInMinutes = durationTextArr[durationTextArr.length - 2];
            distanceInKM = distanceTextArr[distanceTextArr.length - 2];
            console.log(durationTextArr);
            console.log(distanceTextArr);
            console.log(durationInMinutes);
            console.log(distanceInKM);
            // directionsDisplay.setMap(null);
            // map.panTo({
            //   lat: response.routes[0].legs[0].start_location.lat(),
            //   lng: response.routes[0].legs[0].start_location.lng(),
            // });
          } else {
            window.alert("Directions request failed due to " + status);
          }
        }
      );

      // Get window dimensions.
      let xPxWidth =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
      let yPxHeight =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight;
      console.log("xPxWidth: " + xPxWidth);
      console.log("yPxHeight: " + yPxHeight);

      let xGeoLeft = map.getBounds().Qa.i;
      let xGeoRight = map.getBounds().Qa.j;
      let yGeoTop = map.getBounds().Va.i;
      let yGeoBottom = map.getBounds().Va.j;
      console.log(xGeoLeft);
      console.log(xGeoRight);
      console.log(yGeoTop);
      console.log(yGeoBottom);

      let xGeoWidth = xGeoRight - xGeoLeft;
      let yGeoHeight = yGeoBottom - yGeoTop;
      console.log("xGeoWidth: " + xGeoWidth);
      console.log("yGeoHeight: " + yGeoHeight);

      let xGeoHotel = hotel[4];
      let yGeoHotel = hotel[3];
      console.log("xGeoHotel: " + xGeoHotel);
      console.log("yGeoHotel: " + yGeoHotel);

      let xPxMarginLeft = 10;
      let yPxMarginTop = 10;
      let xPxMarkerWidth = 52;
      let yPxMarkerHeight = 36;
      let yPxMarkerPad = 5;
      let xPxMarkerNameWidth = 50;
      let xPxMarkerNamePad = 5;

      let yPxOffset =
        yPxHeight / 2 - yPxMarginTop - yPxMarkerHeight / 2 - yPxMarkerPad;
      let xPxOffset = xPxWidth / 2 - xPxMarginLeft - xPxMarkerWidth / 2;
      console.log("yPxOffset: " + yPxOffset);

      let xPxGeoRatio = xPxWidth / xGeoWidth;
      let yPxGeoRatio = yPxHeight / yGeoHeight;
      console.log("xPxGeoRatio: " + xPxGeoRatio);
      console.log("yPxGeoRatio: " + yPxGeoRatio);

      let xGeoOffset = xPxOffset / xPxGeoRatio;
      let yGeoOffset = yPxOffset / yPxGeoRatio;
      console.log("xGeoOffset: " + xGeoOffset);
      console.log("yGeoOffset: " + yGeoOffset);

      let xPxOffsetName =
        xPxMarkerWidth / 2 + xPxMarkerNamePad + xPxMarkerNameWidth / 2;
      let xGeoOffsetName = xPxOffsetName / xPxGeoRatio;
      console.log("xGeoOffsetName: " + xGeoOffsetName);

      // console.log("xWidth: " + xWidth);
      // let xOffset = xWidth * 0.35;

      // let yHeightBox = 34;

      // console.log("yHeight: " + yHeight);
      // let yRatio = winHeight / yHeight;
      // console.log(yRatio);
      // let yWinOffset = winHeight / 2 - 10 - yHeightBox / 2;
      // console.log(yWinOffset);
      // let yGeoOffset = yWinOffset / yRatio;
      // console.log(yGeoOffset);

      // let yOffset = yHeight * 0.35;

      console.log(hotel);
      console.log(document.getElementById(`hotel${hotel[0]}`));
      document
        .getElementById(`hotel${hotel[0]}`)
        .setAttribute("class", "marker-selected");
      map.panTo({ lat: yGeoHotel - yGeoOffset, lng: xGeoHotel + xGeoOffset });

      // Create selected hotel name marker.
      let latLngName = new google.maps.LatLng(
        hotel[3],
        hotel[4] + xGeoOffsetName
      );

      // <div class="name">${hotel[1]}</div>
      // sleep(1000);
      markerHotelActive = createHTMLMapMarker({
        latlng: latLngName,
        map: map,
        html: `
          <div id="marker-hotel-selected" class="marker-hotel-header">
              <div class="name">Hotel Clover 5 Hong Kong Street</div>
              <div class="nearest"><strong class="station">Marina South Pier MRT Station</strong> | 23.1 km | 15m-walk</div>
          </div>
          `,
      });

      // document
      //   .getElementById("hotel-name")
      //   .setAttribute("class", "marker-hotel visible-fadeIn");

      // map.panTo({ lat: yHotel - yGeoOffset, lng: xHotel + xOffset });
      // map.panTo({ lat: yHotel - yOffset, lng: xHotel + xOffset });
      // sleep(5000);
      document.getElementById("card").setAttribute("class", "card-active");
      isCardMode_TimeInMS = Date.now();
      console.log(document.getElementById("card").getAttribute("class"));

      let nodePhotoList = document.getElementById("photo-list");
      let nodePhotoImg = document.getElementById("photo-img");

      // Add photos.
      const maxPhotos = 16;
      let numPhotosToDisplay = Math.min(maxPhotos, hotel[9].length);
      console.log(numPhotosToDisplay);
      for (let i = 0; i < maxPhotos; i++) {
        console.log(hotel[9][i]);

        let newNodeLi = document.createElement("li");
        newNodeLi.setAttribute("data-target", "#photo-carousel");
        newNodeLi.setAttribute("data-slide-to", i);
        if (i === 0) newNodeLi.setAttribute("class", "active");
        nodePhotoList.appendChild(newNodeLi);

        let newNodeDiv = document.createElement("div");
        newNodeDiv.setAttribute("class", i === 0 ? "item active" : "item");
        let newNodeImg = document.createElement("img");
        newNodeImg.setAttribute("src", hotel[9][i]);
        newNodeDiv.appendChild(newNodeImg);
        nodePhotoImg.appendChild(newNodeDiv);
      }

      console.log(hotel);
    }
  });
}

map.addListener("click", () => {
  if (Date.now() >= isCardMode_TimeInMS + 1000) {
    if (
      document.getElementById("card").getAttribute("class") === "card-active"
    ) {
      document.getElementById("card").setAttribute("class", "card-inactive");
      document
        .getElementsByClassName("marker-selected")[0]
        .setAttribute("class", "marker");
      console.log(document.getElementById("map").lastChild);
      // let nodeToRemove = document.getElementById("map-overlay");
      document
        .getElementById("map")
        .removeChild(document.getElementById("map").lastChild);
      markerHotelActive.setMap(null);
      map.setZoom(zoomCurrentView);
      map.panTo({ lat: yCurrentView, lng: xCurrentView });
      map.setOptions({
        gestureHandling: "auto",
        zoomControl: true,
      });

      let nodePhotoList = document.getElementById("photo-list");
      let nodePhotoImg = document.getElementById("photo-img");

      // Clear photos.
      removeAllChildNodes(nodePhotoList);
      removeAllChildNodes(nodePhotoImg);
      console.log(nodePhotoList);
      console.log(nodePhotoImg);

      console.log(document.getElementById("card").getAttribute("class"));
    }
  }
});

let city = null;
let countryCode = null;
document
  .getElementById("input-city")
  .addEventListener("change", function (event) {
    // console.log(document.getElementById("input-city"));
    city = document.getElementById("input-city").value;
    if (city.length >= 4) {
      if (city[city.length - 4] === "[" && city[city.length - 1] === "]") {
        // console.log(`${city[city.length - 3]}${city[city.length - 2]}`);
        countryCode = `${city[city.length - 3]}${city[city.length - 2]}`;
      }
    }
    // console.log("xx" + city);
    // console.log("xx" + countryCode);

    // Check city to populate stations from.
    let stations = null;
    if (countryCode === "SG" || city.toLowerCase().includes("singapore"))
      stations = db.stations_singapore;
    if (countryCode === "CA" || city.toLowerCase().includes("vancouver"))
      stations = db.stations_vancouver;

    // Remove existing stations.
    let stationList = document.getElementById("input-location-station-list");
    let options = stationList.getElementsByTagName("option");
    for (let i = options.length - 1; i >= 0; i--) {
      stationList.removeChild(options[i]);
    }

    // Populate train stations.
    if (stations) {
      for (let station of stations) {
        let stationValue = station[0];
        let stationText = `${station[1]} [${station[2]}]`;
        //   console.log(stationValue, stationText);
        let newNode = document.createElement("option");
        newNode.innerHTML = stationText;
        newNode.setAttribute("data-value", stationValue);
        //   console.log(newNode);
        document
          .getElementById("input-location-station-list")
          .appendChild(newNode);
      }
    }
  });

let searchForm = document.getElementById("form-search");
searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  let locationStation = document.getElementById("input-location-station").value;
  locationStation = locationStation.length === 0 ? null : locationStation;

  //   console.log(locationStation);

  city = document.getElementById("input-city").value;
  let searchTerm = null;
  let component = countryCode ? `country:${countryCode}` : null;
  if (locationStation === null && countryCode === null) searchTerm = city;
  if (locationStation === null && countryCode !== null) searchTerm = city;
  if (locationStation !== null && countryCode === null)
    searchTerm = `${city} ${locationStation}`;
  if (locationStation !== null && countryCode !== null)
    searchTerm = `${city} ${locationStation}`;
  //   console.log(`${locationStation}, ${city}`);
  //   console.log(countryCode);
  // console.log("searchTerm: " + searchTerm);
  //   console.log("component: " + component);

  axios
    .get("https://maps.googleapis.com/maps/api/geocode/json", {
      params: {
        address: searchTerm,
        key: "AIzaSyCQUu01hvcUZo14XTn4dqKqW2sNG_fpGik",
        components: component,
      },
    })
    .then(function (response) {
      let formattedAddress = response.data.results[0].formatted_address;
      let location = response.data.results[0].geometry.location;
      // document.getElementById("search-term").innerHTML =
      //   "searchTerm:" + searchTerm;
      // document.getElementById("search-component").innerHTML =
      //   "component:" + component;
      // document.getElementById("formatted-address").innerHTML =
      //   "formattedAddress:" + formattedAddress;
      // document.getElementById("latitude").innerHTML =
      //   "location.lat:" + location.lat;
      // document.getElementById("longitude").innerHTML =
      //   "location.lng:" + location.lng;
      map.setCenter(location);
      map.setZoom(17);

      console.log("MAP-MODE");
      document.getElementById("top").setAttribute("class", "map-mode");
      document.getElementById("footer").setAttribute("class", "map-mode");
      document.getElementById("back").setAttribute("class", "map-mode");

      document.getElementById("main").setAttribute("class", "main-show");
      document
        .getElementById("search-box")
        .setAttribute("class", "search-hide");

      document
        .getElementById("search-bar")
        .setAttribute("class", "search-bar-show");

      // document.getElementById("card-text-size").setScaledFont = function (f) {
      //   var s = this.offsetWidth,
      //     fs = s * f;
      //   this.style.fontSize = fs + "%";
      //   return this;
      // };

      // document.getElementById("card-text-size").setScaledFont(0.35);
      // window.onresize = function () {
      //   console.log("RESIZED");
      //   document.body.setScaledFont(0.35);
      // };
    })
    .catch(function (e) {
      console.log(e);
    });
});

// document.getElementById("search-button").click();
// sleep(2000);
// document.getElementById("hotel23").click();
