import { db } from "../backend-db/db.js";
import { createHTMLMapMarker } from "./map-marker-extend.js";
import { mapOptionsCover } from "./map-options-cover.js";
import { mapOptionsStatic } from "./map-options-static.js";
import {
  deviceIsMobile,
  isPortraitMode,
  removeAllChildNodes,
  getWindowSize,
  getElementSizeByID,
  getMapBounds,
  getGeoOffset,
} from "./functions.js";

// console.log("deviceIsMobile():", deviceIsMobile());
// console.log("isPortraitMode():", isPortraitMode());

// window.addEventListener("orientationchange", () => {
//   console.log(window.innerHeight, window.innerWidth);
//   if (window.innerHeight > window.innerWidth) {
//     document
//       .getElementById("mobile-landscape-mode")
//       .setAttribute("class", "mobile-landscape-mode-active");
//   } else {
//     document
//       .getElementById("mobile-landscape-mode")
//       .setAttribute("class", "mobile-landscape-mode-inactive");
//   }
// });

$(document).ready(function () {
  $('[data-toggle="popover"]').popover();
});

// --------  -------- COVER STUFF - SHOW CITY IN MAP -------- -------- //

// Set constants.
const coverZoom = 2;
const coverCenter = { lat: 0, lng: 30 };

// Set initials.
let mode = "COVER";
console.log("mode", mode);
let device = deviceIsMobile() ? "MOBILE" : "DESKTOP";
let winSize = getWindowSize();
console.log("device:", device);
console.log("mode:", mode);
console.log("winSize:", winSize);
console.log("getElementSizeByID():", getElementSizeByID("back"));

// Landscape mode.
if (device === "MOBILE") {
  if (window.innerHeight < window.innerWidth)
    document
      .getElementById("mobile-landscape-mode")
      .setAttribute("class", "mobile-landscape-mode-active");

  // Add listener for landscape mode.
  window.addEventListener("orientationchange", () => {
    console.log(window.innerHeight, window.innerWidth);
    if (window.innerHeight > window.innerWidth) {
      document
        .getElementById("mobile-landscape-mode")
        .setAttribute("class", "mobile-landscape-mode-active");
    } else {
      document
        .getElementById("mobile-landscape-mode")
        .setAttribute("class", "mobile-landscape-mode-inactive");
    }
  });
}

// Create mapC for COVER.
const mapC = new google.maps.Map(
  document.getElementById("back"),
  mapOptionsCover
);
mapC.panTo(coverCenter);
mapC.setZoom(coverZoom);

// Zooms to city on cover map.
let markerCity = null;
document
  .getElementById("input-city")
  .addEventListener("change", function (event) {
    // Set map to center on the city typed (only for DESKTOP).
    if (device === "DESKTOP" && mode === "COVER") {
      if (markerCity !== null) markerCity.setMap(null);

      let inputCity = document.getElementById("input-city").value;
      console.log(inputCity);
      let cityFromDB = null;
      if (inputCity !== "") {
        for (let city of db.cities) {
          if (
            `${city[3]} [${city[4]}]`
              .toLowerCase()
              .includes(inputCity.toLowerCase())
          ) {
            cityFromDB = city;
          } else {
          }
        }
        console.log("cityFromDB: ", cityFromDB);
      }

      if (cityFromDB !== null) {
        mapC.setZoom(5);

        // CALC START.

        let xMarginLeft = 100;
        let xSizeSearchBox = 340;
        let xPadLeft = xMarginLeft + xSizeSearchBox;

        let geo = getMapBounds(mapC);
        let xGeoLeft = geo.xGeoLeft;
        let xGeoRight = geo.xGeoRight;
        let box = getElementSizeByID("back");
        let xWidth = box.width;
        let xGeoWidth = Math.abs(xGeoRight - xGeoLeft);

        let xGeoOffset = getGeoOffset(xPadLeft, 0, xWidth, xGeoWidth);

        // CALC END.

        mapC.panTo({ lat: cityFromDB[1], lng: cityFromDB[2] - xGeoOffset });
        markerCity = createHTMLMapMarker({
          latlng: new google.maps.LatLng(cityFromDB[1], cityFromDB[2]),
          map: mapC,
          html: `
            <div class="marker-cover"></div>
            `,
        });
      } else {
        mapC.panTo(coverCenter);
        mapC.setZoom(coverZoom);
      }
    }
  });

// for (let city of db.cities) {
//   let xGeo = city[2];
//   let yGeo = city[1];
//   console.log(xGeo, yGeo);

// }

// window.addEventListener("resize", getWindowSize);

// --------  -------- SEARCH STUFF - POPULATE CITIES -------- -------- //

// Populate cities in dropdown.
for (let city of db.cities) {
  let cityValue = city[3];
  let cityText = `${city[3]} [${city[4]}]`;
  //   console.log(cityValue, cityText);
  let newNodeOption = document.createElement("option");
  newNodeOption.innerHTML = cityText;
  newNodeOption.setAttribute("data-value", cityValue);
  //   console.log(newNode);
  document.getElementById("input-city-list").appendChild(newNodeOption);
}

// --------  -------- SEARCH STUFF - POPULATE STATIONS IF SINGAPORE OR VANCOUVER -------- -------- //

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
    console.log("xx" + city);
    console.log("xx" + countryCode);

    // Check city to populate stations from.
    let stations = null;
    if (countryCode === "SG" || city.toLowerCase().includes("singapore"))
      stations = db.stations_singapore;
    if (countryCode === "CA" || city.toLowerCase().includes("vancouver"))
      stations = db.stations_vancouver;
    console.log(stations);

    // Remove existing stations.
    let stationList = document.getElementById("input-location-station-list");
    let options = stationList.getElementsByTagName("option");
    for (let i = options.length - 1; i >= 0; i--) {
      stationList.removeChild(options[i]);
    }

    // Remove existing text.
    document.getElementById("input-location-station").value = "";

    // Populate train stations.
    if (stations) {
      for (let station of stations) {
        let stationValue = station[0];
        let stationText = `${station[1]} [${station[2]}]`;
        //   console.log(stationValue, stationText);
        let newOptionNode = document.createElement("option");
        newOptionNode.innerHTML = stationText;
        newOptionNode.setAttribute("data-value", stationValue);
        // console.log(newOptionNode);
        document
          .getElementById("input-location-station-list")
          .appendChild(newOptionNode);
      }
    }
  });

// --------  -------- SEARCH STUFF - SUBMIT -------- -------- //

let defaultCheckIn = new Date().addDays(1).toString("yyyy-MM-dd");
let defaultCheckOut = new Date().addDays(2).toString("yyyy-MM-dd");
document.getElementById("input-checkin").value = defaultCheckIn;
document.getElementById("input-checkout").value = defaultCheckOut;
document.getElementById("input-checkin").min = defaultCheckIn;
document.getElementById("input-checkout").min = defaultCheckOut;

// Set constants.
const mapZoom = 16;

// Create main map.
const map = new google.maps.Map(
  document.getElementById("map"),
  mapOptionsStatic
);

let isCardMode_TimeInMS = null;
let markerHotelActive = null;

let xCurrentView = null;
let yCurrentView = null;
let zoomCurrentView = null;

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
      map.setZoom(mapZoom);
      markerCity = createHTMLMapMarker({
        latlng: new google.maps.LatLng(location),
        map: map,
        html: `
          <div class="marker-center"></div>
          `,
      });

      // Create hotel markers.
      let markers = [];

      let budget = document.getElementById("select-budget").value;
      let budgetMin = null;
      let budgetMax = null;
      if (budget === "100") {
        budgetMin = 0;
        budgetMax = 200;
      } else if (budget === "200") {
        budgetMin = 100;
        budgetMax = 400;
      } else if (budget === "400") {
        budgetMin = 200;
        budgetMax = 600;
      } else if (budget === "600") {
        budgetMin = 400;
        budgetMax = 800;
      } else if (budget === "800") {
        budgetMin = 600;
        budgetMax = 1000;
      } else {
        budgetMin = 0;
        budgetMax = 1000000;
      }
      console.log("budgetMin", budgetMin);
      console.log("budgetMax", budgetMax);

      for (let index in db.hotels) {
        let hotel = db.hotels[index];
        if (hotel[5] >= budgetMin && hotel[5] < budgetMax) {
          //

          //   console.log(hotel);
          const latLng = new google.maps.LatLng(hotel[3], hotel[4]);
          markers[index] = createHTMLMapMarker({
            latlng: latLng,
            map: map,
            html: `
          <div id="hotel${hotel[0]}" class="marker">
              <div class="price">$${hotel[5]}</div>
              <div class="star"><img src="svg/star.svg"></div>
              <div class="rating">${hotel[6].toFixed(1)}</div>
              <div class="reviews">(${
                Math.floor(hotel[7] / 20) > 99 ? 99 : Math.floor(hotel[7] / 20)
                //   hotel[7]
              })</div>
          </div>
        `,
          });

          // Add marker listeners for hotels.
          markers[index].addListener("click", () => {
            if (mode === "MAP") {
              // Make map unmovable.
              map.setOptions({
                gestureHandling: "none",
                zoomControl: false,
              });

              // Overlay dark background for map.
              let newNode = document.createElement("div");
              newNode.innerHTML = `<div id="map-overlay"></div>`;
              document.getElementById("map").appendChild(newNode);

              // Save current map view.
              xCurrentView = map.getCenter().lng();
              yCurrentView = map.getCenter().lat();
              zoomCurrentView = map.getZoom();

              // Zoom in.
              map.setZoom(18);

              // Shift map to center marker.
              let xGeoHotel = hotel[4];
              let yGeoHotel = hotel[3];
              let xMarginRight = 20; // For desktop.
              let yMarginBottom = 30; // For mobile.
              let xSizeHotelBox = 500; // For desktop.
              let ySizeHotelBox = 540; // For mobile.
              let xPadRight = xMarginRight + xSizeHotelBox;
              let yPadBottom = yMarginBottom + ySizeHotelBox;
              let geo = getMapBounds(map);
              let xGeoLeft = geo.xGeoLeft;
              let yGeoTop = geo.yGeoTop;
              let xGeoRight = geo.xGeoRight;
              let yGeoBottom = geo.yGeoBottom;
              let box = getElementSizeByID("map");
              let xWidth = box.width;
              let yHeight = box.height;
              let xGeoWidth = Math.abs(xGeoRight - xGeoLeft);
              let yGeoHeight = Math.abs(yGeoTop - yGeoBottom);

              let xGeoOffset = getGeoOffset(0, xPadRight, xWidth, xGeoWidth);
              let yGeoOffset = getGeoOffset(0, yPadBottom, yHeight, yGeoHeight);

              document
                .getElementById(`hotel${hotel[0]}`)
                .setAttribute("class", "marker-selected");
              if (device === "MOBILE") {
                map.panTo({
                  lat: yGeoHotel + yGeoOffset,
                  lng: xGeoHotel,
                });
              } else {
                map.panTo({
                  lat: yGeoHotel,
                  lng: xGeoHotel - xGeoOffset,
                });
              }

              // Get nearest station.
              let stations = db.stations_singapore;

              let stationNearest = null;
              let distNearest = null;
              let durationInMinutes = null;
              let distanceInKM = null;
              for (let station of stations) {
                let dist = Math.pow(
                  Math.abs(station[4] - hotel[3]) +
                    Math.abs(station[5] - hotel[4]),
                  2
                );
                if (distNearest === null || distNearest > dist) {
                  distNearest = dist;
                  stationNearest = station;
                }
              }
              console.log(stationNearest);

              // Get directions to nearest station.
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
                  destination: `${stationNearest[4]},${stationNearest[5]}`, // nearest station
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
                    durationInMinutes =
                      durationTextArr[durationTextArr.length - 2];
                    distanceInKM = distanceTextArr[distanceTextArr.length - 2];
                    console.log(durationTextArr);
                    console.log(distanceTextArr);
                    // directionsDisplay.setMap(null);
                    // map.panTo({
                    //   lat: response.routes[0].legs[0].start_location.lat(),
                    //   lng: response.routes[0].legs[0].start_location.lng(),
                    // });

                    // Create selected hotel name marker.
                    // let latLngName = new google.maps.LatLng(
                    //   hotel[3],
                    //   hotel[4] + xGeoOffsetName
                    // );

                    console.log(durationInMinutes);
                    console.log(distanceInKM);
                    // markerHotelActive = createHTMLMapMarker({
                    //   latlng: latLngName,
                    //   map: map,
                    //   html: `
                    //   <div id="marker-hotel-selected" class="marker-hotel-header">
                    //       <div class="name">${hotel[1]}</div>
                    //       <div class="nearest"><strong class="station">${stationNearest[1]}</strong> | ${distanceInKM} km | ${durationInMinutes}m-walk</div>
                    //       <div id="directions-icon"></div>
                    //   </div>
                    //   `,
                    // });
                    document
                      .getElementById("name-distance")
                      .getElementsByClassName(
                        "name"
                      )[0].innerHTML = `${hotel[1]}`;
                    document
                      .getElementById("name-distance")
                      .getElementsByClassName(
                        "nearest"
                      )[0].innerHTML = `<strong class="station">${stationNearest[1]}</strong> | ${distanceInKM} km | ${durationInMinutes}m-walk`;
                    document
                      .getElementById("card")
                      .setAttribute("class", "card-active");
                    isCardMode_TimeInMS = Date.now();
                    mode = "CARD";
                    // document
                    //   .getElementById("marker-cursor-block")
                    //   .setAttribute("class", "marker-cursor-block-active");
                    // document
                    //   .getElementById("marker-hotel-cursor-block")
                    //   .setAttribute(
                    //     "class",
                    //     "marker-hotel-cursor-block-active"
                    //   );
                    console.log("mode:" + mode);

                    let nodePhotoList = document.getElementById("photo-list");
                    let nodePhotoImg = document.getElementById("photo-img");

                    // Add photos.
                    const maxPhotos = 16;
                    let numPhotosToDisplay = Math.min(
                      maxPhotos,
                      hotel[9].length
                    );
                    console.log(numPhotosToDisplay);
                    for (let i = 0; i < maxPhotos; i++) {
                      // console.log(hotel[9][i]);

                      let newNodeLi = document.createElement("li");
                      newNodeLi.setAttribute("data-target", "#photo-carousel");
                      newNodeLi.setAttribute("data-slide-to", i);
                      if (i === 0) newNodeLi.setAttribute("class", "active");
                      nodePhotoList.appendChild(newNodeLi);

                      let newNodeDiv = document.createElement("div");
                      newNodeDiv.setAttribute(
                        "class",
                        i === 0 ? "item active" : "item"
                      );
                      let newNodeImg = document.createElement("img");
                      newNodeImg.setAttribute("src", hotel[9][i]);
                      newNodeDiv.appendChild(newNodeImg);
                      nodePhotoImg.appendChild(newNodeDiv);
                    }

                    // Add listener for directions.
                    // console.log(document.getElementById("directions-icon"));
                    // document
                    //   .getElementById("directions-icon")
                    //   .addListener("click", () => {
                    //     console.log("Directionsss");
                    //   });
                  } else {
                    window.alert("Directions request failed due to " + status);
                  }
                }
              );
            }
          });
        }
      }
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

      mode = "MAP";
      console.log("mode", mode);
    })
    .catch(function (e) {
      console.log(e);
    });
});

// GO BACK TO MAP MODE LISTENER.
map.addListener("click", () => {
  console.log(document.getElementById("directions-icon"));
  console.log(isCardMode_TimeInMS);
  if (Date.now() >= isCardMode_TimeInMS + 1000) {
    if (mode === "CARD") {
      document.getElementById("card").setAttribute("class", "card-inactive");
      document
        .getElementsByClassName("marker-selected")[0]
        .setAttribute("class", "marker");
      console.log(document.getElementById("map").lastChild);
      // let nodeToRemove = document.getElementById("map-overlay");
      document
        .getElementById("map")
        .removeChild(document.getElementById("map").lastChild);
      // markerHotelActive.setMap(null);
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
      mode = "MAP";
      console.log("mode:" + mode);
      // document
      //   .getElementById("marker-cursor-block")
      //   .setAttribute("class", "marker-cursor-block-inactive");
      // document
      //   .getElementById("marker-hotel-cursor-block")
      //   .setAttribute("class", "marker-hotel-cursor-block-inactive");
    }
  }
});

// function showdirections(hotelIndex, stationIndex) {
//   console.log(">>" + hotelIndex, stationIndex);
// }

document.getElementById("button-policies").addEventListener("click", () => {
  if (
    document.getElementById("button-policies").getAttribute("class") ===
    "details-button details-button-policies-inactive"
  ) {
    document
      .getElementById("button-policies")
      .setAttribute("class", "details-button details-button-policies-active");
    document
      .getElementById("details-policies")
      .setAttribute("class", "details-content details-policies-active");
    document
      .getElementById("button-info")
      .setAttribute("class", "details-button details-button-info-inactive");
    document
      .getElementById("details-info")
      .setAttribute("class", "details-content details-info-inactive");
    document
      .getElementById("button-faq")
      .setAttribute("class", "details-button details-button-faq-inactive");
    document
      .getElementById("details-faq")
      .setAttribute("class", "details-content details-faq-inactive");
    document
      .getElementById("button-reviews")
      .setAttribute("class", "details-button details-button-reviews-inactive");
    document
      .getElementById("details-reviews")
      .setAttribute("class", "details-content details-reviews-inactive");
  } else {
    document
      .getElementById("button-policies")
      .setAttribute("class", "details-button details-button-policies-inactive");
    document
      .getElementById("details-policies")
      .setAttribute("class", "details-content details-policies-inactive");
  }
});

document.getElementById("button-info").addEventListener("click", () => {
  if (
    document.getElementById("button-info").getAttribute("class") ===
    "details-button details-button-info-inactive"
  ) {
    document
      .getElementById("button-info")
      .setAttribute("class", "details-button details-button-info-active");
    document
      .getElementById("details-info")
      .setAttribute("class", "details-content details-info-active");
    document
      .getElementById("button-policies")
      .setAttribute("class", "details-button details-button-policies-inactive");
    document
      .getElementById("details-policies")
      .setAttribute("class", "details-content details-policies-inactive");
    document
      .getElementById("button-faq")
      .setAttribute("class", "details-button details-button-faq-inactive");
    document
      .getElementById("details-faq")
      .setAttribute("class", "details-content details-faq-inactive");
    document
      .getElementById("button-reviews")
      .setAttribute("class", "details-button details-button-reviews-inactive");
    document
      .getElementById("details-reviews")
      .setAttribute("class", "details-content details-reviews-inactive");
  } else {
    document
      .getElementById("button-info")
      .setAttribute("class", "details-button details-button-info-inactive");
    document
      .getElementById("details-info")
      .setAttribute("class", "details-content details-info-inactive");
  }
});

document.getElementById("button-faq").addEventListener("click", () => {
  if (
    document.getElementById("button-faq").getAttribute("class") ===
    "details-button details-button-faq-inactive"
  ) {
    document
      .getElementById("button-faq")
      .setAttribute("class", "details-button details-button-faq-active");
    document
      .getElementById("details-faq")
      .setAttribute("class", "details-content details-faq-active");
    document
      .getElementById("button-policies")
      .setAttribute("class", "details-button details-button-policies-inactive");
    document
      .getElementById("details-policies")
      .setAttribute("class", "details-content details-policies-inactive");
    document
      .getElementById("button-info")
      .setAttribute("class", "details-button details-button-info-inactive");
    document
      .getElementById("details-info")
      .setAttribute("class", "details-content details-info-inactive");
    document
      .getElementById("button-reviews")
      .setAttribute("class", "details-button details-button-reviews-inactive");
    document
      .getElementById("details-reviews")
      .setAttribute("class", "details-content details-reviews-inactive");
  } else {
    document
      .getElementById("button-faq")
      .setAttribute("class", "details-button details-button-faq-inactive");
    document
      .getElementById("details-faq")
      .setAttribute("class", "details-content details-faq-inactive");
  }
});

document.getElementById("button-reviews").addEventListener("click", () => {
  if (
    document.getElementById("button-reviews").getAttribute("class") ===
    "details-button details-button-reviews-inactive"
  ) {
    document
      .getElementById("button-reviews")
      .setAttribute("class", "details-button details-button-reviews-active");
    document
      .getElementById("details-reviews")
      .setAttribute("class", "details-content details-reviews-active");
    document
      .getElementById("button-policies")
      .setAttribute("class", "details-button details-button-policies-inactive");
    document
      .getElementById("details-policies")
      .setAttribute("class", "details-content details-policies-inactive");
    document
      .getElementById("button-info")
      .setAttribute("class", "details-button details-button-info-inactive");
    document
      .getElementById("details-info")
      .setAttribute("class", "details-content details-info-inactive");
    document
      .getElementById("button-faq")
      .setAttribute("class", "details-button details-button-faq-inactive");
    document
      .getElementById("details-faq")
      .setAttribute("class", "details-content details-faq-inactive");
  } else {
    document
      .getElementById("button-reviews")
      .setAttribute("class", "details-button details-button-reviews-inactive");
    document
      .getElementById("details-reviews")
      .setAttribute("class", "details-content details-reviews-inactive");
  }
});

// document.getElementById("search-button").click();
