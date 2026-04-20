function parseLocaleNumber(value) {
    if (value === null || value === undefined) {
        return NaN;
    }

    return parseFloat(String(value).replace(',', '.'));
}

function updateTable() {
    const maxWettelijkVerlofElement = document.getElementById('max-wettelijk-verlof');
    const begrensdWettelijkVerlofElement = document.getElementById('begrensd-wettelijk-verlof');

    if (!maxWettelijkVerlofElement || !begrensdWettelijkVerlofElement) {
        return;
    }

    const maxWettelijkVerlof = parseLocaleNumber(maxWettelijkVerlofElement.textContent);
    const begrensdWettelijkVerlof = parseLocaleNumber(begrensdWettelijkVerlofElement.textContent);

    const maanden = [
        'januari', 'februari', 'maart', 'april', 'mei', 'juni',
        'juli', 'augustus', 'september', 'oktober', 'november', 'december'
    ];

    let cumulatiefPercentage = 0;
    let vorigeWVStart = 0;
    let vorigeOpgenomenUren = 0;
    let vorigePercentageWaarde = null;

    maanden.forEach((maand, index) => {
        const row = document.querySelector(`#verlof-tabel tr:nth-child(${index + 1})`);
        if (!row) {
            console.error(`Rij ontbreekt voor de maand ${maand}`);
            return;
        }

        const percentageInput = row.querySelector('.percentage-input:not(.opgenomen-uren)');
        const opgenomenUrenInput = row.querySelector('.opgenomen-uren');
        const wvStartCell = document.getElementById(`wv-start-${maand}`);
        const wvCorrectieCell = document.getElementById(`wv-correctie-${maand}`);
        const percentageWVCell = document.getElementById(`percentage-wv-${maand}`);
        const percentageWVTotaalCell = document.getElementById(`percentage-wv-totaal-${maand}`);
        const detailPercentageCell = document.getElementById(`detail-percentage-${maand}`);
        const huidigPercentageInput = document.getElementById(`huidig-percentage-${maand}`);

        if (!percentageInput || !opgenomenUrenInput || !wvStartCell || !wvCorrectieCell || !percentageWVCell || !percentageWVTotaalCell) {
            console.error(`Elementen ontbreken voor de maand ${maand}`);
            return;
        }

        let percentageWaarde;

        if (huidigPercentageInput) {
            percentageWaarde = isNaN(parseLocaleNumber(huidigPercentageInput.value)) ? 0 : parseLocaleNumber(huidigPercentageInput.value);
            percentageInput.value = percentageWaarde;
        } else {
            percentageWaarde = isNaN(parseLocaleNumber(percentageInput.value)) ? 0 : parseLocaleNumber(percentageInput.value);
        }

        const opgenomenUren = isNaN(parseLocaleNumber(opgenomenUrenInput.value)) ? 0 : parseLocaleNumber(opgenomenUrenInput.value);

        if (detailPercentageCell) {
            detailPercentageCell.textContent = percentageWaarde.toFixed(0);
        }

        let wvStart;

        if (index === 0) {
            wvStart = percentageWaarde === 100
                ? begrensdWettelijkVerlof
                : (percentageWaarde / 100) * maxWettelijkVerlof;
        } else {
            const percentageGewijzigd = percentageWaarde !== vorigePercentageWaarde;

            if (percentageGewijzigd) {
                const totaalVerlofrechtVoorDezeMaand = percentageWaarde === 100
                    ? begrensdWettelijkVerlof
                    : (percentageWaarde / 100) * maxWettelijkVerlof;

                wvStart = totaalVerlofrechtVoorDezeMaand * (1 - (cumulatiefPercentage / 100));
            } else {
                wvStart = Math.max(0, vorigeWVStart - vorigeOpgenomenUren);
            }
        }

        wvStart = Math.max(0, wvStart);
        wvStartCell.textContent = wvStart.toFixed(2);

        if (opgenomenUren > wvStart) {
            opgenomenUrenInput.value = wvStart.toFixed(2);
        }

        const opgenomenUrenBegrensd = isNaN(parseLocaleNumber(opgenomenUrenInput.value)) ? 0 : parseLocaleNumber(opgenomenUrenInput.value);

        let wvCorrectie;
        if (index === 0) {
            wvCorrectie = wvStart - maxWettelijkVerlof;
        } else {
            wvCorrectie = wvStart - vorigeWVStart + vorigeOpgenomenUren;
        }

        wvCorrectieCell.textContent = wvCorrectie.toFixed(2);

        const totaalVerlofrechtVoorDezeMaand = percentageWaarde === 100
            ? begrensdWettelijkVerlof
            : (percentageWaarde / 100) * maxWettelijkVerlof;

        const percentageWV = totaalVerlofrechtVoorDezeMaand > 0
            ? (opgenomenUrenBegrensd / totaalVerlofrechtVoorDezeMaand) * 100
            : 0;

        percentageWVCell.textContent = `${percentageWV.toFixed(2)}%`;

        cumulatiefPercentage += percentageWV;
        percentageWVTotaalCell.textContent = `${cumulatiefPercentage.toFixed(2)}%`;

        vorigeWVStart = wvStart;
        vorigeOpgenomenUren = opgenomenUrenBegrensd;
        vorigePercentageWaarde = percentageWaarde;
    });

    if (typeof updateADVTable === 'function') updateADVTable();
    if (typeof updateELTable === 'function') updateELTable();
    if (typeof updateANCTable === 'function') updateANCTable();

    if (typeof saveToSessionStorage === 'function') {
        saveToSessionStorage();
    }
}

function initializeWettelijkVerlofTable() {
    const rows = document.querySelectorAll('#verlof-tabel tr');

    rows.forEach((row, index) => {
        const maand = MAANDEN[index];
        const percentageInput = row.querySelector('.percentage-input:not(.opgenomen-uren)');
        const opgenomenUrenInput = row.querySelector('.opgenomen-uren');

        if (percentageInput) {
            percentageInput.addEventListener('input', function () {
                if (typeof validateInput === 'function') {
                    validateInput(this);
                }
                updateTable();
            });

            percentageInput.addEventListener('blur', function () {
                if (typeof validateInput === 'function') {
                    validateInput(this);
                }
                updateTable();
            });
        }

        if (opgenomenUrenInput) {
            opgenomenUrenInput.addEventListener('input', function () {
                const value = parseLocaleNumber(this.value);

                if (!isNaN(value) && value < 0) {
                    this.value = 0;
                }

                updateTable();
            });

            opgenomenUrenInput.addEventListener('blur', function () {
                if (typeof validateOpgenomenUren === 'function') {
                    validateOpgenomenUren(this, maand);
                }

                const value = parseLocaleNumber(this.value);
                if (!isNaN(value)) {
                    this.value = value.toFixed(2);
                }

                updateTable();
            });
        }
    });

    updateTable();
}
