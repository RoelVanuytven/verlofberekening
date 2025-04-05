// Standaardtaal instellen
let currentLang = localStorage.getItem('preferredLanguage') || 'nl';

// Alle elementen met data-i18n attribuut vertalen
function translatePage() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            // Controleer of het element een input is
            if (element.tagName === 'INPUT' && element.getAttribute('type') === 'placeholder') {
                element.placeholder = translations[currentLang][key];
            } else {
                element.textContent = translations[currentLang][key];
            }
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
}

// Taalwisseling afhandelen
document.addEventListener('DOMContentLoaded', () => {
    // Taalwisseling knoppen
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentLang = btn.getAttribute('data-lang');
            localStorage.setItem('preferredLanguage', currentLang);
            translatePage();
        });
    });

    // Initiële vertaling
    translatePage();

    // MutationObserver om dynamisch toegevoegde elementen te vertalen
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                translatePage();
            }
        });
    });

    // Start observeren van het document body voor wijzigingen
    observer.observe(document.body, { childList: true, subtree: true });
});