var $ = jQuery;
var dataTable = null;
var myChart = null;

$(document).ready(function() {
    loadCityData();

    $('.modal').on('hidden.bs.modal', function() {
        $(this).find('input:text').val('');
    });
});

function createCity() {
    var cityName = $("#new-city-name").val();
    var APIUrl = buildAPIUrl('cities/') + cityName;

    $.ajax({
        method: 'POST',
        url: APIUrl,
        dataType: 'json',
        crossDomain: true,
        success: function(data) {
            if (data.length > 0) {
                $("#modal").modal("hide");
                loadCityData();
                loadDataWeather(cityName);
            }
        },
        error: function(e) {
            if (e.status == 404) {
                notify('Not Found', 'notice','No city registered');
            }
            else {
                notify('Error','error', e.responseText);
            }
        }
    });
}

function loadCityData() {
    var APIUrl = buildAPIUrl('cities');

    $.ajax({
        method: 'GET',
        url: APIUrl,
        dataType: 'json',
        crossDomain: true,
        success: function(data) {
            loadDataTable(data.content);
        },
        error: function(e) {
            if (e.status == 404) {
                notify('Not Found', 'notice','No city registered');
            }
            else {
                notify('Error','error', e.responseText);
            }
            loadDataTable([]);
        }
    });
}

function loadDataWeather(city) {
    var APIUrl = buildAPIUrl('forecasts/load') + "?city=" + city;

    $.ajax({
        method: 'POST',
        url: APIUrl,
        dataType: 'json',
        crossDomain: true,
        success: function(data) {
            if (data.length > 0) {
                loadChart(data[0].city.name, data);
            }
        },
        error: function(e) {
            if (e.status == 404) {
                notify('Not Found', 'notice','No data found');
            }
            else {
                notify('Error','error', e.responseText);
            }
        }
    });
}

function loadDataTable(content) {
    var dataSet = [];
    sortJsonArrayByProperty(content, 'name');
    for (let idx = 0; idx < content.length; idx++) {
        const city = content[idx];
        const btn = '<button type="button" data-city="' + city.name + '" class="btn btn-outline-dark btn-sm btn-show-chart"><i class="fas fa-caret-left"></i> View Forecast <i class="fas fa-caret-right"></i></button>';
        dataSet.push([city.name, btn]);
    }

    if (dataTable) {
        dataTable.destroy();
    }

    var colDataTable = [
        { title: "City", orderable: false },
        { title: "", orderable: false, width: "128px" }
    ];

    dataTable = $('#table-weather').DataTable({
        select: true,
        data: dataSet,
        searching: true,
        bPaginate: false,
        columns: colDataTable,
        info: false,
        columnDefs: [ { orderable: false, targets: [0] } ]
    });

    $("thead").addClass("thead-dark");
    $("th").removeClass("sorting_asc");

    $("#table-weather").on("click", "button.btn-show-chart", function (e) {
        let city = $(e.currentTarget).data("city");
        loadDataWeather(city);
    });
}

function loadChart(title, data) {
    var labels = [];
    var dataSet = [];
    
    for (let idx = 0; idx < data.length; idx++) {
        const weather = data[idx];
        dataSet.push(weather.main.temp.toFixed(0));
        labels.push(weather.dt_txt)
    }

    if (myChart) {
        myChart.destroy();
    }

    var ctx = document.getElementById("myChart").getContext('2d');
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: "ºC",
                borderColor: '#212529',
                data: dataSet,
            }]
        },
        options: {
            title: {
                display: true,
                text: title
            }
        }
    });

    $('html, body').animate({
        scrollTop: $("#myChart").offset().top
    }, 2000);
}