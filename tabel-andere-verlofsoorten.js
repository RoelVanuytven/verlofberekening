function getCascadeVerdelingVoorRij(index) {
    const maand = MAANDEN[index];
    const row = document.querySelector(`#details-tabel tr:nth-child(${index + 1})`);

    if (!row || !maand) {
        return { cascade: 0, adv: 0, el: 0, anc: 0 };
    }

    const cascadeInput = row.querySelector('.cascade-opgenomen-uren');
    const advCell = document.getElementById(`adv-opgenomen-${maand}`);
    const elCell = document.getElementById(`el-opgenomen-${maand}`);

    const cascade = isNaN(parseLocaleNumber(cascadeInput ? cascadeInput.value : 0)) ? 0 : parseLocaleNumber(cascadeInput.value);
    const adv = isNaN(parseLocaleNumber(advCell ? advCell.textContent : 0)) ? 0 : parseLocaleNumber(advCell.textContent);
    const el = isNaN(parseLocaleNumber(elCell ? elCell.textContent : 0)) ? 0 : parseLocaleNumber(elCell.textContent);

    return {
        cascade,
        adv,
        el,
        anc: Math.max(0, cascade - adv - el)
    };
}

function getGemiddeldHuidigJaarPercentage() {
    const averageHuidigJaarElement = document.getElementById('average-percentage-huidig-jaar');

    if (averageHuidigJaarElement) {
        const percentageTekst = averageHuidigJaarElement.textContent.replace('%', '').trim();
        const percentageWaarde = parseLocaleNumber(percentageTekst);

        if (!isNaN(percentageWaarde)) {
            return percentageWaarde / 100;
        }
    }

    const huidigJaarInputs = document.querySelectorAll('#tabel-tewerkstelling .huidig-percentage-input');
    if (!huidigJaarInputs.length) {
        return 1;
    }

    let totaal = 0;

    huidigJaarInputs.forEach((input) => {
        const waarde = input.value === '' ? 100 : parseLocaleNumber(input.value);
        totaal += isNaN(waarde) ? 100 : waarde;
    });

    return (totaal / huidigJaarInputs.length) / 100;
}

function updateMaxAncieniteitsverlof() {
    const maxAncElement = document.getElementById('max-ancieniteits-verlof');
    if (!maxAncElement) {
        return 0;
    }

    const basisAncienniteitsverlof = typeof berekenAncienniteitsverlof === 'function' ? berekenAncienniteitsverlof() : 0;

    maxAncElement.textContent = basisAncienniteitsverlof.toFixed(2);

    return basisAncienniteitsverlof;
}

function updateCascadeBeschikbaarTable() {
    MAANDEN.forEach((maand) => {
        const advStartCell = document.getElementById(`adv-start-${maand}`);
        const elStartCell = document.getElementById(`el-start-${maand}`);
        const ancStartCell = document.getElementById(`anc-start-${maand}`);
        const cascadeBeschikbaarCell = document.getElementById(`cascade-beschikbaar-${maand}`);

        if (!advStartCell || !elStartCell || !ancStartCell || !cascadeBeschikbaarCell) {
            return;
        }

        const advStart = isNaN(parseLocaleNumber(advStartCell.textContent)) ? 0 : parseLocaleNumber(advStartCell.textContent);
        const elStart = isNaN(parseLocaleNumber(elStartCell.textContent)) ? 0 : parseLocaleNumber(elStartCell.textContent);
        const ancStart = isNaN(parseLocaleNumber(ancStartCell.textContent)) ? 0 : parseLocaleNumber(ancStartCell.textContent);

        const cascadeBeschikbaar = advStart + elStart + ancStart;
        cascadeBeschikbaarCell.textContent = cascadeBeschikbaar.toFixed(2);
    });
}

function updateADVTable() {
    const maxADVVerlofElement = document.getElementById('max-adv-verlof');
    if (!maxADVVerlofElement) {
        return;
    }

    const maxADVVerlof = typeof parseLocaleNumber === 'function'
        ? parseLocaleNumber(maxADVVerlofElement.textContent)
        : parseFloat(String(maxADVVerlofElement.textContent).replace(',', '.'));

    const maandelijksADV = maxADVVerlof / 12;

    let vorigeADVStart = 0;
    let vorigeADVOpgenomen = 0;
    let vorigePercentage = null;

    MAANDEN.forEach((maand, index) => {
        const percentageCell = document.getElementById(`detail-percentage-${maand}`);
        const advStartCell = document.getElementById(`adv-start-${maand}`);
        const advCorrectieCell = document.getElementById(`adv-correctie-${maand}`);
        const advOpgenomenCell = document.getElementById(`adv-opgenomen-${maand}`);

        if (!percentageCell || !advStartCell || !advCorrectieCell || !advOpgenomenCell) {
            console.error(`Elementen ontbreken voor de maand ${maand}`);
            return;
        }

        const percentage = (typeof parseLocaleNumber === 'function'
            ? parseLocaleNumber(percentageCell.textContent)
            : parseFloat(String(percentageCell.textContent).replace(',', '.'))) / 100;

        const cascadeInput = document.querySelector(`#details-tabel tr:nth-child(${index + 1}) .cascade-opgenomen-uren`);
        const cascadeOpgenomen = isNaN(typeof parseLocaleNumber === 'function'
            ? parseLocaleNumber(cascadeInput ? cascadeInput.value : 0)
            : parseFloat(String(cascadeInput ? cascadeInput.value : 0).replace(',', '.')))
            ? 0
            : (typeof parseLocaleNumber === 'function'
                ? parseLocaleNumber(cascadeInput ? cascadeInput.value : 0)
                : parseFloat(String(cascadeInput ? cascadeInput.value : 0).replace(',', '.')));

        let advOpgenomen = 0;
        let advStart;
        let advCorrectie = 0;

        if (index === 0) {
            advStart = maxADVVerlof * percentage;
            advCorrectie = advStart - maxADVVerlof;
        } else {
            const percentageGewijzigd = percentage !== vorigePercentage;

            if (percentageGewijzigd) {
                const maandenTeGaan = 12 - index;
                const nieuweADVPerMaand = maandelijksADV * percentage;
                const totaalNieuwADV = nieuweADVPerMaand * maandenTeGaan;

                let totaalOpgenomen = 0;
                for (let i = 0; i < index; i++) {
                    const opgenomenCell = document.getElementById(`adv-opgenomen-${MAANDEN[i]}`);
                    if (opgenomenCell) {
                        const waarde = typeof parseLocaleNumber === 'function'
                            ? parseLocaleNumber(opgenomenCell.textContent)
                            : parseFloat(String(opgenomenCell.textContent).replace(',', '.'));

                        totaalOpgenomen += isNaN(waarde) ? 0 : waarde;
                    }
                }

                let totaalToegekend = 0;
                for (let i = 0; i < index; i++) {
                    const maandPercentageCell = document.getElementById(`detail-percentage-${MAANDEN[i]}`);
                    const maandPercentageWaarde = maandPercentageCell
                        ? (typeof parseLocaleNumber === 'function'
                            ? parseLocaleNumber(maandPercentageCell.textContent)
                            : parseFloat(String(maandPercentageCell.textContent).replace(',', '.')))
                        : 0;

                    const maandPercentage = isNaN(maandPercentageWaarde) ? 0 : maandPercentageWaarde / 100;
                    totaalToegekend += maandelijksADV * maandPercentage;
                }

                const beschikbaarADV = (totaalToegekend - totaalOpgenomen) + totaalNieuwADV;
                const oudeADVStart = Math.max(0, vorigeADVStart - vorigeADVOpgenomen);

                advCorrectie = beschikbaarADV - oudeADVStart;
                advStart = beschikbaarADV;
            } else {
                advStart = Math.max(0, vorigeADVStart - vorigeADVOpgenomen);
                advCorrectie = 0;
            }
        }

        advOpgenomen = Math.min(cascadeOpgenomen, advStart);

        advStartCell.textContent = advStart.toFixed(2);
        advCorrectieCell.textContent = advCorrectie.toFixed(2);
        advOpgenomenCell.textContent = advOpgenomen.toFixed(2);

        vorigeADVStart = advStart;
        vorigeADVOpgenomen = advOpgenomen;
        vorigePercentage = percentage;
    });

    updateCascadeBeschikbaarTable();

    if (typeof saveToSessionStorage === 'function') {
        saveToSessionStorage();
    }
}

function updateELTable() {
    const maxELVerlofElement = document.getElementById('max-extralegaal-verlof');
    if (!maxELVerlofElement) {
        return;
    }

    const maxELVerlof = typeof parseLocaleNumber === 'function'
        ? parseLocaleNumber(maxELVerlofElement.textContent)
        : parseFloat(String(maxELVerlofElement.textContent).replace(',', '.'));

    const maandelijksEL = maxELVerlof / 12;

    let vorigeELStart = 0;
    let vorigeELOpgenomen = 0;
    let vorigePercentage = null;

    MAANDEN.forEach((maand, index) => {
        const percentageCell = document.getElementById(`detail-percentage-${maand}`);
        const elStartCell = document.getElementById(`el-start-${maand}`);
        const elCorrectieCell = document.getElementById(`el-correctie-${maand}`);
        const elOpgenomenCell = document.getElementById(`el-opgenomen-${maand}`);

        if (!percentageCell || !elStartCell || !elCorrectieCell || !elOpgenomenCell) {
            console.error(`Elementen ontbreken voor de maand ${maand}`);
            return;
        }

        const percentage = (typeof parseLocaleNumber === 'function'
            ? parseLocaleNumber(percentageCell.textContent)
            : parseFloat(String(percentageCell.textContent).replace(',', '.'))) / 100;

        const verdeling = getCascadeVerdelingVoorRij(index);
        const resterendNaADV = Math.max(0, verdeling.cascade - verdeling.adv);

        let elOpgenomen = 0;
        let elStart;
        let elCorrectie = 0;

        if (index === 0) {
            elStart = maxELVerlof * percentage;
            elCorrectie = elStart - maxELVerlof;
        } else {
            const percentageGewijzigd = percentage !== vorigePercentage;

            if (percentageGewijzigd) {
                const maandenTeGaan = 12 - index;
                const nieuweELPerMaand = maandelijksEL * percentage;
                const totaalNieuwEL = nieuweELPerMaand * maandenTeGaan;

                let totaalOpgenomen = 0;
                for (let i = 0; i < index; i++) {
                    const opgenomenCell = document.getElementById(`el-opgenomen-${MAANDEN[i]}`);
                    if (opgenomenCell) {
                        const waarde = typeof parseLocaleNumber === 'function'
                            ? parseLocaleNumber(opgenomenCell.textContent)
                            : parseFloat(String(opgenomenCell.textContent).replace(',', '.'));

                        totaalOpgenomen += isNaN(waarde) ? 0 : waarde;
                    }
                }

                let totaalToegekend = 0;
                for (let i = 0; i < index; i++) {
                    const maandPercentageCell = document.getElementById(`detail-percentage-${MAANDEN[i]}`);
                    const maandPercentageWaarde = maandPercentageCell
                        ? (typeof parseLocaleNumber === 'function'
                            ? parseLocaleNumber(maandPercentageCell.textContent)
                            : parseFloat(String(maandPercentageCell.textContent).replace(',', '.')))
                        : 0;

                    const maandPercentage = isNaN(maandPercentageWaarde) ? 0 : maandPercentageWaarde / 100;
                    totaalToegekend += maandelijksEL * maandPercentage;
                }

                const beschikbaarEL = (totaalToegekend - totaalOpgenomen) + totaalNieuwEL;
                const oudeELStart = Math.max(0, vorigeELStart - vorigeELOpgenomen);

                elCorrectie = beschikbaarEL - oudeELStart;
                elStart = beschikbaarEL;
            } else {
                elStart = Math.max(0, vorigeELStart - vorigeELOpgenomen);
                elCorrectie = 0;
            }
        }

        elOpgenomen = Math.min(resterendNaADV, elStart);

        elStartCell.textContent = elStart.toFixed(2);
        elCorrectieCell.textContent = elCorrectie.toFixed(2);
        elOpgenomenCell.textContent = elOpgenomen.toFixed(2);

        vorigeELStart = elStart;
        vorigeELOpgenomen = elOpgenomen;
        vorigePercentage = percentage;
    });

    updateCascadeBeschikbaarTable();

    if (typeof saveToSessionStorage === 'function') {
        saveToSessionStorage();
    }
}

function updateANCTable() {
    const maxANCVerlof = updateMaxAncieniteitsverlof();

    const maxANCVerlofElement = document.getElementById('max-ancieniteits-verlof');
    if (!maxANCVerlofElement) {
        return;
    }

    const maandelijksANC = maxANCVerlof / 12;

    let vorigeANCStart = 0;
    let vorigeANCOpgenomen = 0;
    let vorigePercentage = null;

    MAANDEN.forEach((maand, index) => {
        const percentageCell = document.getElementById(`detail-percentage-${maand}`);
        const ancStartCell = document.getElementById(`anc-start-${maand}`);
        const ancCorrectieCell = document.getElementById(`anc-correctie-${maand}`);
        const ancOpgenomenCell = document.getElementById(`anc-opgenomen-${maand}`);

        if (!percentageCell || !ancStartCell || !ancCorrectieCell || !ancOpgenomenCell) {
            console.error(`Elementen ontbreken voor de maand ${maand}`);
            return;
        }

        const percentage = (typeof parseLocaleNumber === 'function'
            ? parseLocaleNumber(percentageCell.textContent)
            : parseFloat(String(percentageCell.textContent).replace(',', '.'))) / 100;

        const verdeling = getCascadeVerdelingVoorRij(index);
        const resterendNaADVEnEL = Math.max(0, verdeling.cascade - verdeling.adv - verdeling.el);

        let ancOpgenomen = 0;
        let ancStart;
        let ancCorrectie = 0;

        if (index === 0) {
            ancStart = maxANCVerlof * percentage;
            ancCorrectie = ancStart - maxANCVerlof;
        } else {
            const percentageGewijzigd = percentage !== vorigePercentage;

            if (percentageGewijzigd) {
                const maandenTeGaan = 12 - index;
                const nieuweANCPerMaand = maandelijksANC * percentage;
                const totaalNieuwANC = nieuweANCPerMaand * maandenTeGaan;

                let totaalOpgenomen = 0;
                for (let i = 0; i < index; i++) {
                    const opgenomenCell = document.getElementById(`anc-opgenomen-${MAANDEN[i]}`);
                    if (opgenomenCell) {
                        const waarde = typeof parseLocaleNumber === 'function'
                            ? parseLocaleNumber(opgenomenCell.textContent)
                            : parseFloat(String(opgenomenCell.textContent).replace(',', '.'));

                        totaalOpgenomen += isNaN(waarde) ? 0 : waarde;
                    }
                }

                let totaalToegekend = 0;
                for (let i = 0; i < index; i++) {
                    const maandPercentageCell = document.getElementById(`detail-percentage-${MAANDEN[i]}`);
                    const maandPercentageWaarde = maandPercentageCell
                        ? (typeof parseLocaleNumber === 'function'
                            ? parseLocaleNumber(maandPercentageCell.textContent)
                            : parseFloat(String(maandPercentageCell.textContent).replace(',', '.')))
                        : 0;

                    const maandPercentage = isNaN(maandPercentageWaarde) ? 0 : maandPercentageWaarde / 100;
                    totaalToegekend += maandelijksANC * maandPercentage;
                }

                const beschikbaarANC = (totaalToegekend - totaalOpgenomen) + totaalNieuwANC;
                const oudeANCStart = Math.max(0, vorigeANCStart - vorigeANCOpgenomen);

                ancCorrectie = beschikbaarANC - oudeANCStart;
                ancStart = beschikbaarANC;
            } else {
                ancStart = Math.max(0, vorigeANCStart - vorigeANCOpgenomen);
                ancCorrectie = 0;
            }
        }

        ancOpgenomen = Math.min(resterendNaADVEnEL, ancStart);

        ancStartCell.textContent = ancStart.toFixed(2);
        ancCorrectieCell.textContent = ancCorrectie.toFixed(2);
        ancOpgenomenCell.textContent = ancOpgenomen.toFixed(2);

        vorigeANCStart = ancStart;
        vorigeANCOpgenomen = ancOpgenomen;
        vorigePercentage = percentage;
    });

    updateCascadeBeschikbaarTable();

    if (typeof saveToSessionStorage === 'function') {
        saveToSessionStorage();
    }
}

function beperkCascadeTotBeschikbaar(index) {
    const maand = MAANDEN[index];
    const row = document.querySelector(`#details-tabel tr:nth-child(${index + 1})`);

    if (!row || !maand) {
        return 0;
    }

    const cascadeInput = row.querySelector('.cascade-opgenomen-uren');
    const advStartCell = document.getElementById(`adv-start-${maand}`);
    const elStartCell = document.getElementById(`el-start-${maand}`);
    const ancStartCell = document.getElementById(`anc-start-${maand}`);

    if (!cascadeInput || !advStartCell || !elStartCell || !ancStartCell) {
        return 0;
    }

    let cascadeWaarde = isNaN(parseLocaleNumber(cascadeInput.value)) ? 0 : parseLocaleNumber(cascadeInput.value);

    const advStart = isNaN(parseLocaleNumber(advStartCell.textContent)) ? 0 : parseLocaleNumber(advStartCell.textContent);
    const elStart = isNaN(parseLocaleNumber(elStartCell.textContent)) ? 0 : parseLocaleNumber(elStartCell.textContent);
    const ancStart = isNaN(parseLocaleNumber(ancStartCell.textContent)) ? 0 : parseLocaleNumber(ancStartCell.textContent);

    const maxCascade = advStart + elStart + ancStart;

    if (cascadeWaarde < 0) {
        cascadeWaarde = 0;
    }

    if (cascadeWaarde > maxCascade) {
        cascadeWaarde = maxCascade;
        cascadeInput.value = maxCascade.toFixed(2);
    }

    return cascadeWaarde;
}

function initializeAndereVerlofsoortenTable() {
    const rows = document.querySelectorAll('#details-tabel tr');

    rows.forEach((row) => {
        const cascadeInput = row.querySelector('.cascade-opgenomen-uren');

        if (cascadeInput) {
            cascadeInput.addEventListener('input', function () {
                if (typeof normalizeDecimalInputValue === 'function') {
                    normalizeDecimalInputValue(this);
                }

                const value = typeof parseLocaleNumber === 'function'
                    ? parseLocaleNumber(this.value)
                    : parseFloat(String(this.value).replace(',', '.'));

                if (!isNaN(value) && value < 0) {
                    this.value = '0.00';
                }

                updateADVTable();
                updateELTable();
                updateANCTable();
                beperkCascadeTotBeschikbaar(Array.from(rows).indexOf(row));
                updateADVTable();
                updateELTable();
                updateANCTable();
                updateCascadeBeschikbaarTable();
            });

            cascadeInput.addEventListener('blur', function () {
                if (typeof normalizeDecimalInputValue === 'function') {
                    normalizeDecimalInputValue(this);
                }

                const value = typeof parseLocaleNumber === 'function'
                    ? parseLocaleNumber(this.value)
                    : parseFloat(String(this.value).replace(',', '.'));

                if (isNaN(value) || value < 0) {
                    this.value = '0.00';
                } else {
                    this.value = value.toFixed(2);
                }

                updateADVTable();
                updateELTable();
                updateANCTable();
                beperkCascadeTotBeschikbaar(Array.from(rows).indexOf(row));
                updateADVTable();
                updateELTable();
                updateANCTable();
                updateCascadeBeschikbaarTable();
            });
        }
    });

    updateADVTable();
    updateELTable();
    updateANCTable();
    updateCascadeBeschikbaarTable();
}