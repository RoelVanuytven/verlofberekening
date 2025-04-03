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
    const inputs = document.querySelectorAll('.table-container:first-of-type .percentage-input');
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

    // Bereken het begrensde wettelijk verlof op basis van het gemiddelde percentage
    updateBegrensdWettelijkVerlof(average);

    return average; // Return de waarde voor gebruik in andere functies
}

// Update het begrensde wettelijk verlof op basis van het gemiddelde percentage
function updateBegrensdWettelijkVerlof(averagePercentage) {
    const maxWettelijkVerlof = parseFloat(document.getElementById('max-wettelijk-verlof').textContent);
    const begrensdWettelijkVerlof = (maxWettelijkVerlof * (averagePercentage / 100)).toFixed(2);
    document.getElementById('begrensd-wettelijk-verlof').textContent = begrensdWettelijkVerlof;

    // Update de tweede tabel met de nieuwe waarden
    updateTable();
}

// Functie voor het bijwerken van de verloftabel
function updateTable() {
    const maxWettelijkVerlof = parseFloat(document.getElementById('max-wettelijk-verlof').textContent);
    const begrensdWettelijkVerlof = parseFloat(document.getElementById('begrensd-wettelijk-verlof').textContent);

    // Array met alle maanden
    const maanden = [
        'januari', 'februari', 'maart', 'april', 'mei', 'juni',
        'juli', 'augustus', 'september', 'oktober', 'november', 'december'
    ];

    let cumulatiefPercentage = 0;

    // Loop door elke maand en update de waarden
    maanden.forEach((maand, index) => {
        // Selecteer de elementen voor deze maand
        const percentageInput = document.querySelector(`#verlof-tabel tr:nth-child(${index + 1}) .percentage-input:not(.opgenomen-uren)`);
        const opgenomenUrenInput = document.querySelector(`#verlof-tabel tr:nth-child(${index + 1}) .opgenomen-uren`);
        const wvStartCell = document.getElementById(`wv-start-${maand}`);
        const percentageWVCell = document.getElementById(`percentage-wv-${maand}`);
        const percentageWVTotaalCell = document.getElementById(`percentage-wv-totaal-${maand}`);

        if (!percentageInput || !opgenomenUrenInput || !wvStartCell || !percentageWVCell || !percentageWVTotaalCell) {
            console.error(`Elementen ontbreken voor de maand ${maand}`);
            return;
        }

        // Bereken de waarden
        const percentage = isNaN(parseFloat(percentageInput.value)) ? 0 : parseFloat(percentageInput.value) / 100;
        const opgenomenUren = isNaN(parseFloat(opgenomenUrenInput.value)) ? 0 : parseFloat(opgenomenUrenInput.value);

        let wvStart;
        if (index === 0) {
            // Voor januari: gebruik het begrensde wettelijk verlof of percentage * max wettelijk verlof
            wvStart = percentage === 1 ? begrensdWettelijkVerlof : percentage * maxWettelijkVerlof;
        } else {
            // Voor andere maanden: bereken op basis van vorige maand
            const vorigeMaand = maanden[index - 1];
            const vorigePercentageWVTotaalElem = document.getElementById(`percentage-wv-totaal-${vorigeMaand}`);
            const vorigePercentageWVTotaal = vorigePercentageWVTotaalElem ?
                parseFloat(vorigePercentageWVTotaalElem.textContent.replace('%', '')) / 100 : 0;

            wvStart = (percentage === 1 ? begrensdWettelijkVerlof : percentage * maxWettelijkVerlof) * (1 - vorigePercentageWVTotaal);
        }

        // Update de cellen met de berekende waarden
        wvStartCell.textContent = wvStart.toFixed(2);

        const percentageWV = wvStart > 0 ? (opgenomenUren / wvStart) * 100 : 0;
        percentageWVCell.textContent = `${percentageWV.toFixed(2)}%`;

        // Bereken het cumulatieve percentage
        cumulatiefPercentage += percentageWV;
        percentageWVTotaalCell.textContent = `${cumulatiefPercentage.toFixed(2)}%`;
    });
}

// Bereken het gemiddelde bij het laden van de pagina
document.addEventListener('DOMContentLoaded', function() {
    calculateAverage();

    // Voeg event listeners toe aan alle percentage-inputs in de eerste tabel
    const percentageInputs = document.querySelectorAll('.table-container:first-of-type .percentage-input');
    percentageInputs.forEach(input => {
        input.addEventListener('input', function() {
            validateInput(this);
            calculateAverage();
        });
    });

    // Voeg event listeners toe aan alle percentage-inputs in de tweede tabel
    const verlofPercentageInputs = document.querySelectorAll('#verlof-tabel .percentage-input');
    verlofPercentageInputs.forEach(input => {
        input.addEventListener('input', function() {
            validateInput(this);
            updateTable();
        });
    });

    // Voeg event listeners toe aan alle opgenomen-uren inputs
    const opgenomenUrenInputs = document.querySelectorAll('.opgenomen-uren');
    opgenomenUrenInputs.forEach(input => {
        input.addEventListener('input', updateTable);
    });
});