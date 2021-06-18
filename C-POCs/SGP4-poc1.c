#include <SGP4/CoordTopocentric.h>
#include <SGP4/CoordGeodetic.h>
#include <SGP4/Observer.h>
#include <SGP4/SGP4.h>
#include <time.h>
#include <iostream>

/*
// 1) The SGP4 Library contains its own pi double (kPI) with a ridiculous number of decimal
// places so that will be used
// 2) For the observer object, the 0 is the altitude of the base station, but i dont know
// if it is in km or m (i think km)
// 3) The SGP4 Library for C++ (https://github.com/dnwrnr/sgp4) seems to have some issues
// so to compile it (with the library installed to /usr) use this:
// g++ SGP4-poc1.cpp -o SGP4-poc1 -lsgp4s
// (This works on Debian AARCH64)
*/

float observerLatitude = -27.5597;
float observerLongitude = 151.9503;

double rTod(double rad)
{
    return rad * 180.0 / kPI;
}

int main()
{
    Observer obs(observerLatitude, observerLongitude, 0); // 0 is altitude but idk units so i think its km
    Tle tle = Tle("NOAA 19 [+]      ",       
        "1 33591U 09005A   21168.55091808  .00000087  00000-0  72502-4 0  9994",
        "2 33591  99.1827 189.2592 0014787 129.7260 230.5217 14.12475565636677");
    SGP4 sgp4(tle);

    std::cout << "Satellite Name:\t\t" << tle.Name() << std::endl;
    std::cout << tle << std::endl;

    DateTime dt = DateTime::Now(true);
    std::cout << "Current DateTime (UTC): " << dt << std::endl;

    Eci eci = sgp4.FindPosition(dt);
    CoordTopocentric topo = obs.GetLookAngle(eci);
    CoordGeodetic geo = eci.ToGeodetic();

    std::cout << "Calculations:" << std::endl;
    std::cout << "Azimuth: " << rTod(topo.azimuth) << " degrees / " << topo.azimuth << " radians" << std::endl;
    std::cout << "Azimuth: " << rTod(topo.azimuth) << " degrees / " << topo.azimuth << " radians" << std::endl;
    std::cout << "Elevation: " << rTod(topo.elevation) << " degrees / " << topo.elevation << " radians" << std::endl;
    std::cout << "Range: " << topo.range << " km" << std::endl;
    std::cout << "Range Rate: " << topo.range_rate << " km/s" << std::endl;
    std::cout << "Satellite Latitude: " << rTod(geo.latitude) << " radians / " << geo.latitude << " radians" << std::endl;
    std::cout << "Satellite Longitude: " << rTod(geo.longitude) << " radians / " << geo.longitude << " radians" << std::endl; 
    std::cout << "Satellite Altitude: " << geo.altitude << " km" << std::endl;

    return 0;
}
