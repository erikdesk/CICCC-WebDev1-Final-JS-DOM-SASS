// import { searchForm } from "./search.js";

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




  //   markers[index].addListener("click", () => {});

  //   console.log(`hotel${hotel[0]}`);

    if (
      document.getElementById("card").getAttribute("class") === "card-inactive"
    ) {







      

      // Save current map view.

      console.log(
        `https://maps.googleapis.com/maps/api/directions/json?mode=walking&origin=${hotel[3]},${hotel[4]}&destination=1.303981012,103.8322417&key=AIzaSyCQUu01hvcUZo14XTn4dqKqW2sNG_fpGik`
      );

      // Get window dimensions.
      

      // document
      //   .getElementById("hotel-name")
      //   .setAttribute("class", "marker-hotel visible-fadeIn");

      // map.panTo({ lat: yHotel - yGeoOffset, lng: xHotel + xOffset });
      // map.panTo({ lat: yHotel - yOffset, lng: xHotel + xOffset });
      // sleep(5000);
      console.log(document.getElementById("card").getAttribute("class"));

  });
}



// document.getElementById("search-button").click();
// sleep(2000);
// document.getElementById("hotel23").click();
