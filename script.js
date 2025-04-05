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
    let vorigeWVStart = 0; // Voor het berekenen van WV Correctie
    let vorigeOpgenomenUren = 0; // Voor het berekenen van WV Correctie
    let vorigePercentage = null; // Voor het vergelijken van percentages

    // Loop door elke maand en update de waarden
    maanden.forEach((maand, index) => {
        // Selecteer de elementen voor deze maand
        const percentageInput = document.querySelector(`#verlof-tabel tr:nth-child(${index + 1}) .percentage-input:not(.opgenomen-uren)`);
        const opgenomenUrenInput = document.querySelector(`#verlof-tabel tr:nth-child(${index + 1}) .opgenomen-uren`);
        const wvStartCell = document.getElementById(`wv-start-${maand}`);
        const wvCorrectieCell = document.getElementById(`wv-correctie-${maand}`);
        const percentageWVCell = document.getElementById(`percentage-wv-${maand}`);
        const percentageWVTotaalCell = document.getElementById(`percentage-wv-totaal-${maand}`);

        // Selecteer ook het element in de detailtabel (als het bestaat)
        const detailPercentageCell = document.getElementById(`detail-percentage-${maand}`);

        if (!percentageInput || !opgenomenUrenInput || !wvStartCell || !wvCorrectieCell || !percentageWVCell || !percentageWVTotaalCell) {
            console.error(`Elementen ontbreken voor de maand ${maand}`);
            return;
        }

        // Bereken de waarden
        const percentage = isNaN(parseFloat(percentageInput.value)) ? 0 : parseFloat(percentageInput.value) / 100;
        const opgenomenUren = isNaN(parseFloat(opgenomenUrenInput.value)) ? 0 : parseFloat(opgenomenUrenInput.value);

        // Update de detailtabel als het element bestaat
        if (detailPercentageCell) {
            detailPercentageCell.textContent = (percentage * 100).toFixed(0);
        }

        let wvStart;
        if (index === 0) {
            // Voor januari: gebruik het juiste wettelijk verlof op basis van percentage
            wvStart = percentage === 1 ? begrensdWettelijkVerlof : percentage * maxWettelijkVerlof;
        } else {
            // Voor andere maanden
            const percentageGewijzigd = percentage !== vorigePercentage;

            if (percentageGewijzigd) {
                // Als het percentage is gewijzigd, bereken een nieuwe startwaarde
                // Bereken hoeveel procent van het totale verlof al is opgenomen
                const vorigeMaand = maanden[index - 1];
                const vorigePercentageWVTotaalElem = document.getElementById(`percentage-wv-totaal-${vorigeMaand}`);
                const vorigePercentageWVTotaal = vorigePercentageWVTotaalElem ?
                    parseFloat(vorigePercentageWVTotaalElem.textContent.replace('%', '')) / 100 : 0;

                // Bepaal het totale verlofrecht voor dit percentage
                const totaalVerlofrecht = percentage === 1 ? begrensdWettelijkVerlof : percentage * maxWettelijkVerlof;

                // Bereken hoeveel verlof nog beschikbaar is op basis van wat al is opgenomen
                wvStart = totaalVerlofrecht * (1 - vorigePercentageWVTotaal);
            } else {
                // Als het percentage niet is gewijzigd, gebruik de vorige WV Start min opgenomen uren
                wvStart = Math.max(0, vorigeWVStart - vorigeOpgenomenUren);
            }
        }

        // Update de cellen met de berekende waarden
        wvStartCell.textContent = wvStart.toFixed(2);

        // Bereken WV Correctie
        let wvCorrectie;
        if (index === 0) {
            // Voor januari: WV Start - Max wettelijk verlof
            wvCorrectie = wvStart - maxWettelijkVerlof;
        } else {
            // Voor andere maanden: WV Start - WV Start van vorige maand + WV Opgenomen vorige maand
            wvCorrectie = wvStart - vorigeWVStart + vorigeOpgenomenUren;
        }
        wvCorrectieCell.textContent = wvCorrectie.toFixed(2);

        // Bereken percentage WV opgenomen voor deze maand
        const percentageWV = wvStart > 0 ? (opgenomenUren / wvStart) * 100 : 0;
        percentageWVCell.textContent = `${percentageWV.toFixed(2)}%`;

        // Bereken het cumulatieve percentage
        if (index === 0) {
            // Voor januari is het cumulatieve percentage gelijk aan het percentage van deze maand
            cumulatiefPercentage = percentageWV;
        } else {
            // Voor andere maanden, tel het percentage van deze maand op bij het cumulatieve percentage
            // Maar alleen als er daadwerkelijk uren zijn opgenomen
            if (opgenomenUren > 0) {
                cumulatiefPercentage += percentageWV;
            }
        }

        percentageWVTotaalCell.textContent = `${cumulatiefPercentage.toFixed(2)}%`;

        // Bewaar waarden voor de volgende iteratie
        vorigeWVStart = wvStart;
        vorigeOpgenomenUren = opgenomenUren;
        vorigePercentage = percentage;
    });

    // Update de ADV en EL tabellen
    updateADVTable();
    updateELTable();
}

// Functie voor het bijwerken van de ADV tabel
function updateADVTable() {
    const maxADVVerlof = parseFloat(document.getElementById('max-adv-verlof').textContent);
    const maandelijksADV = maxADVVerlof / 12; // 16.33 uren per maand

    // Array met alle maanden
    const maanden = [
        'januari', 'februari', 'maart', 'april', 'mei', 'juni',
        'juli', 'augustus', 'september', 'oktober', 'november', 'december'
    ];

    let vorigeADVStart = 0;
    let vorigeADVOpgenomen = 0;
    let vorigePercentage = null;

    // Loop door elke maand en update de waarden
    maanden.forEach((maand, index) => {
        // Selecteer de elementen voor deze maand
        const percentageCell = document.getElementById(`detail-percentage-${maand}`);
        const advStartCell = document.getElementById(`adv-start-${maand}`);
        const advCorrectieCell = document.getElementById(`adv-correctie-${maand}`);
        const advOpgenomenInput = document.querySelector(`#details-tabel tr:nth-child(${index + 1}) .adv-opgenomen-uren`);

        if (!percentageCell || !advStartCell || !advCorrectieCell || !advOpgenomenInput) {
            console.error(`Elementen ontbreken voor de maand ${maand}`);
            return;
        }

        // Bereken de waarden
        const percentage = parseFloat(percentageCell.textContent) / 100;
        const advOpgenomen = isNaN(parseFloat(advOpgenomenInput.value)) ? 0 : parseFloat(advOpgenomenInput.value);

        let advStart;
        let advCorrectie = 0;

        if (index === 0) {
            // Voor januari: bereken ADV start op basis van percentage
            advStart = maxADVVerlof * percentage;
            advCorrectie = advStart - maxADVVerlof;
        } else {
            // Voor andere maanden
            const percentageGewijzigd = percentage !== vorigePercentage;

            if (percentageGewijzigd) {
                // Als het percentage is gewijzigd, bereken een nieuwe startwaarde en correctie
                const maandenTeGaan = 12 - index;
                const nieuweADVPerMaand = maandelijksADV * percentage;
                const totaalNieuwADV = nieuweADVPerMaand * maandenTeGaan;

                // Bereken hoeveel ADV er al is opgenomen
                let totaalOpgenomen = 0;
                for (let i = 0; i < index; i++) {
                    const opgenomenInput = document.querySelector(`#details-tabel tr:nth-child(${i + 1}) .adv-opgenomen-uren`);
                    if (opgenomenInput) {
                        totaalOpgenomen += isNaN(parseFloat(opgenomenInput.value)) ? 0 : parseFloat(opgenomenInput.value);
                    }
                }

                // Bereken hoeveel ADV er al is toegekend
                let totaalToegekend = 0;
                for (let i = 0; i < index; i++) {
                    const maandPercentage = parseFloat(document.getElementById(`detail-percentage-${maanden[i]}`).textContent) / 100;
                    totaalToegekend += maandelijksADV * maandPercentage;
                }

                // Bereken wat er nog beschikbaar is
                const beschikbaarADV = (totaalToegekend - totaalOpgenomen) + totaalNieuwADV;

                // Bereken correctie (verschil tussen nieuwe beschikbare ADV en wat er zou zijn zonder wijziging)
                const oudeADVStart = Math.max(0, vorigeADVStart - vorigeADVOpgenomen);
                advCorrectie = beschikbaarADV - oudeADVStart;
                advStart = beschikbaarADV;
            } else {
                // Als het percentage niet is gewijzigd, gebruik de vorige ADV Start min opgenomen uren
                advStart = Math.max(0, vorigeADVStart - vorigeADVOpgenomen);
                advCorrectie = 0;
            }
        }

        // Update de cellen met de berekende waarden
        advStartCell.textContent = advStart.toFixed(2);
        advCorrectieCell.textContent = advCorrectie.toFixed(2);

        // Beperk de opgenomen uren tot het beschikbare ADV
        if (advOpgenomen > advStart) {
            advOpgenomenInput.value = advStart.toFixed(2);
        }

        // Bewaar waarden voor de volgende iteratie
        vorigeADVStart = advStart;
        vorigeADVOpgenomen = isNaN(parseFloat(advOpgenomenInput.value)) ? 0 : parseFloat(advOpgenomenInput.value);
        vorigePercentage = percentage;
    });
}

// Functie voor het bijwerken van de EL (extralegaal verlof) tabel
function updateELTable() {
    const maxELVerlof = parseFloat(document.getElementById('max-extralegaal-verlof').textContent);
    const maandelijksEL = maxELVerlof / 12; // 2 uren per maand

    // Array met alle maanden
    const maanden = [
        'januari', 'februari', 'maart', 'april', 'mei', 'juni',
        'juli', 'augustus', 'september', 'oktober', 'november', 'december'
    ];

    let vorigeELStart = 0;
    let vorigeELOpgenomen = 0;
    let vorigePercentage = null;

    // Loop door elke maand en update de waarden
    maanden.forEach((maand, index) => {
        // Selecteer de elementen voor deze maand
        const percentageCell = document.getElementById(`detail-percentage-${maand}`);
        const elStartCell = document.getElementById(`el-start-${maand}`);
        const elCorrectieCell = document.getElementById(`el-correctie-${maand}`);
        const elOpgenomenInput = document.querySelector(`#details-tabel tr:nth-child(${index + 1}) .el-opgenomen-uren`);

        if (!percentageCell || !elStartCell || !elCorrectieCell || !elOpgenomenInput) {
            console.error(`Elementen ontbreken voor de maand ${maand}`);
            return;
        }

        // Bereken de waarden
        const percentage = parseFloat(percentageCell.textContent) / 100;
        const elOpgenomen = isNaN(parseFloat(elOpgenomenInput.value)) ? 0 : parseFloat(elOpgenomenInput.value);

        let elStart;
        let elCorrectie = 0;

        if (index === 0) {
            // Voor januari: bereken EL start op basis van percentage
            elStart = maxELVerlof * percentage;
            elCorrectie = elStart - maxELVerlof;
        } else {
            // Voor andere maanden
            const percentageGewijzigd = percentage !== vorigePercentage;

            if (percentageGewijzigd) {
                // Als het percentage is gewijzigd, bereken een nieuwe startwaarde en correctie
                const maandenTeGaan = 12 - index;
                const nieuweELPerMaand = maandelijksEL * percentage;
                const totaalNieuwEL = nieuweELPerMaand * maandenTeGaan;

                // Bereken hoeveel EL er al is opgenomen
                let totaalOpgenomen = 0;
                for (let i = 0; i < index; i++) {
                    const opgenomenInput = document.querySelector(`#details-tabel tr:nth-child(${i + 1}) .el-opgenomen-uren`);
                    if (opgenomenInput) {
                        totaalOpgenomen += isNaN(parseFloat(opgenomenInput.value)) ? 0 : parseFloat(opgenomenInput.value);
                    }
                }

                // Bereken hoeveel EL er al is toegekend
                let totaalToegekend = 0;
                for (let i = 0; i < index; i++) {
                    const maandPercentage = parseFloat(document.getElementById(`detail-percentage-${maanden[i]}`).textContent) / 100;
                    totaalToegekend += maandelijksEL * maandPercentage;
                }

                // Bereken wat er nog beschikbaar is
                const beschikbaarEL = (totaalToegekend - totaalOpgenomen) + totaalNieuwEL;

                // Bereken correctie (verschil tussen nieuwe beschikbare EL en wat er zou zijn zonder wijziging)
                const oudeELStart = Math.max(0, vorigeELStart - vorigeELOpgenomen);
                elCorrectie = beschikbaarEL - oudeELStart;
                elStart = beschikbaarEL;
            } else {
                // Als het percentage niet is gewijzigd, gebruik de vorige EL Start min opgenomen uren
                elStart = Math.max(0, vorigeELStart - vorigeELOpgenomen);
                elCorrectie = 0;
            }
        }

        // Update de cellen met de berekende waarden
        elStartCell.textContent = elStart.toFixed(2);
        elCorrectieCell.textContent = elCorrectie.toFixed(2);

        // Beperk de opgenomen uren tot het beschikbare EL
        if (elOpgenomen > elStart) {
            elOpgenomenInput.value = elStart.toFixed(2);
        }

        // Bewaar waarden voor de volgende iteratie
        vorigeELStart = elStart;
        vorigeELOpgenomen = isNaN(parseFloat(elOpgenomenInput.value)) ? 0 : parseFloat(elOpgenomenInput.value);
        vorigePercentage = percentage;
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

    // Voeg event listeners toe aan alle ADV opgenomen-uren inputs
    const advOpgenomenUrenInputs = document.querySelectorAll('.adv-opgenomen-uren');
    advOpgenomenUrenInputs.forEach(input => {
        input.addEventListener('input', updateADVTable);
    });

    // Voeg event listeners toe aan alle EL opgenomen-uren inputs
    const elOpgenomenUrenInputs = document.querySelectorAll('.el-opgenomen-uren');
    elOpgenomenUrenInputs.forEach(input => {
        input.addEventListener('input', updateELTable);
    });

    // Initialiseer de ADV en EL tabellen
    updateADVTable();
    updateELTable();
});