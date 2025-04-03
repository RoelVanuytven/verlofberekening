// Valideer de invoer om ervoor te zorgen dat deze binnen het bereik van 0-100 ligt
function validateInput(input) {
    const value = parseFloat(input.value);
    if (value < 0) {
        input.value = 0;
    } else if (value > 100) {
        input.value = 100;
    }
}

// Bereken het gemiddelde van de percentages
function calculateAverage() {
    const inputs = document.querySelectorAll('.percentage-input');
    let total = 0;

    // Doorloop alle 12 maanden
    inputs.forEach(input => {
        // Gebruik de ingevulde waarde of standaard 100 als het veld leeg is
        const value = input.value === '' ? 100 : parseFloat(input.value);
        total += value;
    });

    // Altijd delen door 12 maanden
    const average = (total / 12).toFixed(2);
    document.getElementById('average-percentage').textContent = `${average}%`;
}

// Zorg ervoor dat lege velden standaard 100 tonen in de placeholder
document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('.percentage-input');
    inputs.forEach(input => {
        input.placeholder = '100.00'; // Standaard placeholder
    });
});