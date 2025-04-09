// Minimale versie om te testen of de site werkt
document.addEventListener('DOMContentLoaded', function() {
    console.log("Pagina geladen - minimale versie");
    
    // Basis functionaliteit - alleen weergave zonder berekeningen
    function setDefaultDate() {
        try {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;

            const dateInput = document.getElementById('startDate');
            if (dateInput) {
                dateInput.value = formattedDate;
            }
        } catch (error) {
            console.error('Fout bij instellen datum:', error);
        }
    }
    
    // Probeer alleen de datum in te stellen
    try {
        setDefaultDate();
        console.log("Datum ingesteld");
    } catch (error) {
        console.error("Kritieke fout bij initialisatie:", error);
    }
    
    // Voeg eenvoudige event listeners toe zonder complexe berekeningen
    try {
        // Export knop
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', function() {
                alert('Export functionaliteit tijdelijk uitgeschakeld voor testen');
            });
        }
        
        // Import knop
        const importBtn = document.getElementById('importBtn');
        if (importBtn) {
            importBtn.addEventListener('click', function() {
                alert('Import functionaliteit tijdelijk uitgeschakeld voor testen');
            });
        }
        
        console.log("Event listeners toegevoegd");
    } catch (error) {
        console.error("Fout bij toevoegen event listeners:", error);
    }
});
