document.addEventListener('DOMContentLoaded', function() {
    // Read credentials from meta tags
    const publicKey = document.querySelector('meta[name="emailjs-public-key"]')?.content;
    const serviceID = document.querySelector('meta[name="emailjs-service-id"]')?.content;
    const templateID = document.querySelector('meta[name="emailjs-template-id"]')?.content;
    
    if (publicKey) {
        emailjs.init(publicKey);
    } else {
        console.error('EmailJS public key not found in meta tags');
    }

    const dashboardContactForm = document.getElementById('dashboardContactForm');
    if (dashboardContactForm) {
        dashboardContactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const templateParams = {
                from_name: this.name.value,
                from_email: this.email.value,
                message: this.message.value
            };

            if (!serviceID || !templateID) {
                console.error('EmailJS credentials missing', { serviceID, templateID });
                document.getElementById('dashboardContactFeedback').innerHTML = '<div class="alert alert-danger">Configuration error. Please try again later.</div>';
                return;
            }

            emailjs.send(serviceID, templateID, templateParams)
                .then(() => {
                    document.getElementById('dashboardContactFeedback').innerHTML = '<div class="alert alert-success">Message sent successfully!</div>';
                    this.reset();
                }, (err) => {
                    console.error('EmailJS error:', err);
                    document.getElementById('dashboardContactFeedback').innerHTML = '<div class="alert alert-danger">Failed to send message. Please try again later.</div>';
                });
        });
    }
});
