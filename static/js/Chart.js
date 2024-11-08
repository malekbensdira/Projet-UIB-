document.addEventListener("DOMContentLoaded", function() {
    const table = document.getElementById('data-table');
    const rows = table.getElementsByTagName('tr');

    let totalActifsNonCourants = 0;
    let totalActifsCourants = 0;
    let dernierMontant = 0;

    // Parcourir les lignes du tableau
    for (let i = 1; i < rows.length; i++) { // Commence à 1 pour ignorer les en-têtes
        const cells = rows[i].getElementsByTagName('td');
        const nom = cells[0].innerText.trim();
        const montantText = cells[2].innerText.replace(/,/g, '').replace(/\s/g, '');
        const montant = parseFloat(montantText);

        // Logs pour vérifier les données extraites
        console.log(`Nom: ${nom}, Montant (Texte): ${montantText}, Montant (Nombre): ${montant}`);

        // Corrigez les noms exacts
        if (nom === "Total des Actifs non Courants") {
            totalActifsNonCourants = montant || 0; // Valeur par défaut si NaN
        } else if (nom === "Total des Actife Courants") { // Recherche pour "Total des Actife Courants"
            totalActifsCourants = montant || 0; // Valeur par défaut si NaN
        }

        // Mettre à jour dernierMontant avec la dernière ligne
        if (i === rows.length - 1) {
            dernierMontant = montant || 0; // Valeur par défaut si NaN
        }
    }

    // Vérification des valeurs extraites
    console.log("Total des Actifs Non Courants:", totalActifsNonCourants);
    console.log("Total des Actifs Courants:", totalActifsCourants);
    console.log("Dernier Montant:", dernierMontant);

    // Vérifier le montant total pour éviter la division par zéro
    if (dernierMontant !== 0) {
        // Calculer les pourcentages
        const pourcentageNonCourants = (totalActifsNonCourants / dernierMontant) * 100;
        const pourcentageCourants = (totalActifsCourants / dernierMontant) * 100;

        console.log("Pourcentage des Actifs Non Courants:", pourcentageNonCourants);
        console.log("Pourcentage des Actifs Courants:", pourcentageCourants);

        // Créer le camembert avec les pourcentages calculés
        const ctx = document.getElementById('myChart').getContext('2d');

        // Détruire le graphique précédent s'il existe
        if (window.myPieChart) {
            window.myPieChart.destroy();
        }

        // Créer un nouveau graphique
        window.myPieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Total des Actifs Non Courants', 'Total des Actifs Courants'],
                datasets: [{
                    data: [pourcentageNonCourants.toFixed(2), pourcentageCourants.toFixed(2)],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                         font: {
                            size: 16
                        },
                        padding: {
                            bottom: 20
                        },
                        align: 'center'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.raw + '%';
                            }
                        }
                    }
                }
            }
        });
    } else {
        console.error("Le montant total est 0, impossible de calculer les pourcentages.");
    }
});
document.addEventListener('DOMContentLoaded', function() {
    // Fonction pour extraire et filtrer les données du tableau
    function extractAndFilterTableData() {
        const labels = [];
        const data = [];
        
        const exclusionLabels = [
            "Total des Actifs Immobilisés",
            "Autres Actifs non Courants",
            "Total des Actifs non Courants",
            "Moins : Résorption",
            "Total des Actife Courants",
            "TOTAL DES ACTIFS"
        ];

        const rows = document.querySelectorAll('#data-table tbody tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length > 0) {
                const label = cells[0].innerText.trim();
                const value = parseFloat(cells[2].innerText.replace(',', '.'));

                if (!exclusionLabels.includes(label)) {
                    labels.push(label);
                    data.push(value);
                }
            }
        });

        return { labels, data };
    }

    // Extraire et filtrer les données
    const { labels, data } = extractAndFilterTableData();

    // Fonction pour détruire les graphiques existants sur le canvas
    function destroyExistingChart(chartId) {
        const existingChart = Chart.getChart(chartId);
        if (existingChart) {
            existingChart.destroy();
        }
    }

    // Détruire le graphique existant si nécessaire
    destroyExistingChart('barChart');

    // Création de l'histogramme
    const ctxBar = document.getElementById('barChart').getContext('2d');
    new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Montant des actifs (millions €)',
                data: data,
                backgroundColor: '#36A2EB',
                borderColor: '#003F5C',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (context.raw !== null) {
                                label += ': ' + context.raw + ' millions €';
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});
