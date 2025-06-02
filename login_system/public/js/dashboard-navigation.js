// Functions to toggle different views in the dashboard
function displayMap() {
    document.getElementById('map-container').style.display = 'block';
    document.getElementsByClassName('post-form-container')[0].style.display = 'none';
    document.getElementById('contact-form-container').style.display = 'none';
    document.getElementById('search-form-container').style.display = 'none';
}

function displayPostForm() {
    document.getElementsByClassName('post-form-container')[0].style.display = 'block';
    document.getElementById('map-container').style.display = 'none';
    document.getElementById('contact-form-container').style.display = 'none';
    document.getElementById('search-form-container').style.display = 'none';
}

function displayContactForm() {
    document.getElementById('contact-form-container').style.display = 'block';
    document.getElementsByClassName('post-form-container')[0].style.display = 'none';
    document.getElementById('map-container').style.display = 'none';
    document.getElementById('search-form-container').style.display = 'none';
}

async function displaySearchForm() {
    document.getElementById('search-form-container').style.display = 'block';
    document.getElementsByClassName('post-form-container')[0].style.display = 'none';
    document.getElementById('map').style.display = 'none';
    document.getElementById('contact-form-container').style.display = 'none';
    
    try {
        const res = await fetch('/api/search');
        const { results, mySessions } = await res.json();
        
        // Render my sessions
        const myDiv = document.getElementById('mySessionsGrid');
        const mySessionsEmpty = document.getElementById('mySessionsEmpty');
        
        myDiv.innerHTML = '';
        
        if (mySessions && mySessions.length > 0) {
            mySessions.forEach(item => {
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
                myDiv.appendChild(card);
            });
            mySessionsEmpty.style.display = 'none';
        } else {
            mySessionsEmpty.style.display = 'block';
        }
        
        // Render all sessions
        const resultsDiv = document.getElementById('inlineResults');
        const noResultsDiv = document.getElementById('noResults');
        
        resultsDiv.innerHTML = '';
        
        if (results && results.length > 0) {
            results.forEach(item => {
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
                resultsDiv.appendChild(card);
            });
            noResultsDiv.style.display = 'none';
        } else {
            noResultsDiv.textContent = 'No study sessions available.';
            noResultsDiv.style.display = 'block';
        }
    } catch (err) {
        console.error('Error loading posts:', err);
    }
}
