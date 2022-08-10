function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    function deg2rad(deg) {
        return deg * (Math.PI / 180)
    }

    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

const lat1 = -33.02306
const long1 = -71.56698

const lat2 = -38.69095
const long2 = -71.67178

const distancia = getDistanceFromLatLonInKm(lat1, long1, lat2, long2)


//console.log(`La distancia entre el reloj de viña y el parque conguillio es de: ${distancia} km`);

module.exports = {getDistanceFromLatLonInKm}