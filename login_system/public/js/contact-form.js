document.addEventListener('DOMContentLoaded', function() {
    emailjs.init("llMQau6hgp4Eu9e4M");

    const dashboardContactForm = document.getElementById('dashboardContactForm');
    if (dashboardContactForm) {
        dashboardContactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const serviceID = 'service_4qs9h3n';
            const templateID = 'template_bpww9cg';
            const templateParams = {
                from_name: this.name.value,
                from_email: this.email.value,
                message: this.message.value
            };

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
