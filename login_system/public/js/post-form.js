document.addEventListener('DOMContentLoaded', function() {
    const postForm = document.getElementById('post-form');
    const locationInput = document.getElementById('location');
    const roomInput = document.getElementById('room');
    const timeInput = document.getElementById('time');
    const studyTopicsInput = document.getElementById('study-topics');
    const additionalNotesInput = document.getElementById('additional-notes');
    const tagsInput = document.getElementById('tags');
    const postsContainer = document.getElementById('posts-container');

    if (postForm) {
        postForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const payload = {
                location: locationInput.value,
                room: roomInput.value,
                time: timeInput.value,
                studyTopics: studyTopicsInput.value,
                additionalNotes: additionalNotesInput.value,
                tags: tagsInput.value
            };
            try {
                const res = await fetch('/post', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const saved = await res.json();
                document.getElementById('postFeedback').innerHTML = '<div class="alert alert-success">Post successful!</div>';
                postForm.reset();
            } catch (err) {
                console.error('Error saving post:', err);
            }
        });
    }
});
