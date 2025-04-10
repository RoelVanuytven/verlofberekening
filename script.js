// Functie om de cookie-melding te tonen
function showCookieConsent() {
    // Controleer of de gebruiker al heeft ingestemd
    if (sessionStorage.getItem('cookieConsent') === 'accepted') {
        return; // Toon geen melding als al is ingestemd
    }

    // Maak een overlay element
    const overlay = document.createElement('div');
    overlay.className = 'cookie-overlay';

    // Maak een container voor de cookie-melding
    const consentBox = document.createElement('div');
    consentBox.className = 'cookie-consent';

    // Voeg de tekst toe met data-i18n attributen
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

    // Voeg de elementen toe aan de pagina
    overlay.appendChild(consentBox);
    document.body.appendChild(overlay);

    // Voeg een event listener toe aan de accepteer-knop
    document.getElementById('accept-cookies').addEventListener('click', function() {
        sessionStorage.setItem('cookieConsent', 'accepted');
        overlay.style.display = 'none';
    });

    // Vertaal de cookie melding
    translatePage();
}

// Valideer de invoer voor percentage velden (0-100)
function validateInput(input) {
    const value = parseFloat(input.value);
    if (value < 0) {
        input.value = 0;
    } else if (value > 100) {
        input.value = 100;
    }

    // Sla de waarde op in sessionStorage
    saveToSessionStorage();
}

// Valideer de opgenomen uren invoer (beperkt tot beschikbare uren)
function validateOpgenomenUren(input, maand) {
    const value = parseFloat(input.value);
    if (value < 0) {
        input.value = 0;
    }

    // Haal de beschikbare uren op voor deze maand
    const wvStartCell = document.getElementById(`wv-start-${maand}`);
    if (wvStartCell) {
        const wvStart = parseFloat(wvStartCell.textContent);
        if (value > wvStart) {
            input.value = wvStart.toFixed(1);
        }
    }

    // Sla de waarde op in sessionStorage
    saveToSessionStorage();
}

// Functie om alle invoerwaarden op te slaan in sessionStorage
function saveToSessionStorage() {
    // Sla de percentages van de eerste tabel op
    const percentageInputs = document.querySelectorAll('.table-container:first-of-type .percentage-input');
    const percentages = Array.from(percentageInputs).map(input => input.value);
    sessionStorage.setItem('percentages', JSON.stringify(percentages));

    // Sla de percentages van de tweede tabel op
    const verlofPercentageInputs = document.querySelectorAll('#verlof-tabel .percentage-input:not(.opgenomen-uren)');
    const verlofPercentages = Array.from(verlofPercentageInputs).map(input => input.value);
    sessionStorage.setItem('verlofPercentages', JSON.stringify(verlofPercentages));

    // Sla de opgenomen uren van de tweede tabel op
    const opgenomenUrenInputs = document.querySelectorAll('.opgenomen-uren');
    const opgenomenUren = Array.from(opgenomenUrenInputs).map(input => input.value);
    sessionStorage.setItem('opgenomenUren', JSON.stringify(opgenomenUren));

    // Sla de ADV opgenomen uren op
    const advOpgenomenUrenInputs = document.querySelectorAll('.adv-opgenomen-uren');
    const advOpgenomenUren = Array.from(advOpgenomenUrenInputs).map(input => input.value);
    sessionStorage.setItem('advOpgenomenUren', JSON.stringify(advOpgenomenUren));

    // Sla de EL opgenomen uren op
    const elOpgenomenUrenInputs = document.querySelectorAll('.el-opgenomen-uren');
    const elOpgenomenUren = Array.from(elOpgenomenUrenInputs).map(input => input.value);
    sessionStorage.setItem('elOpgenomenUren', JSON.stringify(elOpgenomenUren));

    // Sla de ANC opgenomen uren op
    const ancOpgenomenUrenInputs = document.querySelectorAll('.anc-opgenomen-uren');
    const ancOpgenomenUren = Array.from(ancOpgenomenUrenInputs).map(input => input.value);
    sessionStorage.setItem('ancOpgenomenUren', JSON.stringify(ancOpgenomenUren));

    // Sla de startdatum op
    const startDate = document.getElementById('startDate').value;
    sessionStorage.setItem('startDate', startDate);
}

// Functie om opgeslagen waarden uit sessionStorage te laden
function loadFromSessionStorage() {
    // Laad de percentages van de eerste tabel
    const percentages = JSON.parse(sessionStorage.getItem('percentages'));
    if (percentages) {
        const percentageInputs = document.querySelectorAll('.table-container:first-of-type .percentage-input');
        percentages.forEach((value, index) => {
            if (index < percentageInputs.length) {
                percentageInputs[index].value = value;
            }
        });
    }

    // Laad de percentages van de tweede tabel
    const verlofPercentages = JSON.parse(sessionStorage.getItem('verlofPercentages'));
    if (verlofPercentages) {
        const verlofPercentageInputs = document.querySelectorAll('#verlof-tabel .percentage-input:not(.opgenomen-uren)');
        verlofPercentages.forEach((value, index) => {
            if (index < verlofPercentageInputs.length) {
                verlofPercentageInputs[index].value = value;
            }
        });
    }

    // Laad de opgenomen uren van de tweede tabel
    const opgenomenUren = JSON.parse(sessionStorage.getItem('opgenomenUren'));
    if (opgenomenUren) {
        const opgenomenUrenInputs = document.querySelectorAll('.opgenomen-uren');
        opgenomenUren.forEach((value, index) => {
            if (index < opgenomenUrenInputs.length) {
                opgenomenUrenInputs[index].value = value;
            }
        });
    }

    // Laad de ADV opgenomen uren
    const advOpgenomenUren = JSON.parse(sessionStorage.getItem('advOpgenomenUren'));
    if (advOpgenomenUren) {
        const advOpgenomenUrenInputs = document.querySelectorAll('.adv-opgenomen-uren');
        advOpgenomenUren.forEach((value, index) => {
            if (index < advOpgenomenUrenInputs.length) {
                advOpgenomenUrenInputs[index].value = value;
            }
        });
    }

    // Laad de EL opgenomen uren
    const elOpgenomenUren = JSON.parse(sessionStorage.getItem('elOpgenomenUren'));
    if (elOpgenomenUren) {
        const elOpgenomenUrenInputs = document.querySelectorAll('.el-opgenomen-uren');
        elOpgenomenUren.forEach((value, index) => {
            if (index < elOpgenomenUrenInputs.length) {
                elOpgenomenUrenInputs[index].value = value;
            }
        });
    }

    // Laad de ANC opgenomen uren
    const ancOpgenomenUren = JSON.parse(sessionStorage.getItem('ancOpgenomenUren'));
    if (ancOpgenomenUren) {
        const ancOpgenomenUrenInputs = document.querySelectorAll('.anc-opgenomen-uren');
        ancOpgenomenUren.forEach((value, index) => {
            if (index < ancOpgenomenUrenInputs.length) {
                ancOpgenomenUrenInputs[index].value = value;
            }
        });
    }

    // Laad de startdatum
    const startDate = sessionStorage.getItem('startDate');
    if (startDate) {
        document.getElementById('startDate').value = startDate;
    } else {
        setDefaultDate(); // Als er geen opgeslagen datum is, gebruik de huidige datum
    }

    // Bereken alles opnieuw met de geladen waarden
    calculateAverage();
    updateTable();
    updateADVTable();
    updateELTable();
    updateANCTable();
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

    // Sla de waarden op in sessionStorage
    saveToSessionStorage();

    return average; // Return de waarde voor gebruik in andere functies
}

// Update het begrensde wettelijk verlof op basis van het gemiddelde percentage
function updateBegrensdWettelijkVerlof(averagePercentage) {
    const maxWettelijkVerlof = parseFloat(document.getElementById('max-wettelijk-verlof').textContent);
    const begrensdWettelijkVerlof = (maxWettelijkVerlof * (averagePercentage / 100)).toFixed(1);
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
    let vorigeWVStart = 0;
    let vorigeOpgenomenUren = 0;
    let vorigePercentage = null;

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
        wvStartCell.textContent = wvStart.toFixed(1);

        // Beperk de opgenomen uren tot het beschikbare WV Start
        if (opgenomenUren > wvStart) {
            opgenomenUrenInput.value = wvStart.toFixed(1);
        }

        // Bereken WV Correctie
        let wvCorrectie;
        if (index === 0) {
            // Voor januari: WV Start - Max wettelijk verlof
            wvCorrectie = wvStart - maxWettelijkVerlof;
        } else {
            // Voor andere maanden: WV Start - WV Start van vorige maand + WV Opgenomen vorige maand
            wvCorrectie = wvStart - vorigeWVStart + vorigeOpgenomenUren;
        }
        wvCorrectieCell.textContent = wvCorrectie.toFixed(1);

        // Bereken percentage WV opgenomen voor deze maand
        // Gebruik het juiste referentiegetal op basis van het percentage
        const maandelijksRecht = percentage === 1 ? begrensdWettelijkVerlof : percentage * maxWettelijkVerlof;
        const percentageWV = maandelijksRecht > 0 ? (opgenomenUren / maandelijksRecht) * 100 : 0;
        percentageWVCell.textContent = `${percentageWV.toFixed(2)}%`;

        // Bereken het cumulatieve percentage (som van alle percentages tot nu toe)
        cumulatiefPercentage += percentageWV;
        percentageWVTotaalCell.textContent = `${cumulatiefPercentage.toFixed(2)}%`;

        // Bewaar waarden voor de volgende iteratie
        vorigeWVStart = wvStart;
        vorigeOpgenomenUren = opgenomenUren;
        vorigePercentage = percentage;
    });

    // Update de ADV en EL tabellen
    updateADVTable();
    updateELTable();
    updateANCTable();

    // Sla de waarden op in sessionStorage
    saveToSessionStorage();
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
        advStartCell.textContent = advStart.toFixed(1);
        advCorrectieCell.textContent = advCorrectie.toFixed(1);

        // Beperk de opgenomen uren tot het beschikbare ADV
        if (advOpgenomen > advStart) {
            advOpgenomenInput.value = advStart.toFixed(1);
        }

        // Bewaar waarden voor de volgende iteratie
        vorigeADVStart = advStart;
        vorigeADVOpgenomen = isNaN(parseFloat(advOpgenomenInput.value)) ? 0 : parseFloat(advOpgenomenInput.value);
        vorigePercentage = percentage;
    });

    // Sla de waarden op in sessionStorage
    saveToSessionStorage();
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
        elStartCell.textContent = elStart.toFixed(1);
        elCorrectieCell.textContent = elCorrectie.toFixed(1);

        // Beperk de opgenomen uren tot het beschikbare EL
        if (elOpgenomen > elStart) {
            elOpgenomenInput.value = elStart.toFixed(1);
        }

        // Bewaar waarden voor de volgende iteratie
        vorigeELStart = elStart;
        vorigeELOpgenomen = isNaN(parseFloat(elOpgenomenInput.value)) ? 0 : parseFloat(elOpgenomenInput.value);
        vorigePercentage = percentage;
    });

    // Sla de waarden op in sessionStorage
    saveToSessionStorage();
}

// Functie voor het bijwerken van de ANC (ancienniteitsverlof) tabel
function updateANCTable() {
    // Zorg ervoor dat de max ancienniteitsverlof waarde correct is ingesteld
    const maxAncElement = document.getElementById('max-ancieniteits-verlof');
    if (!maxAncElement || maxAncElement.textContent === '' || maxAncElement.textContent === '0') {
        // Bereken het ancienniteitsverlof op basis van de startdatum
        const ancienniteitsverlof = berekenAncienniteitsverlof();
        if (maxAncElement) {
            maxAncElement.textContent = ancienniteitsverlof.toFixed(1);
            console.log('Max ancienniteitsverlof ingesteld op:', ancienniteitsverlof);
        }
    }

    const maxANCVerlof = parseFloat(document.getElementById('max-ancieniteits-verlof').textContent);
    const maandelijksANC = maxANCVerlof / 12; // Uren per maand

    // Array met alle maanden
    const maanden = [
        'januari', 'februari', 'maart', 'april', 'mei', 'juni',
        'juli', 'augustus', 'september', 'oktober', 'november', 'december'
    ];

    let vorigeANCStart = 0;
    let vorigeANCOpgenomen = 0;
    let vorigePercentage = null;

    // Loop door elke maand en update de waarden
    maanden.forEach((maand, index) => {
        // Selecteer de elementen voor deze maand
        const percentageCell = document.getElementById(`detail-percentage-${maand}`);
        const ancStartCell = document.getElementById(`anc-start-${maand}`);
        const ancCorrectieCell = document.getElementById(`anc-correctie-${maand}`);
        const ancOpgenomenInput = document.querySelector(`#details-tabel tr:nth-child(${index + 1}) .anc-opgenomen-uren`);

        if (!percentageCell || !ancStartCell || !ancCorrectieCell || !ancOpgenomenInput) {
            console.error(`Elementen ontbreken voor de maand ${maand}`);
            return;
        }

        // Bereken de waarden
        const percentage = parseFloat(percentageCell.textContent) / 100;
        const ancOpgenomen = isNaN(parseFloat(ancOpgenomenInput.value)) ? 0 : parseFloat(ancOpgenomenInput.value);

        let ancStart;
        let ancCorrectie = 0;

        if (index === 0) {
            // Voor januari: bereken ANC start op basis van percentage
            ancStart = maxANCVerlof * percentage;
            ancCorrectie = ancStart - maxANCVerlof;
        } else {
            // Voor andere maanden
            const percentageGewijzigd = percentage !== vorigePercentage;

            if (percentageGewijzigd) {
                // Als het percentage is gewijzigd, bereken een nieuwe startwaarde en correctie
                const maandenTeGaan = 12 - index;
                const nieuweANCPerMaand = maandelijksANC * percentage;
                const totaalNieuwANC = nieuweANCPerMaand * maandenTeGaan;

                // Bereken hoeveel ANC er al is opgenomen
                let totaalOpgenomen = 0;
                for (let i = 0; i < index; i++) {
                    const opgenomenInput = document.querySelector(`#details-tabel tr:nth-child(${i + 1}) .anc-opgenomen-uren`);
                    if (opgenomenInput) {
                        totaalOpgenomen += isNaN(parseFloat(opgenomenInput.value)) ? 0 : parseFloat(opgenomenInput.value);
                    }
                }

                // Bereken hoeveel ANC er al is toegekend
                let totaalToegekend = 0;
                for (let i = 0; i < index; i++) {
                    const maandPercentage = parseFloat(document.getElementById(`detail-percentage-${maanden[i]}`).textContent) / 100;
                    totaalToegekend += maandelijksANC * maandPercentage;
                }

                // Bereken wat er nog beschikbaar is
                const beschikbaarANC = (totaalToegekend - totaalOpgenomen) + totaalNieuwANC;

                // Bereken correctie (verschil tussen nieuwe beschikbare ANC en wat er zou zijn zonder wijziging)
                const oudeANCStart = Math.max(0, vorigeANCStart - vorigeANCOpgenomen);
                ancCorrectie = beschikbaarANC - oudeANCStart;
                ancStart = beschikbaarANC;
            } else {
                // Als het percentage niet is gewijzigd, gebruik de vorige ANC Start min opgenomen uren
                ancStart = Math.max(0, vorigeANCStart - vorigeANCOpgenomen);
                ancCorrectie = 0;
            }
        }

        // Update de cellen met de berekende waarden
        ancStartCell.textContent = ancStart.toFixed(1);
        ancCorrectieCell.textContent = ancCorrectie.toFixed(1);

        // Beperk de opgenomen uren tot het beschikbare ANC
        if (ancOpgenomen > ancStart) {
            ancOpgenomenInput.value = ancStart.toFixed(1);
        }

        // Bewaar waarden voor de volgende iteratie
        vorigeANCStart = ancStart;
        vorigeANCOpgenomen = isNaN(parseFloat(ancOpgenomenInput.value)) ? 0 : parseFloat(ancOpgenomenInput.value);
        vorigePercentage = percentage;
    });

    // Sla de waarden op in sessionStorage
    saveToSessionStorage();
}

// Functie om de huidige datum in te stellen als standaardwaarde
function setDefaultDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    const dateInput = document.getElementById('startDate');
    dateInput.value = formattedDate;

    // Sla de datum op in sessionStorage
    sessionStorage.setItem('startDate', formattedDate);
}

// Functie om het ancienniteitsverlof te berekenen op basis van jaren dienst
function berekenAncienniteitsverlof() {
    const startDate = document.getElementById('startDate').value;
    if (!startDate) return 24; // Standaardwaarde als er geen datum is

    const startDatum = new Date(startDate);
    const huidigeDatum = new Date();
    const huidigJaar = huidigeDatum.getFullYear();

    // Bereken het aantal jaren dienst (inclusief het huidige jaar)
    let jarenDienst = huidigJaar - startDatum.getFullYear();

    console.log('Jaren dienst:', jarenDienst);

    // Bepaal het aantal uren op basis van de tabel
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
        aantalUren = 24; // Standaardwaarde als er minder dan 1 jaar dienst is
    }

    return aantalUren;
}

// Functie om de startdatum bij te werken
function updateStartDate() {
    const selectedDate = document.getElementById('startDate').value;
    console.log('Geselecteerde startdatum:', selectedDate);

    // Bereken het ancienniteitsverlof op basis van de startdatum
    const ancienniteitsverlof = berekenAncienniteitsverlof();

    // Zorg ervoor dat de waarde altijd wordt ingesteld, zelfs als het 0 is
    document.getElementById('max-ancieniteits-verlof').textContent = ancienniteitsverlof.toFixed(1);
    console.log('Berekend ancienniteitsverlof:', ancienniteitsverlof);

    // Update de tabellen
    updateTable();
    updateADVTable();
    updateELTable();
    updateANCTable();

    // Sla de datum op in sessionStorage
    sessionStorage.setItem('startDate', selectedDate);
}

// Functie om alle opgeslagen gegevens te wissen, behalve de cookie consent
function clearSessionStorage() {
    // Bewaar de cookie consent instelling
    const cookieConsent = sessionStorage.getItem('cookieConsent');

    // Wis alle sessionStorage
    sessionStorage.clear();

    // Herstel de cookie consent instelling als die bestond
    if (cookieConsent) {
        sessionStorage.setItem('cookieConsent', cookieConsent);
    }

    // Vernieuw de pagina om alle velden te resetten
    location.reload();
}

// Functie om alle invoerwaarden te exporteren naar CSV
function exportToCSV() {
    // Verzamel alle gegevens
    const data = {
        percentages: Array.from(document.querySelectorAll('.table-container:first-of-type .percentage-input')).map(input => input.value || "100"),
        verlofPercentages: Array.from(document.querySelectorAll('#verlof-tabel .percentage-input:not(.opgenomen-uren)')).map(input => input.value || "100"),
        opgenomenUren: Array.from(document.querySelectorAll('.opgenomen-uren')).map(input => input.value || "0"),
        advOpgenomenUren: Array.from(document.querySelectorAll('.adv-opgenomen-uren')).map(input => input.value || "0"),
        elOpgenomenUren: Array.from(document.querySelectorAll('.el-opgenomen-uren')).map(input => input.value || "0"),
        ancOpgenomenUren: Array.from(document.querySelectorAll('.anc-opgenomen-uren')).map(input => input.value || "0"),
        startDate: document.getElementById('startDate').value
    };

    // Converteer naar CSV-formaat
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "type,value\n";
    csvContent += `startDate,${data.startDate}\n`;

    // Voeg percentages toe
    data.percentages.forEach((value, index) => {
        csvContent += `percentage_${index},${value}\n`;
    });

    // Voeg verlofpercentages toe
    data.verlofPercentages.forEach((value, index) => {
        csvContent += `verlofPercentage_${index},${value}\n`;
    });

    // Voeg opgenomen uren toe
    data.opgenomenUren.forEach((value, index) => {
        csvContent += `opgenomenUren_${index},${value}\n`;
    });

    // Voeg ADV opgenomen uren toe
    data.advOpgenomenUren.forEach((value, index) => {
        csvContent += `advOpgenomenUren_${index},${value}\n`;
    });

    // Voeg EL opgenomen uren toe
    data.elOpgenomenUren.forEach((value, index) => {
        csvContent += `elOpgenomenUren_${index},${value}\n`;
    });

    // Voeg ANC opgenomen uren toe
    data.ancOpgenomenUren.forEach((value, index) => {
        csvContent += `ancOpgenomenUren_${index},${value}\n`;
    });

    // Maak een downloadbare link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "verlofgegevens.csv");
    document.body.appendChild(link);

    // Klik op de link om het bestand te downloaden
    link.click();

    // Verwijder de link
    document.body.removeChild(link);
}

// Functie om gegevens te importeren uit een CSV-bestand
// Functie om gegevens te importeren uit een CSV-bestand
function importFromCSV() {
    // Controleer of het bestandsinvoerelement bestaat, zo niet, maak het aan
    let fileInput = document.getElementById('importFile');
    if (!fileInput) {
        fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.id = 'importFile';
        fileInput.accept = '.csv';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);
        // Voeg de event listener toe aan het nieuwe element
        fileInput.addEventListener('change', handleFileImport);
    }
    // Klik op het bestandsinvoerelement om de bestandskiezer te openen
    fileInput.click();
}

// Functie om het geïmporteerde CSV-bestand te verwerken
function handleFileImport(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        const csvData = event.target.result;
        const lines = csvData.split('\n');

        // Sla de gegevens op in een object
        const data = {};

        // Sla de header over (eerste regel)
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line) {
                const [key, value] = line.split(',');
                data[key] = value;
            }
        }

        // Vul de startdatum in
        if (data.startDate) {
            document.getElementById('startDate').value = data.startDate;
        }

        // Vul de percentages in
        const percentageInputs = document.querySelectorAll('.table-container:first-of-type .percentage-input');
        percentageInputs.forEach((input, index) => {
            const value = data[`percentage_${index}`];
            if (value !== undefined) {
                input.value = value;
            }
        });

        // Vul de verlofpercentages in
        const verlofPercentageInputs = document.querySelectorAll('#verlof-tabel .percentage-input:not(.opgenomen-uren)');
        verlofPercentageInputs.forEach((input, index) => {
            const value = data[`verlofPercentage_${index}`];
            if (value !== undefined) {
                input.value = value;
            }
        });

        // Vul de opgenomen uren in
        const opgenomenUrenInputs = document.querySelectorAll('.opgenomen-uren');
        opgenomenUrenInputs.forEach((input, index) => {
            const value = data[`opgenomenUren_${index}`];
            if (value !== undefined) {
                input.value = value;
            }
        });

        // Vul de ADV opgenomen uren in
        const advOpgenomenUrenInputs = document.querySelectorAll('.adv-opgenomen-uren');
        advOpgenomenUrenInputs.forEach((input, index) => {
            const value = data[`advOpgenomenUren_${index}`];
            if (value !== undefined) {
                input.value = value;
            }
        });

        // Vul de EL opgenomen uren in
        const elOpgenomenUrenInputs = document.querySelectorAll('.el-opgenomen-uren');
        elOpgenomenUrenInputs.forEach((input, index) => {
            const value = data[`elOpgenomenUren_${index}`];
            if (value !== undefined) {
                input.value = value;
            }
        });

        // Vul de ANC opgenomen uren in
        const ancOpgenomenUrenInputs = document.querySelectorAll('.anc-opgenomen-uren');
        ancOpgenomenUrenInputs.forEach((input, index) => {
            const value = data[`ancOpgenomenUren_${index}`];
            if (value !== undefined) {
                input.value = value;
            }
        });

        // Bereken alles opnieuw met de geïmporteerde waarden
        updateStartDate(); // Dit zal ook de ancienniteitsverlof berekenen
        calculateAverage();
        updateTable();
        updateADVTable();
        updateELTable();
        updateANCTable();

        // Sla de geïmporteerde waarden op in sessionStorage
        saveToSessionStorage();

        alert('Gegevens succesvol geïmporteerd!');
    };

    reader.readAsText(file);
}

// Bereken het gemiddelde bij het laden van de pagina
document.addEventListener('DOMContentLoaded', function() {
    // Toon de cookie-melding
    showCookieConsent();

    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportToCSV);
    }

    const importBtn = document.getElementById('importBtn');
    if (importBtn) {
        importBtn.addEventListener('click', importFromCSV);
    }

    const importFile = document.getElementById('importFile');
    if (importFile) {
        importFile.addEventListener('change', handleFileImport);
    }

    // Zorg ervoor dat de max ancienniteitsverlof waarde correct wordt ingesteld
    const maxAncElement = document.getElementById('max-ancieniteits-verlof');
    if (!maxAncElement || maxAncElement.textContent === '' || maxAncElement.textContent === '0') {
        // Bereken het ancienniteitsverlof op basis van de startdatum
        const ancienniteitsverlof = berekenAncienniteitsverlof();
        if (maxAncElement) {
            maxAncElement.textContent = ancienniteitsverlof.toFixed(1);
            console.log('Max ancienniteitsverlof ingesteld op:', ancienniteitsverlof);
        }
    }

    // Laad opgeslagen waarden uit sessionStorage
    loadFromSessionStorage();

    // Voeg event listeners toe aan alle percentage-inputs in de eerste tabel
    const percentageInputs = document.querySelectorAll('.table-container:first-of-type .percentage-input');
    percentageInputs.forEach(input => {
        input.addEventListener('input', function() {
            validateInput(this);
            calculateAverage();
        });
    });

    // Voeg event listeners toe aan alle percentage-inputs in de tweede tabel
    const verlofPercentageInputs = document.querySelectorAll('#verlof-tabel .percentage-input:not(.opgenomen-uren)');
    verlofPercentageInputs.forEach(input => {
        input.addEventListener('input', function() {
            validateInput(this);
            updateTable();
        });
    });

    // Voeg event listeners toe aan alle opgenomen-uren inputs met validatie
    const maanden = [
        'januari', 'februari', 'maart', 'april', 'mei', 'juni',
        'juli', 'augustus', 'september', 'oktober', 'november', 'december'
    ];

    maanden.forEach((maand, index) => {
        const opgenomenUrenInput = document.querySelector(`#verlof-tabel tr:nth-child(${index + 1}) .opgenomen-uren`);
        if (opgenomenUrenInput) {
            opgenomenUrenInput.addEventListener('input', function() {
                validateOpgenomenUren(this, maand);
                updateTable();
            });
        }
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

    // Voeg event listeners toe aan alle ANC opgenomen-uren inputs
    const ancOpgenomenUrenInputs = document.querySelectorAll('.anc-opgenomen-uren');
    ancOpgenomenUrenInputs.forEach(input => {
        input.addEventListener('input', updateANCTable);
    });

    // Voeg een event listener toe aan de startdatum
    document.getElementById('startDate').addEventListener('change', updateStartDate);

    // Voeg event listeners toe aan de export/import knoppen
    document.getElementById('exportBtn').addEventListener('click', exportToCSV);
    document.getElementById('importBtn').addEventListener('click', importFromCSV);
    document.getElementById('importFile').addEventListener('change', handleFileImport);
});
