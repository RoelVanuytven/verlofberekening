document.addEventListener('DOMContentLoaded', function () {
    let currentLang;

    try {
        currentLang = localStorage.getItem('preferredLanguage') || 'nl';
    } catch (e) {
        currentLang = 'nl';
    }

    function translatePage() {
        try {
            document.querySelectorAll('[data-i18n]').forEach(element => {
                const key = element.getAttribute('data-i18n');

                if (translations[currentLang] && translations[currentLang][key]) {
                    element.textContent = translations[currentLang][key];
                }
            });

            document.querySelectorAll('[data-i18n-aria-label]').forEach(element => {
                const key = element.getAttribute('data-i18n-aria-label');

                if (translations[currentLang] && translations[currentLang][key]) {
                    element.setAttribute('aria-label', translations[currentLang][key]);
                }
            });

            document.querySelectorAll('[data-i18n-title]').forEach(element => {
                const key = element.getAttribute('data-i18n-title');

                if (translations[currentLang] && translations[currentLang][key]) {
                    element.setAttribute('title', translations[currentLang][key]);
                }
            });

            document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
                const key = element.getAttribute('data-i18n-placeholder');

                if (translations[currentLang] && translations[currentLang][key]) {
                    element.setAttribute('placeholder', translations[currentLang][key]);
                }
            });

            document.querySelectorAll('.lang-btn').forEach(btn => {
                if (btn.getAttribute('data-lang') === currentLang) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });

            document.documentElement.lang = currentLang;
        } catch (error) {
            console.error('Vertaalfout:', error);
        }
    }

    window.translatePage = translatePage;

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            currentLang = this.getAttribute('data-lang');

            try {
                localStorage.setItem('preferredLanguage', currentLang);
            } catch (e) {
                console.warn('Kan taalvoorkeur niet opslaan');
            }

            translatePage();
        });
    });

    translatePage();
});
