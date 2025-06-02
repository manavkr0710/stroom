// Handle inline search submission
document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('inlineSearchForm');
    const resultsDiv = document.getElementById('inlineResults');
    const noResultsDiv = document.getElementById('noResults');
    
    // Function to render sessions as cards
    function renderSessionCards(items, container, emptyStateElement) {
        container.innerHTML = '';
        
        if (items && items.length > 0) {
            items.forEach(item => {
                const card = document.createElement('div');
                card.className = 'search-card';
                card.innerHTML = `
                    <strong>${item.location}</strong><br />
                    <span><strong>Room:</strong> ${item.room || 'Not specified'}</span><br />
                    <span><strong>Time:</strong> ${item.time || 'Not specified'}</span><br />
                    <span><strong>Topics:</strong> ${item.studyTopics || 'None'}</span><br />
                    ${item.tags ? `<span><strong>Tags:</strong> ${item.tags}</span><br />` : ''}
                    ${item.additionalNotes ? `<span><strong>Notes:</strong> ${item.additionalNotes}</span>` : ''}
                `;
                container.appendChild(card);
            });
            
            if (emptyStateElement) {
                emptyStateElement.style.display = 'none';
            }
        } else if (emptyStateElement) {
            emptyStateElement.style.display = 'block';
        }
    }
    
    // Handle search form submission
    if (searchForm) {
        searchForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const query = document.getElementById('inlineSearchInput').value;
            
            try {
                const res = await fetch('/api/search?query=' + encodeURIComponent(query));
                const data = await res.json();
                
                // Update search results
                renderSessionCards(data.results, resultsDiv, noResultsDiv);
                
                // Only show no results message if there was a query
                if (query && data.results.length === 0) {
                    noResultsDiv.textContent = `No sessions found matching "${query}".`;
                    noResultsDiv.style.display = 'block';
                } else {
                    noResultsDiv.style.display = 'none';
                }
                
                // Update my sessions too (in case they've changed)
                renderSessionCards(data.mySessions, document.getElementById('mySessionsGrid'), document.getElementById('mySessionsEmpty'));
                
            } catch (err) {
                console.error('Search error:', err);
            }
        });
        
        // Add input event to handle real-time search
        const searchInput = document.getElementById('inlineSearchInput');
        if (searchInput) {
            let debounceTimer;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    if (e.target.value.length >= 2) {
                        searchForm.dispatchEvent(new Event('submit'));
                    }
                }, 500); 
            });
        }
    }
});
