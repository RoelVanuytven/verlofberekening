function formatPercentageInputZonderDecimalen(input) {
    if (!input) {
        return;
    }

    if (input.value === '') {
        return;
    }

    const value = parseFloat(input.value);

    if (isNaN(value)) {
        input.value = '';
        return;
    }

    input.value = Math.round(value);
}

function calculateAverage() {
    const vorigJaarInputs = document.querySelectorAll('#tabel-tewerkstelling tbody tr td:nth-child(2) .percentage-input');
    const huidigJaarInputs = document.querySelectorAll('#tabel-tewerkstelling .huidig-percentage-input');

    let totalVorigJaar = 0;
    let totalHuidigJaar = 0;

    vorigJaarInputs.forEach(input => {
        formatPercentageInputZonderDecimalen(input);
        const value = input.value === '' ? 100 : parseFloat(input.value);
        totalVorigJaar += value;
    });

    huidigJaarInputs.forEach(input => {
        formatPercentageInputZonderDecimalen(input);
        const value = input.value === '' ? 100 : parseFloat(input.value);
        totalHuidigJaar += value;
    });

    const averageVorigJaar = (totalVorigJaar / 12).toFixed(2);
    const averageHuidigJaar = (totalHuidigJaar / 12).toFixed(2);

    const averageVorigJaarElement = document.getElementById('average-percentage-vorig-jaar');
    if (averageVorigJaarElement) {
        averageVorigJaarElement.textContent = `${averageVorigJaar}%`;
    }

    const averageHuidigJaarElement = document.getElementById('average-percentage-huidig-jaar');
    if (averageHuidigJaarElement) {
        averageHuidigJaarElement.textContent = `${averageHuidigJaar}%`;
    }

    updateBegrensdWettelijkVerlof(averageVorigJaar);

    if (typeof saveToSessionStorage === 'function') {
        saveToSessionStorage();
    }

    return {
        averageVorigJaar,
        averageHuidigJaar
    };
}

function updateBegrensdWettelijkVerlof(averagePercentage) {
    const maxWettelijkVerlofElement = document.getElementById('max-wettelijk-verlof');
    const begrensdWettelijkVerlofElement = document.getElementById('begrensd-wettelijk-verlof');

    if (!maxWettelijkVerlofElement || !begrensdWettelijkVerlofElement) {
        return;
    }

    const maxWettelijkVerlof = parseFloat(maxWettelijkVerlofElement.textContent);
    const begrensdWettelijkVerlof = (maxWettelijkVerlof * (averagePercentage / 100)).toFixed(1);

    begrensdWettelijkVerlofElement.textContent = begrensdWettelijkVerlof;

    if (typeof updateTable === 'function') {
        updateTable();
    }
}

function updateHuidigePercentagesInTewerkstellingTable() {
    const maanden = [
        'januari', 'februari', 'maart', 'april', 'mei', 'juni',
        'juli', 'augustus', 'september', 'oktober', 'november', 'december'
    ];

    maanden.forEach((maand, index) => {
        const row = document.querySelector(`#verlof-tabel tr:nth-child(${index + 1})`);
        const huidigPercentageInputTabel1 = document.getElementById(`huidig-percentage-${maand}`);

        if (!row || !huidigPercentageInputTabel1) {
            return;
        }

        const huidigPercentageInputTabel2 = row.querySelector('.percentage-input:not(.opgenomen-uren)');
        if (!huidigPercentageInputTabel2) {
            return;
        }

        const waarde = huidigPercentageInputTabel2.value === '' ? '100' : huidigPercentageInputTabel2.value;
        huidigPercentageInputTabel1.value = Math.round(parseFloat(waarde));
    });

    calculateAverage();
}

function initializeTewerkstellingTable() {
    const vorigJaarInputs = document.querySelectorAll('#tabel-tewerkstelling tbody tr td:nth-child(2) .percentage-input');
    const huidigJaarInputs = document.querySelectorAll('#tabel-tewerkstelling .huidig-percentage-input');

    vorigJaarInputs.forEach(input => {
        input.addEventListener('input', function () {
            if (typeof validateInput === 'function') {
                validateInput(this);
            }
            formatPercentageInputZonderDecimalen(this);
            calculateAverage();
        });

        input.addEventListener('blur', function () {
            if (typeof validateInput === 'function') {
                validateInput(this);
            }
            formatPercentageInputZonderDecimalen(this);
            calculateAverage();
        });
    });

    huidigJaarInputs.forEach(input => {
        input.addEventListener('input', function () {
            if (typeof validateInput === 'function') {
                validateInput(this);
            }
            formatPercentageInputZonderDecimalen(this);
            calculateAverage();
        });

        input.addEventListener('blur', function () {
            if (typeof validateInput === 'function') {
                validateInput(this);
            }
            formatPercentageInputZonderDecimalen(this);
            calculateAverage();
        });
    });

    calculateAverage();
    updateHuidigePercentagesInTewerkstellingTable();
}