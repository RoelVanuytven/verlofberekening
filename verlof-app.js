const MAANDEN = [
    'januari', 'februari', 'maart', 'april', 'mei', 'juni',
    'juli', 'augustus', 'september', 'oktober', 'november', 'december'
];

function parseLocaleNumber(value) {
    if (value === null || value === undefined) {
        return NaN;
    }

    return parseFloat(String(value).replace(',', '.'));
}

function normalizeDecimalInputValue(input) {
    if (!input || typeof input.value !== 'string') {
        return;
    }

    input.value = input.value.replace(',', '.');
}

// Laad een HTML-deelbestand in een container
async function loadPartial(containerId, filePath) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container niet gevonden: ${containerId}`);
        return;
    }

    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Kan ${filePath} niet laden (${response.status})`);
        }

        const html = await response.text();
        container.innerHTML = html;
    } catch (error) {
        console.error(`Fout bij laden van ${filePath}:`, error);
        container.innerHTML = `<p style="color:red;">Fout bij laden van ${filePath}</p>`;
    }
}

// Laad alle tabellen in de hoofdpagina
async function loadAllPartials() {
    await loadPartial('tabel-tewerkstelling-container', 'tabel-tewerkstelling.html');
    await loadPartial('tabel-wettelijk-verlof-container', 'tabel-wettelijk-verlof.html');
    await loadPartial('tabel-andere-verlofsoorten-container', 'tabel-andere-verlofsoorten.html');
}

// Functie om de cookie-melding te tonen
function showCookieConsent() {
    if (sessionStorage.getItem('cookieConsent') === 'accepted') {
        return;
    }

    const overlay = document.createElement('div');
    overlay.className = 'cookie-overlay';

    const consentBox = document.createElement('div');
    consentBox.className = 'cookie-consent';

    const cookieTitle = document.createElement('h3');
    cookieTitle.setAttribute('data-i18n', 'cookie_title');
    cookieTitle.textContent = 'Cookie-melding';

    const cookieText = document.createElement('p');
    cookieText.setAttribute('data-i18n', 'cookie_text');
    cookieText.textContent = 'Deze site gebruikt cookies om uw ervaring te verbeteren en uw voorkeuren op te slaan.';

    const acceptButton = document.createElement('button');
    acceptButton.id = 'accept-cookies';
    acceptButton.className = 'cookie-button';
    acceptButton.setAttribute('data-i18n', 'accept_cookies');
    acceptButton.textContent = 'Accepteren';

    consentBox.appendChild(cookieTitle);
    consentBox.appendChild(cookieText);
    consentBox.appendChild(acceptButton);

    overlay.appendChild(consentBox);
    document.body.appendChild(overlay);

    document.getElementById('accept-cookies').addEventListener('click', function () {
        sessionStorage.setItem('cookieConsent', 'accepted');
        overlay.style.display = 'none';
    });

    if (typeof translatePage === 'function') {
        translatePage();
    }
}

// Valideer de invoer voor percentagevelden (0-100)
function validateInput(input) {
    normalizeDecimalInputValue(input);
    const value = parseLocaleNumber(input.value);

    if (isNaN(value)) {
        input.value = '';
        return;
    }

    if (value < 0) {
        input.value = 0;
    } else if (value > 100) {
        input.value = 100;
    }

    saveToSessionStorage();
}

// Valideer de opgenomen uren invoer (wettelijk verlof)
function validateOpgenomenUren(input, maand) {
    normalizeDecimalInputValue(input);
    const value = parseLocaleNumber(input.value);

    if (isNaN(value)) {
        input.value = 0;
        return;
    }

    if (value < 0) {
        input.value = 0;
    }

    const wvStartCell = document.getElementById(`wv-start-${maand}`);
    if (wvStartCell) {
        const wvStart = parseLocaleNumber(wvStartCell.textContent);
        if (value > wvStart) {
            input.value = wvStart.toFixed(1);
        }
    }

    saveToSessionStorage();
}

// Valideer opgenomen uren voor ADV, EL en ANC
function validateOpgenomenVerlof(input, type) {
    normalizeDecimalInputValue(input);
    const value = parseLocaleNumber(input.value);

    if (isNaN(value)) {
        input.value = 0;
        return;
    }

    if (value < 0) {
        input.value = 0;
    }

    const row = input.closest('tr');
    if (!row) {
        saveToSessionStorage();
        return;
    }

    let startCellIdPrefix = '';
    if (type === 'adv') startCellIdPrefix = 'adv-start-';
    if (type === 'el') startCellIdPrefix = 'el-start-';
    if (type === 'anc') startCellIdPrefix = 'anc-start-';

    const maandCell = row.querySelector('td:first-child');
    const maandTekst = maandCell ? maandCell.textContent.trim().toLowerCase() : '';
    const beschikbaarCell = document.getElementById(`${startCellIdPrefix}${maandTekst}`);

    if (beschikbaarCell) {
        const beschikbaar = parseLocaleNumber(beschikbaarCell.textContent);
        if (value > beschikbaar) {
            input.value = beschikbaar.toFixed(1);
        }
    }

    saveToSessionStorage();
}

// Geef enkel de velden terug die effectief invulbaar zijn
function getOpslaanbareGegevens() {
    const vorigJaarInputs = document.querySelectorAll('#tabel-tewerkstelling tbody tr td:nth-child(2) .percentage-input');
    const huidigJaarInputs = document.querySelectorAll('#tabel-tewerkstelling .huidig-percentage-input');
    const opgenomenUrenInputs = document.querySelectorAll('.opgenomen-uren');
    const cascadeOpgenomenInputs = document.querySelectorAll('.cascade-opgenomen-uren');
    const startDateInput = document.getElementById('startDate');

    return {
        vorigJaarPercentages: Array.from(vorigJaarInputs).map(input => input.value || '100'),
        huidigJaarPercentages: Array.from(huidigJaarInputs).map(input => input.value || '100'),
        opgenomenUren: Array.from(opgenomenUrenInputs).map(input => input.value || '0'),
        cascadeOpgenomenUren: Array.from(cascadeOpgenomenInputs).map(input => input.value || '0'),
        startDate: startDateInput ? startDateInput.value : ''
    };
}

// Sla alle invoerwaarden op in sessionStorage
function saveToSessionStorage() {
    const data = getOpslaanbareGegevens();

    sessionStorage.setItem('vorigJaarPercentages', JSON.stringify(data.vorigJaarPercentages));
    sessionStorage.setItem('huidigJaarPercentages', JSON.stringify(data.huidigJaarPercentages));
    sessionStorage.setItem('opgenomenUren', JSON.stringify(data.opgenomenUren));
    sessionStorage.setItem('cascadeOpgenomenUren', JSON.stringify(data.cascadeOpgenomenUren));
    sessionStorage.setItem('startDate', data.startDate);
}

// Laad opgeslagen waarden uit sessionStorage
function loadFromSessionStorage() {
    const vorigJaarPercentages = JSON.parse(sessionStorage.getItem('vorigJaarPercentages'));
    if (vorigJaarPercentages) {
        const vorigJaarInputs = document.querySelectorAll('#tabel-tewerkstelling tbody tr td:nth-child(2) .percentage-input');
        vorigJaarPercentages.forEach((value, index) => {
            if (index < vorigJaarInputs.length) {
                vorigJaarInputs[index].value = value;
            }
        });
    }

    const huidigJaarPercentages = JSON.parse(sessionStorage.getItem('huidigJaarPercentages'));
    if (huidigJaarPercentages) {
        const huidigJaarInputs = document.querySelectorAll('#tabel-tewerkstelling .huidig-percentage-input');
        huidigJaarPercentages.forEach((value, index) => {
            if (index < huidigJaarInputs.length) {
                huidigJaarInputs[index].value = value;
            }
        });
    }

    const opgenomenUren = JSON.parse(sessionStorage.getItem('opgenomenUren'));
    if (opgenomenUren) {
        const opgenomenUrenInputs = document.querySelectorAll('.opgenomen-uren');
        opgenomenUren.forEach((value, index) => {
            if (index < opgenomenUrenInputs.length) {
                opgenomenUrenInputs[index].value = value;
            }
        });
    }

    const cascadeOpgenomenUren = JSON.parse(sessionStorage.getItem('cascadeOpgenomenUren'));
    if (cascadeOpgenomenUren) {
        const cascadeOpgenomenInputs = document.querySelectorAll('.cascade-opgenomen-uren');
        cascadeOpgenomenUren.forEach((value, index) => {
            if (index < cascadeOpgenomenInputs.length) {
                cascadeOpgenomenInputs[index].value = value;
            }
        });
    }

    const startDate = sessionStorage.getItem('startDate');
    const startDateInput = document.getElementById('startDate');
    if (startDateInput) {
        if (startDate) {
            startDateInput.value = startDate;
        } else {
            setDefaultDate();
        }
    }

    if (typeof calculateAverage === 'function') calculateAverage();
    if (typeof updateTable === 'function') updateTable();
    if (typeof updateADVTable === 'function') updateADVTable();
    if (typeof updateELTable === 'function') updateELTable();
    if (typeof updateANCTable === 'function') updateANCTable();
    if (typeof updateHuidigePercentagesInTewerkstellingTable === 'function') updateHuidigePercentagesInTewerkstellingTable();
}

// Functie om de huidige datum in te stellen als standaardwaarde
function setDefaultDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    const dateInput = document.getElementById('startDate');
    if (dateInput) {
        dateInput.value = formattedDate;
        sessionStorage.setItem('startDate', formattedDate);
    }
}

// Bereken ancienniteitsverlof op basis van jaren dienst
function berekenAncienniteitsverlof() {
    const startDateInput = document.getElementById('startDate');
    const startDate = startDateInput ? startDateInput.value : '';

    if (!startDate) return 24;

    const startDatum = new Date(startDate);
    const huidigeDatum = new Date();
    const huidigJaar = huidigeDatum.getFullYear();

    const jarenDienst = huidigJaar - startDatum.getFullYear();

    let aantalUren = 0;

    if (jarenDienst >= 35) {
        aantalUren = 64;
    } else if (jarenDienst >= 30) {
        aantalUren = 56;
    } else if (jarenDienst >= 25) {
        aantalUren = 48;
    } else if (jarenDienst >= 20) {
        aantalUren = 40;
    } else if (jarenDienst >= 15) {
        aantalUren = 32;
    } else if (jarenDienst >= 10) {
        aantalUren = 24;
    } else if (jarenDienst >= 5) {
        aantalUren = 16;
    } else if (jarenDienst >= 1) {
        aantalUren = 8;
    } else {
        aantalUren = 24;
    }

    return aantalUren;
}

// Werk de startdatum bij en herbereken alles
function updateStartDate() {
    const selectedDate = document.getElementById('startDate').value;
    const ancienniteitsverlof = berekenAncienniteitsverlof();

    const maxAncElement = document.getElementById('max-ancieniteits-verlof');
    if (maxAncElement) {
        maxAncElement.textContent = ancienniteitsverlof.toFixed(1);
    }

    if (typeof updateTable === 'function') updateTable();
    if (typeof updateADVTable === 'function') updateADVTable();
    if (typeof updateELTable === 'function') updateELTable();
    if (typeof updateANCTable === 'function') updateANCTable();
    if (typeof updateHuidigePercentagesInTewerkstellingTable === 'function') updateHuidigePercentagesInTewerkstellingTable();

    sessionStorage.setItem('startDate', selectedDate);
}

// Wis alle opgeslagen gegevens behalve cookieconsent
function clearSessionStorage() {
    const cookieConsent = sessionStorage.getItem('cookieConsent');

    sessionStorage.clear();

    if (cookieConsent) {
        sessionStorage.setItem('cookieConsent', cookieConsent);
    }

    location.reload();
}

// Exporteer alle invoerwaarden naar CSV
function exportToCSV() {
    const data = getOpslaanbareGegevens();

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'type,value\n';
    csvContent += `startDate,${data.startDate}\n`;

    data.vorigJaarPercentages.forEach((value, index) => {
        csvContent += `vorigJaarPercentage_${index},${value}\n`;
    });

    data.huidigJaarPercentages.forEach((value, index) => {
        csvContent += `huidigJaarPercentage_${index},${value}\n`;
    });

    data.opgenomenUren.forEach((value, index) => {
        csvContent += `opgenomenUren_${index},${value}\n`;
    });

    data.cascadeOpgenomenUren.forEach((value, index) => {
        csvContent += `cascadeOpgenomenUren_${index},${value}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'verlofgegevens.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Start import van CSV
function importFromCSV() {
    let fileInput = document.getElementById('importFile');

    if (!fileInput) {
        fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.id = 'importFile';
        fileInput.accept = '.csv';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);
        fileInput.addEventListener('change', handleFileImport);
    }

    fileInput.click();
}

// Verwerk geïmporteerd CSV-bestand
function handleFileImport(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (loadEvent) {
        const csvData = loadEvent.target.result;
        const lines = csvData.split('\n');
        const data = {};

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line) {
                const [key, value] = line.split(',');
                data[key] = value;
            }
        }

        if (data.startDate && document.getElementById('startDate')) {
            document.getElementById('startDate').value = data.startDate;
        }

        const vorigJaarInputs = document.querySelectorAll('#tabel-tewerkstelling tbody tr td:nth-child(2) .percentage-input');
        vorigJaarInputs.forEach((input, index) => {
            const value = data[`vorigJaarPercentage_${index}`];
            if (value !== undefined) {
                input.value = value;
            }
        });

        const huidigJaarInputs = document.querySelectorAll('#tabel-tewerkstelling .huidig-percentage-input');
        huidigJaarInputs.forEach((input, index) => {
            const value = data[`huidigJaarPercentage_${index}`];
            if (value !== undefined) {
                input.value = value;
            }
        });

        const opgenomenUrenInputs = document.querySelectorAll('.opgenomen-uren');
        opgenomenUrenInputs.forEach((input, index) => {
            const value = data[`opgenomenUren_${index}`];
            if (value !== undefined) {
                input.value = value;
            }
        });

        const cascadeOpgenomenInputs = document.querySelectorAll('.cascade-opgenomen-uren');
        cascadeOpgenomenInputs.forEach((input, index) => {
            const value = data[`cascadeOpgenomenUren_${index}`];
            if (value !== undefined) {
                input.value = value;
            }
        });

        updateStartDate();
        if (typeof calculateAverage === 'function') calculateAverage();
        if (typeof updateTable === 'function') updateTable();
        if (typeof updateADVTable === 'function') updateADVTable();
        if (typeof updateELTable === 'function') updateELTable();
        if (typeof updateANCTable === 'function') updateANCTable();
        if (typeof updateHuidigePercentagesInTewerkstellingTable === 'function') updateHuidigePercentagesInTewerkstellingTable();

        saveToSessionStorage();

        alert('Gegevens succesvol geïmporteerd!');
    };

    reader.readAsText(file);
}

// Koppel alle globale events
function bindGlobalEvents() {
    const allNumericInputs = document.querySelectorAll('input[type="number"]');

    allNumericInputs.forEach(input => {
        input.addEventListener('input', function () {
            normalizeDecimalInputValue(this);
            const value = parseLocaleNumber(this.value);
            if (!isNaN(value) && value < 0) {
                this.value = 0;
            }
        });

        input.addEventListener('blur', function () {
            normalizeDecimalInputValue(this);

            if (
                this.classList.contains('adv-opgenomen-uren') ||
                this.classList.contains('el-opgenomen-uren') ||
                this.classList.contains('anc-opgenomen-uren') ||
                this.classList.contains('cascade-opgenomen-uren')
            ) {
                const value = parseLocaleNumber(this.value);
                if (isNaN(value)) {
                    this.value = '0.00';
                } else if (value < 0) {
                    this.value = '0.00';
                } else {
                    this.value = value.toFixed(2);
                }
                saveToSessionStorage();
            } else if (this.classList.contains('percentage-input') && !this.classList.contains('opgenomen-uren')) {
                validateInput(this);
            } else if (this.classList.contains('opgenomen-uren')) {
                const row = this.closest('tr');
                const maandCell = row ? row.querySelector('td:first-child') : null;
                const maandText = maandCell ? maandCell.textContent.toLowerCase() : '';
                validateOpgenomenUren(this, maandText);
            } else {
                const value = parseLocaleNumber(this.value);
                if (isNaN(value)) {
                    this.value = 0;
                } else if (value < 0) {
                    this.value = 0;
                }
                saveToSessionStorage();
            }
        });
    });

    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) clearBtn.addEventListener('click', clearSessionStorage);

    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) exportBtn.addEventListener('click', exportToCSV);

    const importBtn = document.getElementById('importBtn');
    if (importBtn) importBtn.addEventListener('click', importFromCSV);

    const importFile = document.getElementById('importFile');
    if (importFile) importFile.addEventListener('change', handleFileImport);

    const startDate = document.getElementById('startDate');
    if (startDate) startDate.addEventListener('change', updateStartDate);
}

// Initialisatie
document.addEventListener('DOMContentLoaded', async function () {
    await loadAllPartials();

    showCookieConsent();

    const maxAncElement = document.getElementById('max-ancieniteits-verlof');
    if (maxAncElement && (maxAncElement.textContent === '' || maxAncElement.textContent === '0' || maxAncElement.textContent === '0.00')) {
        maxAncElement.textContent = berekenAncienniteitsverlof().toFixed(1);
    }

    bindGlobalEvents();
    loadFromSessionStorage();

    if (typeof initializeTewerkstellingTable === 'function') initializeTewerkstellingTable();
    if (typeof initializeWettelijkVerlofTable === 'function') initializeWettelijkVerlofTable();
    if (typeof initializeAndereVerlofsoortenTable === 'function') initializeAndereVerlofsoortenTable();
    if (typeof updateHuidigePercentagesInTewerkstellingTable === 'function') updateHuidigePercentagesInTewerkstellingTable();
});
