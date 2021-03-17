/*
// Satellite TLE Tracker
// Malexty 2021
// This program is just a simple way of tracking a satellite's specific position without internet (using TLE) to later pipe into 2 motors to control a satellite dish
*/

/*
// Dependencies:
// satellite.js (npm install satellite.js)
// geolib (npm instal geolib)
*/

var satellite = require('satellite.js');
var geolib = require('geolib');

// Function to sleep aka no spam console
function sleep(milliseconds) {
	var start = new Date().getTime();
	for (var i = 0; i < 1e7; i++) {
		if ((new Date().getTime() - start) > milliseconds) {
			break;
		}
	}
}

var ObserverLatitude = -27.5598;
var ObserverLongitude = 151.9507;
var ObserverHeight = 0.691; // In kilometres
var DiameterEarth = 12756.33; // I think this is what the diameter is, anyway the number works
var RadiusEarthKm = 6.378135E3;

var running = 1;
var mode = 3;
/*
// Modes:
// 1 - Latitude and Longitude CSV
// 2 - Everything
// 3 - Specifically what is going to go on the interface (Probably GTK)
*/

var TLELine1 = "1 33591U 09005A   21075.47070456  .00000026  00000-0  39626-4 0  9991";
var TLELine2 = "2 33591  99.1913  93.8382 0014452  36.8216 323.3944 14.12455674623536";

var SatRec = satellite.twoline2satrec(TLELine1, TLELine2);
while (running = 1) {
	var PositionAndVelocity = satellite.propagate(SatRec, new Date());
	var PositionEci = PositionAndVelocity.position;
	var VelocityEci = PositionAndVelocity.velocity;
	var ObserverGd = {
		longitude: satellite.degreesToRadians(ObserverLongitude),
		latitude: satellite.degreesToRadians(ObserverLatitude),
		height: ObserverHeight
	}
	var gmst = satellite.gstime(new Date());
	var PositionEcf = satellite.eciToEcf(PositionEci, gmst);
	var ObserverEcf = satellite.geodeticToEcf(ObserverGd);
	var PositionGd = satellite.eciToGeodetic(PositionEci, gmst);
	var LookAngles = satellite.ecfToLookAngles(ObserverGd, PositionEcf);
	var SatelliteX = PositionEci.x;
	var SatelliteY = PositionEci.y;
	var SatelliteZ = PositionEci.z;
	var SatelliteW = PositionEci.w;
	var Azimuth = LookAngles.azimuth;
	var Elevation = LookAngles.elevation;
	var RangeSat = LookAngles.rangeSat;
	var Longitude = PositionGd.longitude;
	var Latitude = PositionGd.latitude;
	var Height = PositionGd.height;
	var LongitudeDeg = satellite.degreesLong(Longitude);
	var LatitudeDeg = satellite.degreesLat(Latitude);
	var AzimuthDegrees = satellite.radiansToDegrees(Azimuth);
	var ElevationDegrees = satellite.radiansToDegrees(Elevation);
	const DistanceToSatellite = geolib.getPreciseDistance(
		{ latitude: LatitudeDeg, longitude: LongitudeDeg },
		{ latitude: ObserverLatitude, longitude: ObserverLongitude }
	) / 1000;
	var Footprint = DiameterEarth * Math.acos(RadiusEarthKm / (RadiusEarthKm + Height));

	if (mode == 1) {
		console.log(LatitudeDeg + "," + LongitudeDeg);
	} else if (mode == 2) {
		console.log("SatRec: " + SatRec);
		console.log("PositionAndVelocity: " + PositionAndVelocity);
		console.log("PositionEci: " + PositionEci);
		console.log("VelocityEci: " + VelocityEci);
		console.log("ObserverGd: " + ObserverGd);
		console.log("gmst: " + gmst);
		console.log("PositionEcf: " + PositionEcf);
		console.log("ObserverEcf: " + ObserverEcf);
		console.log("PositionGd: " + PositionGd);
		console.log("LookAngles: " + LookAngles);
		console.log("SatelliteX: " + SatelliteX);
		console.log("SatelliteY: " + SatelliteY);
		console.log("SatelliteZ: " + SatelliteZ);
		console.log("SatelliteW: " + SatelliteW);
		console.log("Azimuth: " + Azimuth);
		console.log("Elevation: " + Elevation);
		console.log("RangeSat: " + RangeSat);
		console.log("Longitude (Radians): " + Longitude);
		console.log("Latitude (Radians): " + Latitude);
		console.log("Height: " + Height);
		console.log("Longitude: " + LongitudeDeg);
		console.log("Latitude: " + LatitudeDeg);
		console.log("");
		console.log("Latitude: " + LatitudeDeg);
		console.log("Longitude: " + LongitudeDeg);
		console.log("Height: " + Height);
		console.log("Azimuth: " + AzimuthDegrees);
		console.log("Elevation: " + ElevationDegrees);
		console.log("Distance to Satellite: " + DistanceToSatellite);
		console.log("");
		console.log("Degrees high to point dish: " + ElevationDegrees);
		console.log("Magnetic direction to point dish: " + AzimuthDegrees);
	} else if (mode == 3) {
		console.log("Azimuth: " + AzimuthDegrees);
		console.log("Elevation: " + ElevationDegrees);
		console.log("Latitude: " + LatitudeDeg);
		console.log("Longitude: " + LongitudeDeg);
		console.log("Slant Range: " + RangeSat);
		console.log("Height: " + Height);
		console.log("Distance: " + DistanceToSatellite);
		console.log("Footprint: " + Footprint);
		console.log("");
	} else {
		console.log("Incorrect mode value, exiting.");
		running = 0;
	}
	sleep(500);
}
