document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('searchForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const query = this.query.value;
    try {
      const res = await fetch('/api/search?query=' + encodeURIComponent(query));
      const { results } = await res.json();
      const container = document.getElementById('results-container');
      container.innerHTML = '';
      if (results.length > 0) {
        const list = document.createElement('ul');
        list.className = 'list-group';
        results.forEach(item => {
          const li = document.createElement('li');
          li.className = 'list-group-item';
          li.innerHTML = `
            <p><strong>Location:</strong> ${item.location}</p>
            <p><strong>Room:</strong> ${item.room}</p>
            <p><strong>Time:</strong> ${item.time}</p>
            <p><strong>Topics:</strong> ${item.studyTopics}</p>
            <p><strong>Tags:</strong> ${item.tags}</p>
            <p><strong>Notes:</strong> ${item.additionalNotes}</p>
          `;
          list.appendChild(li);
        });
        container.appendChild(list);
      } else {
        container.innerHTML = `<p>No sessions found matching "${query}".</p>`;
      }
    } catch (err) {
      console.error('Search error:', err);
    }
  });
});
