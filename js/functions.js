// Check if device is mobile.
function deviceIsMobile() {
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    // True for mobile device.
    return true;
  } else {
    // False for not mobile device.
    return false;
  }
}

// Check if mobile device is portrait mode.
// Returns false if not mobile device.
function isPortraitMode() {
  if (deviceIsMobile()) {
    if (window.innerHeight < window.innerWidth) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

// Removes all child nodes.
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

// Get current window size.
function getWindowSize() {
  let width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

  let height =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;

  return { width: width, height: height };
}

// Get element size.
function getElementSizeByID(id) {
  // console.log(id);
  // console.log(document.getElementById(id));
  let offsetHeight = document.getElementById(id).offsetHeight;
  let offsetWidth = document.getElementById(id).offsetWidth;

  return { width: offsetWidth, height: offsetHeight };
}

// Get map bounds.
function getMapBounds(map) {
  let xGeoLeft = map.getBounds().Qa.i;
  let xGeoRight = map.getBounds().Qa.j;
  let yGeoTop = map.getBounds().Va.i;
  let yGeoBottom = map.getBounds().Va.j;
  console.log(map.getBounds());
  console.log("xGeoLeft:" + xGeoLeft);
  console.log("xGeoRight:" + xGeoRight);
  console.log("yGeoTop:" + yGeoTop);
  console.log("yGeoBottom:" + yGeoBottom);
  return {
    xGeoLeft: xGeoLeft,
    xGeoRight: xGeoRight,
    yGeoTop: yGeoTop,
    yGeoBottom: yGeoBottom,
  };
}

// Gets the offset to move view of marker from center;
function getGeoOffset(xPadLeftOrTop, xPadRightOrBottom, xSize, xGeoSize) {
  let xRatio = xGeoSize / xSize;
  let xOrigin = xSize / 2;
  let xDest = (xSize - xPadRightOrBottom + xPadLeftOrTop) / 2;
  let xOffset = xDest - xOrigin;
  let xGeoOffset = xOffset * xRatio;

  return xGeoOffset;
}

export {
  deviceIsMobile,
  isPortraitMode,
  removeAllChildNodes,
  getWindowSize,
  getElementSizeByID,
  getMapBounds,
  getGeoOffset,
};
