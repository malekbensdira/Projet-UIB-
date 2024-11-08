document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('file-upload');
    const fileNameDisplay = document.getElementById('file-name-display');
    const errorMessage = document.getElementById('error-message');
    const form = document.getElementById('upload-form');
    const animatedText = document.getElementById('animated-text');
    const logo = document.querySelector('.logo');

    // Mettre à jour le texte du nom du fichier ou afficher un message par défaut
    fileInput.addEventListener('change', function() {
        const fileName = fileInput.files[0] ? fileInput.files[0].name : 'Aucun fichier sélectionné';
        fileNameDisplay.textContent = fileName;
        errorMessage.style.display = 'none'; // Masquer le message d'erreur
    });

    // Vérifier si un fichier est sélectionné lors de la soumission du formulaire
    form.addEventListener('submit', function(event) {
        if (!fileInput.files.length) {
            event.preventDefault(); // Empêcher l'envoi du formulaire
            errorMessage.style.display = 'block'; // Afficher le message d'erreur
        }
    });

    // Animation du logo
    function animateLogo() {
        logo.classList.add('zoom-in'); // Ajouter l'animation de zoom au logo
    }

    // Animation du texte tapé
    function typeWriter() {
        const text = "Veuillez insérer votre bilan !";
        let i = 0;

        function type() {
            if (i < text.length) {
                animatedText.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, 100); // Vitesse de frappe
            }
        }
        type();
    }

    // Ajouter l'effet flottant après que le texte soit entièrement affiché
    function startTextAnimation() {
        animatedText.classList.add('floating-effect');
    }

    // Démarrer les animations
    function startAnimations() {
        animateLogo();
        setTimeout(() => {
            typeWriter();
            setTimeout(startTextAnimation, 1000); // Délai avant d'ajouter l'effet flottant
        }, 1000); // Délai avant de commencer l'animation du texte
    }

    // Délai avant le début des animations
    setTimeout(startAnimations, 1000); // Délai avant le début des animations
});
