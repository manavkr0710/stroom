document.addEventListener('DOMContentLoaded', function() {
    const successPopup = document.querySelector('.success-popup');
    if (successPopup) {
        setTimeout(function() {
            successPopup.style.display = 'none';
        }, 5000);
    }
});
