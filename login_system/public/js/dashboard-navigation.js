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
    document.getElementById('map-container').style.display = 'none';
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

function appendChatBubble(html, sender = 'bot') {
    const messages = document.getElementById('mapChatMessages');
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender}`;
    bubble.innerHTML = html;
    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
    return bubble;
}

function getPuterText(response) {
    if (!response) return '';
    if (typeof response === 'string') return response;
    if (typeof response.text === 'string' && response.text.trim()) return response.text;
    if (typeof response.output === 'string' && response.output.trim()) return response.output;
    if (response?.message?.content) {
        if (typeof response.message.content === 'string') return response.message.content;
        if (Array.isArray(response.message.content)) {
            return response.message.content.map(part => typeof part === 'string' ? part : JSON.stringify(part)).join('');
        }
    }
    return JSON.stringify(response);
}

async function submitRecommendations() {
    const profileText = document.getElementById('mapChatInput').value.trim();
    const messages = document.getElementById('mapChatMessages');

    if (!profileText) {
        appendChatBubble('<p>Please describe the study environment you need.</p>', 'bot');
        return;
    }

    appendChatBubble(`<p>${profileText}</p>`, 'user');
    const loadingBubble = appendChatBubble('<p>Thinking... generating study spot recommendations.</p>', 'bot');
    document.getElementById('mapChatInput').value = '';

    try {
        if (!window.puter) {
            loadingBubble.innerHTML = '<p><strong>Error:</strong> Puter.js failed to load. Please refresh the page.</p>';
            return;
        }

        const prompt = `You are a study spot recommendation assistant. Based on the user profile below, provide up to 3 specific study location suggestions and include why each one is a good fit. Do not ask follow-up questions. User profile: ${profileText}`;

        const response = await puter.ai.chat(prompt, {
            model: 'gpt-5.4-nano',
            temperature: 0.6,
            max_tokens: 320
        });

        const text = getPuterText(response).trim();
        if (!text) {
            loadingBubble.innerHTML = '<p><strong>Error:</strong> Received no text from Puter AI.</p>';
            return;
        }

        loadingBubble.innerHTML = `<p>${text.replace(/\n/g, '<br>')}</p>`;
    } catch (err) {
        console.error('Puter AI error:', err);
        loadingBubble.innerHTML = '<p><strong>Error:</strong> Unable to reach Puter AI. Please try again later.</p>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const sendButton = document.getElementById('mapChatSendButton');
    if (sendButton) {
        sendButton.addEventListener('click', submitRecommendations);
    }

    const chatInput = document.getElementById('mapChatInput');
    if (chatInput) {
        chatInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                submitRecommendations();
            }
        });
    }
});
