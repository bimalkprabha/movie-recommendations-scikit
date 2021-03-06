const tbody = d3.select("#table1");

// currency formatter
function num_Formatter(num) {
    if (num > 999 && num < 1000000) {
        return (num / 1000).toFixed(0) + 'K'; // convert to K for number from > 1000 < 1 million 
    } else if (num > 1000000 && num < 1000000000) {
        return (num / 1000000).toFixed(0) + ' Million'; // convert to M for number from > 1 million 
    } else if (num > 1000000000) {
        return (num / 1000000000).toFixed(0) + ' Billion'; // convert to M for number from > 1 million 
    } else if (num < 900) {
        return num; // if value < 1000, nothing to do
    }
}


d3.json('/data', function(res) {
    // console.log(res);

    render_chart(res);


    function render_chart(data) {

        const popularity = data.map((ele) => ele.popularity);
        let most_popular = data.sort(function(a, b) {
            return b.popularity - a.popularity;
        });
        most_popular_10 = most_popular.slice(0, 10)
        most_popular_15 = most_popular.slice(0, 15)

        let most_budget = data.sort(function(a, b) {
            return b.budget - a.budget;
        });
        most_budget = most_budget.slice(0, 1)


        let most_duration = data.sort(function(a, b) {
            return b.runtime - a.runtime;
        });
        most_duration = most_duration.slice(0, 1)


        let most_revenue = data.sort(function(a, b) {
            return b.revenue - a.revenue;
        });
        most_revenue = most_revenue.slice(0, 1)
            // console.log(most_budget[0].budget);
            //  Chart 1

        let genres = data.map((ele) => ele.genres.split(" "))
            //  To  find dsitinct genres
        distinct_genres(genres)
            // console.log(distinct_genres);

        chart_1(most_popular_10);
        // Table
        buildTable(most_popular_15)
            // Most Expensive
        most_expensive(most_budget)
            // Most Expensive
        duration(most_duration)
            // Most Expensive
        revenue(most_revenue)

        directors()





    }


    // Directors and movies

    //  Distinct Genres

    function distinct_genres(genres) {

        var words = [];
        var counts = [];
        genres.map(ele => {
            calculate(ele)
        });


        function calculate(inputs) {
            for (var i = 0; i < inputs.length; i++) {
                var isExist = false;
                for (var j = 0; j < words.length; j++) {
                    if (inputs[i] == words[j]) {
                        isExist = true
                        counts[i] = counts[i] + 1;
                    }
                }
                if (!isExist) {
                    words.push(inputs[i]);
                    counts.push(1);
                }
                isExist = false;
            }
        }

        console.log(words);
        console.log(counts);
        // Radial 

        genre_pie(words.slice(0, 6), counts.slice(0, 6));

    }

    function genre_pie(words, counts) {

        var options = {
            series: counts,
            chart: {
                width: 380,
                type: 'donut',
                foreColor: '#ffffff',
            },
            plotOptions: {

                pie: {
                    startAngle: -90,
                    endAngle: 270
                }
            },
            dataLabels: {
                enabled: false
            },
            fill: {
                type: 'gradient',
            },
            legend: {
                formatter: function(val, opts) {
                    return val + " - " + opts.w.globals.series[opts.seriesIndex]
                }
            },
            labels: words,

            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }]
        };

        var chart = new ApexCharts(document.querySelector("#chart_2"), options);
        chart.render();

    }




    function duration(most_duration) {
        let hours = Math.floor(most_duration[0].runtime / 60);
        let minutes = most_duration[0].runtime % 60;
        let run_div = d3.select("#most_duration")
            .append("h5")
            .attr("class", "mb-0")
            .text(`${hours} Hr: ${minutes} min`)

    }


    function revenue(most_revenue) {
        let val = num_Formatter(most_revenue[0].revenue)
        let most_div = d3.select("#most_revenue")
            .append("h5")
            .attr("class", "mb-0")
            .text(val)

    }

    function most_expensive(most_budget) {
        let val = num_Formatter(most_budget[0].budget)
        let most_div = d3.select("#most_budget")
            .append("h5")
            .attr("class", "mb-0")
            .text(val)


    }



    function buildTable(data) {
        // First, clear out any existing data
        tbody.html("");

        console.log(data);

        data.forEach((dataRow) => {
            // Append a row to the table body
            const row = tbody.append("tr");

            // Loop through each field in the dataRow and add
            // each value as a table cell (td)

            Object.entries(dataRow).forEach(([key, val]) => {

                if (key == "title") {
                    row.append("td").text(val);
                }
                if (key == "director") {
                    row.append("td").text(val);
                }
                if (key == "popularity") {
                    row.append("td").text(val);
                }
                if (key == "release_date") {
                    row.append("td").text(val);
                }
                if (key == "homepage") {
                    row.append("td").text(val).on("click", function() { window.open(val); });;
                }
                if (key == "vote_average") {

                    row.append("td")
                        .append("div")
                        .attr("class", "progress shadow")
                        .style("height", 3 + "px")
                        .append("div")
                        .attr("class", "progress-bar")
                        .attr("role", "progressbar")
                        .style("width", val * 10 + "%");

                }
            });
        });
    }


    function chart_1(most_popular) {
        x1 = most_popular.map(ele => ele.revenue);
        x2 = most_popular.map(ele => ele.budget)
        y = most_popular.map(ele => ele.title)
        var options = {
            theme: {
                mode: 'light',
                palette: 'palette1',
                monochrome: {
                    enabled: false,
                    color: '#255aee',
                    shadeTo: 'light',
                    shadeIntensity: 0.65
                },
            },
            series: [{
                name: 'Revenue',
                data: x1
            }, {
                name: 'Budget',
                data: x2
            }],
            chart: {
                height: 280,
                type: 'area',
                foreColor: '#ffffff',
                toolbar: {
                    show: false,
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'smooth'
            },
            yaxis: {
                labels: {
                    formatter: function numFormatter(num) {
                        if (num > 999 && num < 1000000) {
                            return (num / 1000).toFixed(1) + 'K'; // convert to K for number from > 1000 < 1 million 
                        } else if (num > 1000000 && num < 1000000000) {
                            return (num / 1000000).toFixed(1) + 'M'; // convert to M for number from > 1 million 
                        } else if (num > 1000000000) {
                            return (num / 1000000000).toFixed(1) + 'B'; // convert to M for number from > 1 million 
                        } else if (num < 900) {
                            return num; // if value < 1000, nothing to do
                        }
                    }
                },

            },
            grid: {
                show: true,
                position: 'back',
                borderColor: '#90A4AE'
            },
            xaxis: {
                type: 'category',
                categories: y,
                labels: {
                    show: false,
                    rotate: 45,
                },
                tickamount: 12,
                fill: {
                    type: 'solid',
                    color: '#ffffff',
                }

            },
            tooltip: {
                // x: {
                //     format: 'dd/MM/yy HH:mm'
                // },
                theme: 'dark'
            },
            legend: {
                position: 'top',
            },


        };


        var chart = new ApexCharts(document.querySelector("#chart1"), options);
        chart.render();

    }

});


$(document).on('click', '.submit', function(e) {
    e.preventDefault();
    var direction = this.value;
    var data = $('#limesurvey').serialize() + "&move=" + direction;
    $.ajax("//yoursurveydomain.com/index.php/survey", {
        cache: false,
        type: "POST",
        data: data,
        success: function(response) {
            var $data = $(response);
            var limesurvey = $data.find("#limesurvey").html();
            if (typeof limesurvey !== "undefined") {
                $('#limesurvey').html(limesurvey);
                loadScripts();
            } else {
                //this will be a quota/term/complete or some other page without questions
                $('div.outerframe.clearfix').html($data.filter('div.outerframe.clearfix').html());
            }
        },
        error: function(response) {

        }
    }).done(function() {
        //trigger any doc ready scripts we may have just loaded
        jQuery.ready();
    });
});