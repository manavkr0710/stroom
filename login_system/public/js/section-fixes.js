
// This script ensures that map instructions only appear in the map view

document.addEventListener('DOMContentLoaded', function() {
    // Find elements
    const mapContainer = document.getElementById('map-container');
    const searchContainer = document.getElementById('search-form-container');
    const mapHeader = document.querySelector('.map-header');
    const mapInstructions = document.querySelector('.map-instructions');
    
    // Create a mutation observer to monitor display changes
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'style') {
                // Check if search is visible
                if (searchContainer.style.display !== 'none') {
                    // Hide map-related elements
                    if (mapHeader) mapHeader.dataset.wasVisible = mapHeader.style.display !== 'none';
                    if (mapInstructions) mapInstructions.dataset.wasVisible = mapInstructions.style.display !== 'none';
                } 
                // Check if map container is visible
                else if (mapContainer.style.display !== 'none') {
                    // Restore map-related elements
                    if (mapHeader && mapHeader.dataset.wasVisible !== 'false') mapHeader.style.display = '';
                    if (mapInstructions && mapInstructions.dataset.wasVisible !== 'false') mapInstructions.style.display = '';
                }
            }
        });
    });
    
    // Start observing
    if (mapContainer) {
        observer.observe(mapContainer, { attributes: true });
    }
    if (searchContainer) {
        observer.observe(searchContainer, { attributes: true });
    }
});
