var map;
var userLocationMarker; // To track user's location marker
var locationButton; // For custom location button
var userLocation; // Store user's location for re-centering
var watchId; // For tracking location updates
var studyLocations = []; // Array to store study location markers

// Initialize the map
function initMap() {
    // Default location (will be used if geolocation fails)
    var defaultLocation = {lat: 43.66088234260811, lng: -79.39609722039485};
    
    // Create map with default options first
    var options = {
        center: defaultLocation,
        zoom: 15,
        mapId: "7219d2cdaaaa0b81",
        minZoom: 13,
        maxZoom: 18,
        mapTypeControl: false, 
        streetViewControl: false, 
        fullscreenControl: true,
        zoomControl: true
    };
    
    // Create the map
    map = new google.maps.Map(document.getElementById('map'), options);
    
    // Add custom location button after map loads
    google.maps.event.addListenerOnce(map, 'idle', function() {
        addLocationButton();
        // Add study locations after map loads
        fetchAndDisplayStudyLocations();
    });
    
    // Try to get user's location
    if (navigator.geolocation) {
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'map-loading';
        loadingDiv.innerHTML = '<div class="loading-spinner"></div><div>Finding your location...</div>';
        loadingDiv.style.position = 'absolute';
        loadingDiv.style.zIndex = '1';
        loadingDiv.style.top = '50%';
        loadingDiv.style.left = '50%';
        loadingDiv.style.transform = 'translate(-50%, -50%)';
        loadingDiv.style.background = 'rgba(255, 255, 255, 0.8)';
        loadingDiv.style.padding = '20px';
        loadingDiv.style.borderRadius = '10px';
        loadingDiv.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        loadingDiv.style.textAlign = 'center';
        document.getElementById('map').appendChild(loadingDiv);
        
        // Try to get location with high accuracy
        navigator.geolocation.getCurrentPosition(
            function success(position) {
                const loadingElement = document.getElementById('map-loading');
                if (loadingElement) loadingElement.remove();
                
                // Get user's position
                var myLat = position.coords.latitude;
                var myLong = position.coords.longitude;
                userLocation = {lat: myLat, lng: myLong};
                
                // Center map on user's location
                map.setCenter(userLocation);
                
                // Add marker for user's location with custom marker icon
                userLocationMarker = new google.maps.Marker({
                    position: userLocation,
                    map: map,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 10,
                        fillColor: "#4285F4",
                        fillOpacity: 1,
                        strokeColor: "#FFFFFF",
                        strokeWeight: 2
                    },
                    title: "Your Location",
                    animation: google.maps.Animation.DROP,
                    zIndex: 999
                });
                
                
                
                // Add info window
                var infoWindow = new google.maps.InfoWindow({
                    content: '<h3 style="color:#4285F4;margin:0;">You are here!</h3>'
                });
                
                userLocationMarker.addListener('click', function() {
                    infoWindow.open(map, userLocationMarker);
                });
                
                // Enable watch position to update user's location in real-time
                enableLocationTracking();
            },
            function failure() {
                const loadingElement = document.getElementById('map-loading');
                if (loadingElement) loadingElement.remove();
                
                const errorDiv = document.createElement('div');
                errorDiv.id = 'map-error';
                errorDiv.innerHTML = '<div>Could not access your location.</div>';
                errorDiv.style.position = 'absolute';
                errorDiv.style.zIndex = '1';
                errorDiv.style.bottom = '20px';
                errorDiv.style.left = '50%';
                errorDiv.style.transform = 'translateX(-50%)';
                errorDiv.style.background = 'rgba(255, 255, 255, 0.9)';
                errorDiv.style.padding = '10px 20px';
                errorDiv.style.borderRadius = '5px';
                errorDiv.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
                document.getElementById('map').appendChild(errorDiv);
                
                setTimeout(() => {
                    const errorElement = document.getElementById('map-error');
                    if (errorElement) errorElement.remove();
                }, 5000);
                
                // Use default location
                var myLat = defaultLocation.lat;
                var myLong = defaultLocation.lng;
                
                // Add marker for default location
                addMarker({
                    location: {lat: myLat, lng: myLong}, 
                    content: `<h3>Default Location</h3>`
                });
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    } else {
        // Browser doesn't support geolocation
        handleNoGeolocation(true);
    }
    
    // Add multiple markers with custom icons / content
    function addMarker(property) {
        // Create new marker with custom icon and content
        const marker = new google.maps.Marker({
            position: property.location,
            map: map,
            icon: property.imageIcon
        }); 

        if (property.imageIcon) {
            marker.setIcon(property.imageIcon);
        }

        const detailWindow = new google.maps.InfoWindow({
            content: property.content
        });

        marker.addListener("click", () => {
            detailWindow.open(map, marker);
        });
        
        return marker;
    }
}

// Function to enable continuous location tracking
function enableLocationTracking() {
    if (navigator.geolocation && !watchId) {
        watchId = navigator.geolocation.watchPosition(
            function(position) {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                
                if (userLocationMarker) {
                    userLocationMarker.setPosition(userLocation);
                }
            },
            function(error) {
                console.error("Error in location tracking:", error);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    }
}

// Function to add the location button to the map
function addLocationButton() {
    const locationControlDiv = document.createElement('div');
    
    locationControlDiv.style.backgroundColor = '#fff';
    locationControlDiv.style.border = '2px solid #fff';
    locationControlDiv.style.borderRadius = '3px';
    locationControlDiv.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    locationControlDiv.style.cursor = 'pointer';
    locationControlDiv.style.marginRight = '10px';
    locationControlDiv.style.marginBottom = '10px';
    locationControlDiv.style.textAlign = 'center';
    locationControlDiv.title = 'Center to your location';
    
    const controlUI = document.createElement('div');
    controlUI.style.padding = '10px';
    controlUI.innerHTML = '<div style="width:20px;height:20px;background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjNDI4NUY0Ij48cGF0aCBkPSJNMTIgOGMtMi4yMSAwLTQgMS43OS00IDRzMS43OSA0IDQgNCA0LTEuNzkgNC00LTEuNzktNC00LTR6bTguOTQgM2MtLjQ2LTQuMTctMy43Ny03LjQ4LTcuOTQtNy45NFYxaC0ydjIuMDZDNi44MyAzLjUyIDMuNTIgNi44MyAzLjA2IDExSDF2MmgyLjA2YzAuNDYgNC4xNyAzLjc3IDcuNDggNy45NCA3Ljk0VjIzaDJ2LTIuMDZjNC4xNy0wLjQ2IDcuNDgtMy43NyA3Ljk0LTcuOTRIMjN2LTJoLTIuMDZ6TTEyIDE5Yy0zLjg3IDAtNy0zLjEzLTctN3MzLjEzLTcgNy03IDcgMy4xMyA3IDctMy4xMyA3LTcgN3oiLz48L3N2Zz4=);background-size:contain;background-repeat:no-repeat;"></div>';
    locationControlDiv.appendChild(controlUI);
    
    controlUI.addEventListener('click', () => {
        if (userLocation) {
            map.panTo(userLocation);
            
            if (userLocationMarker) {
                const marker = userLocationMarker;
                
                let opacity = 1;
                let growing = false;
                const pulse = setInterval(() => {
                    opacity = growing ? opacity + 0.1 : opacity - 0.1;
                    
                    if (opacity <= 0.4) {
                        growing = true;
                    } else if (opacity >= 1) {
                        growing = false;
                    }
                    
                    marker.setIcon({
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 10,
                        fillColor: "#4285F4",
                        fillOpacity: opacity,
                        strokeColor: "#FFFFFF",
                        strokeWeight: 2
                    });
                }, 50);
                
                setTimeout(() => {
                    clearInterval(pulse);
                    marker.setIcon({
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 10,
                        fillColor: "#4285F4",
                        fillOpacity: 1,
                        strokeColor: "#FFFFFF",
                        strokeWeight: 2
                    });
                }, 1500);
            }
        } else {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    map.panTo(userLocation);
                    
                    if (!userLocationMarker) {
                        userLocationMarker = new google.maps.Marker({
                            position: userLocation,
                            map: map,
                            icon: {
                                path: google.maps.SymbolPath.CIRCLE,
                                scale: 10,
                                fillColor: "#4285F4",
                                fillOpacity: 1,
                                strokeColor: "#FFFFFF", 
                                strokeWeight: 2
                            },
                            title: "Your Location"
                        });
                    } else {
                        userLocationMarker.setPosition(userLocation);
                    }
                },
                function(error) {
                    const errorDiv = document.createElement('div');
                    errorDiv.id = 'map-error';
                    errorDiv.innerHTML = '<div>Could not access your location.</div>';
                    errorDiv.style.position = 'absolute';
                    errorDiv.style.zIndex = '1';
                    errorDiv.style.bottom = '20px';
                    errorDiv.style.left = '50%';
                    errorDiv.style.transform = 'translateX(-50%)';
                    errorDiv.style.background = 'rgba(255, 255, 255, 0.9)';
                    errorDiv.style.padding = '10px 20px';
                    errorDiv.style.borderRadius = '5px';
                    errorDiv.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
                    document.getElementById('map').appendChild(errorDiv);
                    
                    setTimeout(() => {
                        const errorElement = document.getElementById('map-error');
                        if (errorElement) errorElement.remove();
                    }, 3000);
                }
            );
        }
    });
    
    // Add the control to the map
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(locationControlDiv);
}

// Function to handle case when geolocation is not supported
function handleNoGeolocation(errorFlag) {
    const errorDiv = document.createElement('div');
    errorDiv.id = 'map-error';
    
    if (errorFlag) {
        errorDiv.innerHTML = '<div>Error: The Geolocation service failed.</div>';
    } else {
        errorDiv.innerHTML = '<div>Error: Your browser doesn\'t support geolocation.</div>';
    }
    
    errorDiv.style.position = 'absolute';
    errorDiv.style.zIndex = '1';
    errorDiv.style.bottom = '20px';
    errorDiv.style.left = '50%';
    errorDiv.style.transform = 'translateX(-50%)';
    errorDiv.style.background = 'rgba(255, 255, 255, 0.9)';
    errorDiv.style.padding = '10px 20px';
    errorDiv.style.borderRadius = '5px';
    errorDiv.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    document.getElementById('map').appendChild(errorDiv);
    
    setTimeout(() => {
        const errorElement = document.getElementById('map-error');
        if (errorElement) errorElement.remove();
    }, 5000);
}

// Function to fetch and display study locations
function fetchAndDisplayStudyLocations() {
    studyLocations.forEach(marker => marker.setMap(null));
    studyLocations = [];
    
    // Fetch study locations from the API
    fetch('/api/study-locations')
        .then(response => {
            if (!response.ok) {
                // If API fails, use sample data
                return {
                    locations: getSampleStudyLocations()
                };
            }
            return response.json();
        })
        .then(data => {
            if (!data || !data.locations || data.locations.length === 0) {
                // Use sample data if API returns empty
                data = { locations: getSampleStudyLocations() };
            }
            
            // Add markers for each study location
            data.locations.forEach(location => {
                const marker = new google.maps.Marker({
                    position: {lat: location.lat, lng: location.lng},
                    map: map,
                    title: location.name,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 8,
                        fillColor: "#FF5252",
                        fillOpacity: 0.9,
                        strokeColor: "#FFFFFF",
                        strokeWeight: 2
                    },
                    animation: google.maps.Animation.DROP
                });
                
                // Create info window content
                const content = `
                    <div class="study-location-info">
                        <h3 style="color:#FF5252;margin:0 0 5px 0;font-size:16px;">${location.name}</h3>
                        ${location.description ? `<p style="margin:0 0 5px 0;font-size:14px;">${location.description}</p>` : ''}
                        ${location.address ? `<p style="margin:0 0 5px 0;font-size:13px;color:#666;"><i>Address: ${location.address}</i></p>` : ''}
                        ${location.openingHours ? `<p style="margin:0;font-size:13px;color:#666;"><i>Hours: ${location.openingHours}</i></p>` : ''}
                        ${location.studyTopics ? `<p style="margin:5px 0 0 0;font-size:13px;"><strong>Study Topics:</strong> ${location.studyTopics}</p>` : ''}
                    </div>
                `;
                
                // Create info window
                const infoWindow = new google.maps.InfoWindow({
                    content: content,
                    maxWidth: 250
                });
                
                marker.addListener('click', () => {
                    infoWindow.open(map, marker);
                });
                
                studyLocations.push(marker);
            });
        })
        .catch(error => {
            console.error("Error fetching study locations:", error);
            displaySampleStudyLocations();
        });
}

// Function to get sample study locations
function getSampleStudyLocations() {
    return [
        {
            lat: 43.65958, 
            lng: -79.39743,
            name: "Robarts Library",
            description: "Popular study spot with 5 floors of quiet study spaces",
            address: "130 St. George St",
            openingHours: "8:30 AM - 11:00 PM",
            studyTopics: "All subjects"
        },
        {
            lat: 43.66220, 
            lng: -79.39509,
            name: "Second Cup Café",
            description: "Coffee shop with free WiFi and plenty of seating",
            address: "192 Bloor St W",
            openingHours: "7:00 AM - 9:00 PM",
            studyTopics: "Group projects, casual studying"
        },
        {
            lat: 43.65807, 
            lng: -79.39934,
            name: "Gerstein Science Library",
            description: "Quiet study space focused on science resources",
            address: "9 King's College Circle",
            openingHours: "8:30 AM - 10:00 PM",
            studyTopics: "Science, Medicine, Engineering"
        },
        {
            lat: 43.66350, 
            lng: -79.40012,
            name: "Kelly Library",
            description: "Modern library with individual and group study rooms",
            address: "113 St Joseph St",
            openingHours: "9:00 AM - 9:00 PM",
            studyTopics: "Humanities, Social Sciences"
        },
        {
            lat: 43.65599, 
            lng: -79.38279,
            name: "Balzac's Coffee",
            description: "Stylish coffee shop with outdoor seating",
            address: "122 Bond St",
            openingHours: "7:00 AM - 7:00 PM",
            studyTopics: "Casual studying, Arts"
        }
    ];
}

function displaySampleStudyLocations() {
    const sampleLocations = getSampleStudyLocations();
    
    studyLocations.forEach(marker => marker.setMap(null));
    studyLocations = [];
    
    sampleLocations.forEach(location => {
        const marker = new google.maps.Marker({
            position: {lat: location.lat, lng: location.lng},
            map: map,
            title: location.name,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: "#FF5252",
                fillOpacity: 0.9,
                strokeColor: "#FFFFFF", 
                strokeWeight: 2
            }
        });
        
        // Create info window content
        const content = `
            <div class="study-location-info">
                <h3 style="color:#FF5252;margin:0 0 5px 0;font-size:16px;">${location.name}</h3>
                ${location.description ? `<p style="margin:0 0 5px 0;font-size:14px;">${location.description}</p>` : ''}
                ${location.address ? `<p style="margin:0 0 5px 0;font-size:13px;color:#666;"><i>Address: ${location.address}</i></p>` : ''}
                ${location.openingHours ? `<p style="margin:0;font-size:13px;color:#666;"><i>Hours: ${location.openingHours}</i></p>` : ''}
                ${location.studyTopics ? `<p style="margin:5px 0 0 0;font-size:13px;"><strong>Study Topics:</strong> ${location.studyTopics}</p>` : ''}
            </div>
        `;
        
        // Create info window
        const infoWindow = new google.maps.InfoWindow({
            content: content,
            maxWidth: 250
        });
        
        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });
        
        studyLocations.push(marker);
    });
}
