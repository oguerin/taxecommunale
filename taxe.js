$(function () {
    var VAL_MOY_TH_2014 = 2415;
    var VAL_MOY_TH_2015 = 2463;
    var TAUX_TH_2014 = 0.1714;
    var TAUX_TH_2015 = 0.1812;
    var TAUX_TF_2014 = 0.2098;
    var TAUX_TF_2015 = 0.2218;
    var HAUSSE_BASE = 1.02;

    $('#valeur_locative_brute').val(VAL_MOY_TH_2015);

    $('[data-toggle="tooltip"]').tooltip();

    $('#graphe').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'Taxe d\'habitation et taxe foncière'
        },
        xAxis: {
            categories: ['2014', '2015']
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Montant total des taxes'
            },
            stackLabels: {
                enabled: true,
                style: {
                    fontWeight: 'bold',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                }
            },
            labels: {
                formatter: function () {
                    return this.value + ' €';
                }
            }
        },
        legend: {
            align: 'right',
            x: -30,
            verticalAlign: 'top',
            y: 25,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
            borderColor: '#CCC',
            borderWidth: 1,
            shadow: false
        },
        tooltip: {
            formatter: function () {
                return '<b>' + this.x + '</b><br/>' +
                    this.series.name + ': ' + this.y + ' €<br/>' +
                    'Total: ' + this.point.stackTotal + ' €';
            }
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true,
                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                    style: {
                        textShadow: '0 0 3px black'
                    }
                }
            }
        },
        series: [{
            name: 'Taxe d\'habitation',
            data: [{
                dataLabels: {format: 'point.y €'} }]
        }, {
            name: 'Taxe foncière',
            data: [0, 0]
        }]
    });
    $('#grapheEvol').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'Variation'
        },
        xAxis: {
            categories: ['Taxe d\'habitation', 'Taxe foncière']
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Variation des taxes'
            },
            labels: {
                formatter: function () {
                    return this.value + ' €';
                }
            }
        },
        legend: {
            align: 'right',
            x: -30,
            verticalAlign: 'top',
            y: 25,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.background3) || 'white',
            borderColor: '#CCC',
            borderWidth: 1,
            shadow: false
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true,
                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                    style: {
                        textShadow: '0 0 3px black'
                    }
                }
            }
        },
        series: [{
            name: 'Taxe',
            data: [{
                dataLabels: {format: 'point.y €'} }]
        }]
    });
    calculeTaxe = function(valeur_locative_brute, personnes_a_charge, periode) {
        var divPeriode = (periode=='an') ? 1 : 12;
        var base_habitation_2014 = valeur_locative_brute - VAL_MOY_TH_2014*(Math.min(personnes_a_charge, 2)*0.1 + Math.max(personnes_a_charge-2, 0)*0.15);
        var base_habitation_2015 = valeur_locative_brute - VAL_MOY_TH_2015*(Math.min(personnes_a_charge, 2)*0.1 + Math.max(personnes_a_charge-2, 0)*0.15);
        console.log('base habitation 2014 '+base_habitation_2014+', 2014 ' + base_habitation_2015);
        var taxe_habitation = [Math.round(base_habitation_2014*TAUX_TH_2014/divPeriode), Math.round(base_habitation_2015*TAUX_TH_2015*HAUSSE_BASE/divPeriode)];
        var base_fonciere = valeur_locative_brute / 2;
        var taxe_fonciere = [Math.round(base_fonciere*TAUX_TF_2014/divPeriode), Math.round(base_fonciere*TAUX_TF_2015*HAUSSE_BASE/divPeriode)];
        console.log('base foncière: '+base_fonciere);
        return [taxe_habitation, taxe_fonciere];
    }
    dessineGraphe = function() {
        var periode = $("input[name='periode']:checked").val();
        var valeur_locative_brute = parseInt($('#valeur_locative_brute').val());
        var personnes_a_charge = parseInt($('#personnes_a_charge').val());
        var taxes = calculeTaxe(valeur_locative_brute, personnes_a_charge, periode);
        var th_2014 = taxes[0][0];
        var th_2015 = taxes[0][1];
        var tf_2014 = taxes[1][0];
        var tf_2015 = taxes[1][1];

        $('#graphe').highcharts().series[0].update({
            data: taxes[0]
        });
        $('#graphe').highcharts().series[1].update({
            data: taxes[1]
        });
        $('#grapheEvol').highcharts().series[0].update({
            data: [th_2015-th_2014, tf_2015-tf_2014]
        });

        $('#graphe').highcharts().redraw();
        $('#th-2014').text(''+th_2014+' €');
        $('#th-2015').text(''+th_2015+' €');
        $('#th-diff').text(''+(th_2015-th_2014)+' €');
        $('#tf-2014').text(''+tf_2014+' €');
        $('#tf-2015').text(''+tf_2015+' €');
        $('#tf-diff').text(''+(tf_2015-tf_2014)+' €');
    }
    $('input[name="periode"]').change(dessineGraphe);
    $('#valeur_locative_brute').change(dessineGraphe).change();
    $('#valeur_locative_brute').keypress(dessineGraphe);
    $('#valeur_locative_brute').blur(dessineGraphe);
    $('#personnes_a_charge').change(dessineGraphe);
    $('#personnes_a_charge').keypress(dessineGraphe);
    $('#personnes_a_charge').blur(dessineGraphe);
});
