var satellite = require('satellite.js');
var geolib = require('geolib');

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

var running = 1;
var mode = 2;
/*
// Modes:
// 1 - Latitude and Longitude CSV
// 2 - Everything
*/

var TLELine1 = "1 42964U 17061K   21057.89174622  .00000101  00000-0  29037-4 0  9991";
var TLELine2 = "2 42964  86.3955 114.5115 0002157 100.0236 260.1203 14.34216773177320";

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
	} else {
		console.log("Incorrect mode value, exiting.");
		running = 0;
	}
	sleep(500);
}

/*
// End notes:
// Distance along with height could be used to calculate the footprint of the satellite maybe if this software doesnt already do it
*/

