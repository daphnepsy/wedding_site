// timeline.js
// Handles the interactive timeline and map for Daphne & Conner's story using Mapbox GL JS

mapboxgl.accessToken = 'pk.eyJ1IjoiZGFwaG5lcG9vbiIsImEiOiJjbWN4OWYyZ2owOXB4MmtzNXhiZjRrdnZqIn0.RPpsixMv0FQCtqXnS7aRZg';

let map, daphneMarker, connerMarker, locationsData = [];
let cityCoords = {};

const slider = document.getElementById('timeline-slider');
const label = document.getElementById('timeline-label');

function sliderToDate(val) {
    // 0 = Aug 2017, 100 = Dec 2025 (101 months)
    const start = new Date(2017, 7); // Aug 2017 (month is 0-indexed)
    const date = new Date(start.getFullYear(), start.getMonth() + Number(val));
    return date;
}

function formatDate(date) {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
}

function findLatestLocation(person, year, month) {
    // Filter for this person and for dates <= the current date
    const entries = locationsData
        .filter(l => l.person === person && (l.year < year || (l.year === year && l.month <= month)));
    if (entries.length === 0) return null;
    // Find the entry with the latest year/month
    return entries.reduce((latest, entry) => {
        if (!latest) return entry;
        if (entry.year > latest.year) return entry;
        if (entry.year === latest.year && entry.month > latest.month) return entry;
        return latest;
    }, null);
}

function updateMarkers(date) {
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const daphne = findLatestLocation('Daphne', y, m);
    const conner = findLatestLocation('Conner', y, m);

    if (daphne && daphne.city && cityCoords[daphne.city] && daphneMarker) {
        daphneMarker.setLngLat([cityCoords[daphne.city].lon, cityCoords[daphne.city].lat]);
    }
    if (conner && conner.city && cityCoords[conner.city] && connerMarker) {
        connerMarker.setLngLat([cityCoords[conner.city].lon, cityCoords[conner.city].lat]);
    }
}

function onSliderChange() {
    const date = sliderToDate(slider.value);
    label.textContent = formatDate(date);
    updateMarkers(date);
}

function initTimeline() {
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-30, 20],
        zoom: 2,
        projection: 'globe'
    });
    map.addControl(new mapboxgl.NavigationControl());

    // Add markers for Daphne and Conner
    daphneMarker = new mapboxgl.Marker({ color: 'red' }).setLngLat([0, 0]).addTo(map);
    connerMarker = new mapboxgl.Marker({ color: 'blue' }).setLngLat([0, 0]).addTo(map);

    // Set initial label and marker positions
    onSliderChange();
    // Listen for slider
    slider.addEventListener('input', onSliderChange);
}

Promise.all([
    fetch('data/locations.json').then(res => res.json()),
    fetch('data/city_coords.json').then(res => res.json())
]).then(([locations, coords]) => {
    locationsData = locations;
    cityCoords = coords;
    initTimeline();
}).catch(err => {
    console.error('Failed to load data', err);
});

// const map = new mapboxgl.Map({
//     container: 'map',
//     style: 'mapbox://styles/mapbox/streets-v12',
//     center: [-74.5, 40],
//     zoom: 4,
//     renderingMode: '2d'
// });
