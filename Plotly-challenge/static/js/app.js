function init() {
// Select the dropdown element
var selector = d3.select("#selDataset");
    
// Populate the dropdown with subject ID's from the list of sample Names
d3.json("data/samples.json").then((data) => {
    var subjectIds = data.names;
    subjectIds.forEach((id) => {
        selector
        .append("option")
        .text(id)
        .property("value", id);
        });
      
    // Use the first subject ID from the names to build initial plots
    const firstSubject = subjectIds[0];
    updateCharts(firstSubject);
    updateMetadata(firstSubject);
    });
}
  
function updateMetadata(sample) {
d3.json("data/samples.json").then((data) => {
    var metadata = data.metadata;
    var filterArray = metadata.filter(sampleObject => sampleObject.id == sample);
    var result = filterArray[0];
    var metaPanel = d3.select("#sample-metadata");
    metaPanel.html("");
    Object.entries(result).forEach(([key, value]) => {
    metaPanel.append("h6").text(`${key.toUpperCase()}: ${value}`)
    })
    
// Data for Gauge Chart
var data = [
    {
    domain: { x: [0, 1], y: [0, 1] },
    marker: {size: 28, color:'850000'},
    value: result.wfreq,
    title: 'Belly Button Washing Frequency<br> Scrubs per Week',
    titlefont: {family: '"Palatino Linotype", "Book Antiqua", Palatino, serif'},
    type: "indicator",
    mode: "gauge+number"
    }
    ];

// Layout for Gauge Chart
  
var layout = {
    width: 450,
    height: 400,
    margin: { t: 25, r: 25, l: 25, b: 25 },
    line: {
    color: '600000'
    },
    paper_bgcolor: "#a5bdc6",
    font: { color: "#85541d", family: "Serif" }
    };
    
Plotly.newPlot("gauge", data, layout);
    });
  }
  
  
function updateCharts(sample) {    
d3.json("data/samples.json").then((data) => {
    var samples = data.samples;
    var filterArray = samples.filter(sampleObject => sampleObject.id == sample);
    var result = filterArray[0];
    var sample_values = result.sample_values;
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;   
// Bubble Chart
    var trace1 = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
        size: sample_values,
        color: otu_ids,
        colorscale:"Electric"
        }
    };
    var data = [trace1];
    var layout = {
        title: 'Bacteria Cultures per Sample',
        showlegend: false,
        hovermode: 'closest',
        xaxis: {title:"OTU (Operational Taxonomic Unit) ID " +sample},
        margin: {t:30}
    };
Plotly.newPlot('bubble', data, layout); 
// Bar Chart
    var trace1 = {
        x: sample_values.slice(0,10).reverse(),
        y: otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse(),
        text: otu_labels.slice(0,10).reverse(),
        name: "Greek",
        type: "bar",
        orientation: "h"
    };
    var data = [trace1];
    var layout = {
        title: "Top Ten OTUs for Individual " +sample,
        margin: {l: 100, r: 100, t: 100, b: 100}
    };
    Plotly.newPlot("bar", data, layout);  
    });
  }
  
  
function optionChanged(newSample) {
// Fetch new data each time a new sample is selected
updateCharts(newSample);
updateMetadata(newSample);
  }
  
// Initialize the dashboard
init();



//ATTEMPT 2 PLOTLY HW
// function getPlots(id) {
// //Read samples.json
//     d3.json("samples.json").then (sampledata =>{
//         console.log(sampledata)
//         var ids = sampledata.samples[0].otu_ids;
//         console.log(ids)
//         var sampleValues =  sampledata.samples[0].sample_values.slice(0,10).reverse();
//         console.log(sampleValues)
//         var labels =  sampledata.samples[0].otu_labels.slice(0,10);
//         console.log (labels)
//     // get only top 10 otu ids for the plot OTU and reversing it. 
//         var OTU_top = ( sampledata.samples[0].otu_ids.slice(0, 10)).reverse();
//     // get the otu id's to the desired form for the plot
//         var OTU_id = OTU_top.map(d => "OTU " + d);
//         console.log(`OTU IDS: ${OTU_id}`)
//     // get the top 10 labels for the plot
//         var labels =  sampledata.samples[0].otu_labels.slice(0,10);
//         console.log(`OTU_labels: ${labels}`)
//         var trace = {
//             x: sampleValues,
//             y: OTU_id,
//             text: labels,
//             marker: {
//             color: 'blue'},
//             type:"bar",
//             orientation: "h",
//         };
//         // create data variable
//         var data = [trace];
    
//         // create layout variable to set plots layout
//         var layout = {
//             title: "Top 10 OTU",
//             yaxis:{
//                 tickmode:"linear",
//             },
//             margin: {
//                 l: 100,
//                 r: 100,
//                 t: 100,
//                 b: 30
//             }
//         };
    
//         // create the bar plot
//         Plotly.newPlot("bar", data, layout);
//         // The bubble chart
//         var trace1 = {
//             x: sampledata.samples[0].otu_ids,
//             y: sampledata.samples[0].sample_values,
//             mode: "markers",
//             marker: {
//                 size: sampledata.samples[0].sample_values,
//                 color: sampledata.samples[0].otu_ids
//             },
//             text:  sampledata.samples[0].otu_labels
//         };
    
//         // set the layout for the bubble plot
//         var layout_2 = {
//             xaxis:{title: "OTU ID"},
//             height: 600,
//             width: 1000
//             };
    
//         // creating data variable 
//         var data1 = [trace1];
    
//         // create the bubble plot
//         Plotly.newPlot("bubble", data1, layout_2); 
//         });
//     }  
// // create the function to get the necessary data
// function getDemoInfo(id) {
// // read the json file to get data
// d3.json("samples.json").then((data)=> {
// // get the metadata info for the demographic panel
//     var metadata = data.metadata;
    
//     console.log(metadata)
    
//     // filter meta data info by id
//     var result = metadata.filter(meta => meta.id.toString() === id)[0];
//     // select demographic panel to put data
//     var demographicInfo = d3.select("#sample-metadata");
            
//     // empty the demographic info panel each time before getting new id info
//     demographicInfo.html("");
    
//     // grab the necessary demographic data data for the id and append the info to the panel
//     Object.entries(result).forEach((key) => {   
//         demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
//             });
//         });
//     }
// // create the function for the change event
// function optionChanged(id) {
//     getPlots(id);
//     getDemoInfo(id);
//     }
    
// // create the function for the initial data rendering
// function init() {
// // select dropdown menu 
// var dropdown = d3.select("#selDataset");
    
// // read the data 
// d3.json("samples.json").then((data)=> {
//     console.log(data)
    
// // get the id data to the dropdwown menu
// data.names.forEach(function(name) {
//     dropdown.append("option").text(name).property("value");
//     });
    
// // call the functions to display the data and the plots to the page
// getPlots(data.names[0]);
// getDemoInfo(data.names[0]);
//     });
// }
    
// init();





//ATTEMPT 1 PLOTLY HW

// //global variable
// var data;

// // read in data from the samples.json file
// function init() {
//     d3.json("JS/data/samples.json").then(dataInitial => {
//       data = dataInitial;
//       var selectValues = dataInitial.names;
  
//       var selectOpt = d3.select("#selDataset");
  
//       selectValues.forEach(value => {
//         selectOpt
//           .append("option")
//           .text(value)
//           .attr("value", function() {
//             return value;
//           });
//       });
//     });
//   }

// //start filling the data inside the select option
// init();

// //

// d3.selectAll("#selDataset").on("change", plotFunctions);

// function plotFunctions() {
//     var valueSelect = d3.select("#selDataset").node().value;
//     demographicFunc(valueSelect);
//     panelPlot(valueSelect);
//     demographicFunc(valueSelect);
//     bubbleChart(valueSelect);
//     gaugeChart(valueSelect);
//   }
  
//   function demographicFunc(valueSelect) {
//     var filterValue2 = data.samples.filter(value => value.id == valueSelect);
//     var ouid = filterValue2.map(v => v.otu_ids);
//     ouid = treatOuid(ouid[0].slice(0, 10));
//     var valueX = filterValue2.map(v => v.sample_values);
//     valueX = valueX[0].slice(0, 10);
  
//     var out_label = filterValue2.map(v => v.otu_labels);
//     var names = treatBacName(out_label[0]).slice(0, 10);
//     // console.log(ouid);
//     // console.log(valueX);
//     // console.log(out_label);
//     // console.log(names);
  
//     // Create the Trace
//     var trace = {
//       x: valueX,
//       y: ouid,
//       text: names,
//       type: "bar",
//       orientation: "h"
//     };
  
//     var layout = {
//       yaxis: {
//         autorange: "reversed"
//       }
//     };
  
//     // Create the data array for the plot
//     var dataV = [trace];
  
//     // Plot the chart to a div tag with id "bar-plot"
//     Plotly.newPlot("bar", dataV, layout);
//   }
  
//   function panelPlot(valueSelect) {
//     //   console.log(valueSelect);
//     var filterValue = data.metadata.filter(value => value.id == valueSelect);
  
//     var divValue = d3.select(".panel-body");
//     divValue.html("");
//     divValue.append("p").text(`id: ${filterValue[0].id}`);
//     divValue.append("p").text(`ethnicity: ${filterValue[0].ethnicity}`);
//     divValue.append("p").text(`gender: ${filterValue[0].gender}`);
//     divValue.append("p").text(`age: ${filterValue[0].age}`);
//     divValue.append("p").text(`location: ${filterValue[0].location}`);
//     divValue.append("p").text(`bbtype: ${filterValue[0].bbtype}`);
//     divValue.append("p").text(`wfreq: ${filterValue[0].wfreq}`);
//   }
  
//   function bubbleChart(valueSelect) {
//     var filterValue3 = data.samples.filter(value => value.id == valueSelect);
//     var ouid = filterValue3.map(v => v.otu_ids);
//     ouid = ouid[0];
//     var valueY = filterValue3.map(v => v.sample_values);
//     valueY = valueY[0];
  
//     var out_label = filterValue3.map(v => v.otu_labels);
//     out_label = treatBacName(out_label[0]);
  
//     var trace1 = {
//       x: ouid,
//       y: valueY,
//       mode: "markers",
//       marker: {
//         color: ouid,
//         size: valueY
//       },
//       text: out_label
//     };
  
//     var data2 = [trace1];
  
//     var layout = {
//       showlegend: false,
//       xaxis: { title: "OTU ID" }
//     };
  
//     Plotly.newPlot("bubble", data2, layout);
//   }

// //function to create gauge chart and set the value based on the value selected
// function gaugeChart(valueSelect) {
//     var filterValue = data.metadata.filter(value => value.id == valueSelect);
//     var weeklyFreq = filterValue[0].wfreq;
  
//     var data2 = [
//       {
//         domain: { x: [0, 1], y: [0, 1] },
//         title: {
//           text: "Belly Button Washing Frequency <br>Scrubs per Week"
//         },
//         type: "indicator",
  
//         mode: "gauge",
//         gauge: {
//           axis: {
//             range: [0, 9],
//             tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
//             ticks: "outside"
//           },
  
//           steps: [
//             { range: [0, 1], color: "EEDFE7" },
//             { range: [1, 2], color: "#E2CBD2" },
//             { range: [2, 3], color: "#D5B6BA" },
//             { range: [3, 4], color: "#C9A4A2" },
//             { range: [4, 5], color: "#BC998E" },
//             { range: [5, 6], color: "#AF917A" },
//             { range: [6, 7], color: "#A28B67" },
//             { range: [7, 8], color: "#797B4C" },
//             { range: [8, 9], color: "#5D673E" }
//           ],
//           threshold: {
//             line: { color: "red", width: 4 },
//             thickness: 1,
//             value: weeklyFreq
//           }
//         }
//       }
//     ];
  
//     var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
//     Plotly.newPlot("gauge", data2, layout);
//   }
  
// //function to return the name of the bacteria.
// // if a array value has more than one name, it will consider the last name of the value
// // return just the 10 first values of the result
// function treatBacName(name) {
//     var listOfBact = [];
  
//     for (var i = 0; i < name.length; i++) {
//       var stringName = name[i].toString();
//       var splitValue = stringName.split(";");
//       if (splitValue.length > 1) {
//         listOfBact.push(splitValue[splitValue.length - 1]);
//       } else {
//         listOfBact.push(splitValue[0]);
//       }
//     }
//     return listOfBact;
//   }
  
//   function treatOuid(name) {
//     var listOfOuid = [];
//     for (var i = 0; i < name.length; i++) {
//       listOfOuid.push(`OTU ${name[i]}`);
//     }
//     return listOfOuid;
//   } 