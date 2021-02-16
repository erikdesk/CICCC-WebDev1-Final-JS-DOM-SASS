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
