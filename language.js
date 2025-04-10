// Vereenvoudigde versie van language.js
document.addEventListener('DOMContentLoaded', function() {
    // Probeer de opgeslagen taal te laden, gebruik nl als fallback
    let currentLang;
    try {
        currentLang = localStorage.getItem('preferredLanguage') || 'nl';
    } catch (e) {
        // Als localStorage niet beschikbaar is
        currentLang = 'nl';
    }

    // Functie om de pagina te vertalen
    function translatePage() {
        try {
            document.querySelectorAll('[data-i18n]').forEach(element => {
                const key = element.getAttribute('data-i18n');
                if (translations[currentLang] && translations[currentLang][key]) {
                    element.textContent = translations[currentLang][key];
                }
            });

            // Actieve taalknop markeren
            document.querySelectorAll('.lang-btn').forEach(btn => {
                if (btn.getAttribute('data-lang') === currentLang) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });

            // HTML lang attribuut bijwerken
            document.documentElement.lang = currentLang;
        } catch (error) {
            console.error('Vertaalfout:', error);
        }
    }

    // Taalwisseling afhandelen - met try-catch voor localStorage
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            currentLang = this.getAttribute('data-lang');
            try {
                localStorage.setItem('preferredLanguage', currentLang);
            } catch (e) {
                console.warn('Kan taalvoorkeur niet opslaan');
            }
            translatePage();
        });
    });

    // Initiële vertaling
    translatePage();

    // GEEN MutationObserver gebruiken - dit is een grote bron van problemen
});