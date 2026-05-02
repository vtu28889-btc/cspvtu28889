function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (pos) => {

            let lat = pos.coords.latitude;
            let lon = pos.coords.longitude;

            try {
                let res = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
                );

                let data = await res.json();

                let place = data.address.city 
                          || data.address.town 
                          || data.address.village 
                          || "Location found";

                let state = data.address.state || "";
                let country = data.address.country || "";

                let fullLocation = `${place}, ${state}, ${country}`;

                document.getElementById("location").value = fullLocation;

            } catch (err) {
                document.getElementById("location").value = lat + ", " + lon;
            }

        }, () => {
            alert("Allow location access");
        });
    }
}
