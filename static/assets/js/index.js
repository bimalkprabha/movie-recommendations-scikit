// $(function() {
//     "use strict";

//      // chart 1

// 		  var ctx = document.getElementById('chart1').getContext('2d');

// 			var myChart = new Chart(ctx, {
// 				type: 'line',
// 				data: {
// 					labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
// 					datasets: [{
// 						label: 'New Visitor',
// 						data: [3, 3, 8, 5, 7, 4, 6, 4, 6, 3],
// 						backgroundColor: '#fff',
// 						borderColor: "transparent",
// 						pointRadius :"0",
// 						borderWidth: 3
// 					}, {
// 						label: 'Old Visitor',
// 						data: [7, 5, 14, 7, 12, 6, 10, 6, 11, 5],
// 						backgroundColor: "rgba(255, 255, 255, 0.25)",
// 						borderColor: "transparent",
// 						pointRadius :"0",
// 						borderWidth: 1
// 					}]
// 				},
// 			options: {
// 				maintainAspectRatio: false,
// 				legend: {
// 				  display: false,
// 				  labels: {
// 					fontColor: '#ddd',  
// 					boxWidth:40
// 				  }
// 				},
// 				tooltips: {
// 				  displayColors:false
// 				},	
// 			  scales: {
// 				  xAxes: [{
// 					ticks: {
// 						beginAtZero:true,
// 						fontColor: '#ddd'
// 					},
// 					gridLines: {
// 					  display: true ,
// 					  color: "rgba(221, 221, 221, 0.08)"
// 					},
// 				  }],
// 				   yAxes: [{
// 					ticks: {
// 						beginAtZero:true,
// 						fontColor: '#ddd'
// 					},
// 					gridLines: {
// 					  display: true ,
// 					  color: "rgba(221, 221, 221, 0.08)"
// 					},
// 				  }]
// 				 }

// 			 }
// 			});  


//     // chart 2

// 		var ctx = document.getElementById("chart2").getContext('2d');
// 			var myChart = new Chart(ctx, {
// 				type: 'doughnut',
// 				data: {
// 					labels: ["Direct", "Affiliate", "E-mail", "Other"],
// 					datasets: [{
// 						backgroundColor: [
// 							"#ffffff",
// 							"rgba(255, 255, 255, 0.70)",
// 							"rgba(255, 255, 255, 0.50)",
// 							"rgba(255, 255, 255, 0.20)"
// 						],
// 						data: [5856, 2602, 1802, 1105],
// 						borderWidth: [0, 0, 0, 0]
// 					}]
// 				},
// 			options: {
// 				maintainAspectRatio: false,
// 			   legend: {
// 				 position :"bottom",	
// 				 display: false,
// 				    labels: {
// 					  fontColor: '#ddd',  
// 					  boxWidth:15
// 				   }
// 				}
// 				,
// 				tooltips: {
// 				  displayColors:false
// 				}
// 			   }
// 			});




//    });

// const table = d3.select("table")

const tbody = d3.select("#table1");

d3.json('/data', function(res) {
    // console.log(res);

    render_chart(res);


    function render_chart(data) {

        let popularity = data.map((ele) => ele.popularity);
        let most_popular = data.sort(function(a, b) {
            return b.popularity - a.popularity;
        });
        most_popular = most_popular.slice(0, 10)
            // console.log(title.slice(0, 12));
            // console.log(most_popular[0]);
            //  Chart 1
        chart_1(most_popular);
        // Table
        buildTable(most_popular)

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
                height: 250,
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