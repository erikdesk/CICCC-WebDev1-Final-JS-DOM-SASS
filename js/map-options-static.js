const mapOptionsStatic = {
  zoom: 15,
  center: { lat: 1.3075322, lng: 103.8286 },
  disableDefaultUI: true,
  clickableIcons: false,
  disableDoubleClickZoom: false,
  mapTypeId: "roadmap",
  setTilt: 0,
  minZoom: 14,
  maxZoom: 18,
  styles: [
    {
      featureType: "road.local",
      stylers: [
        {
          lightness: -8,
        },
      ],
    },
    {
      featureType: "road.arterial",
      stylers: [
        {
          lightness: -12,
        },
      ],
    },
    {
      featureType: "road.highway",
      stylers: [
        {
          lightness: 25,
        },
      ],
    },
    {
      featureType: "landscape.man_made",
      stylers: [
        {
          lightness: -3,
        },
      ],
    },
    {
      featureType: "transit.station",
      stylers: [
        {
          lightness: -10,
        },
      ],
    },
    {
      featureType: "administrative",
      elementType: "geometry.fill",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "landscape.natural",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "poi.attraction",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "poi.business",
      stylers: [
        {
          lightness: 55,
        },
      ],
    },
    {
      featureType: "poi.government",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "poi.medical",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "poi.park",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "poi.place_of_worship",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "poi.school",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "poi.sports_complex",
      stylers: [
        {
          lightness: 55,
        },
      ],
    },
    {
      featureType: "water",
      stylers: [
        {
          color: "#e5f0ff",
        },
      ],
    },
  ],
};

export { mapOptionsStatic };
