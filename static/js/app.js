




function buildPlots(id) {
    d3.json("/data/samples.json").then(data => {

        // selects data based off ID
        var selectedData = data.samples.filter(data => parseInt(data.id) === id)[0];
        
        // creates variables for bar chart
        var top_sample_value = selectedData.sample_values.slice(0,10).reverse();
        var top_otu_id = selectedData.otu_ids.slice(0,10).reverse().map(otu => "OTU " + otu);
        var top_otu_label = selectedData.otu_labels.slice(0,10).reverse();
    
        
        // creates variables for bubble chart
        var sample_value = selectedData.sample_values;
        var otu_id = selectedData.otu_ids;
        var otu_label = selectedData.otu_labels;

        // builds trace, data and then creates bar chart
        var barTrace = {
            x: top_sample_value,
            y: top_otu_id,
            text: top_otu_label,
            name: "bellybutton",
            type: "bar",
            orientation: "h"
          };

        var barData = [barTrace];

        Plotly.newPlot("bar", barData);

        // builds trace, data and then creates bubble chart
        var bubbleTrace = {
            x: otu_id,
            y: sample_value,
            mode: 'markers',
            text: otu_label,
            marker: {
                size: sample_value,
                color: otu_id
            }
        };

        var bubbleData = [bubbleTrace];
          
        Plotly.newPlot('bubble', bubbleData);
    });
}

function buildDemographics(id) {
    d3.json("/data/samples.json").then(data => {

        var demographic = data.metadata.filter(data => parseInt(data.id) === id)[0];

        var demographicInfo = d3.select("#sample-metadata");

        demographicInfo.html("");

        Object.entries(demographic).forEach(data => {   
            demographicInfo.append("p").text(data[0] + ": " + data[1]);    
        });

        var data = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: demographic.wfreq,
                title: { text: "Belly Button Washing Frequency <br> (Scrubs per week)" },
                type: "indicator",
                mode: "gauge+number",
                
                gauge: {
                    axis: { range: [null, 10] },
                    bar: {color: "brown"},
                    steps: [
                      { range: [8, 10], color: "rgba(14, 127, 0, .5)"},
                      { range: [6, 8], color: "rgba(110, 154, 22, .5)" },
                      { range: [4, 6], color: "rgba(170, 202, 42, .5)" },
                      { range: [2, 4], color: "rgba(202, 209, 95, .5)" },
                      { range: [0, 2], color: "rgba(210, 206, 145, .5)" }
                    ],
     
                  }
                
            }
        ];
        
        var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
        Plotly.newPlot('gauge', data, layout);



    });
}

function optionChanged(id) {
    buildPlots(parseInt(id));
    buildDemographics(parseInt(id));
}


function init() {
    // Use D3 to select the dropdown menu
    var dropdownMenu = d3.select("#selDataset");

    
    d3.json("/data/samples.json").then(data=> {
        data.names.forEach(function(name) {
            dropdownMenu.append("option").text(name).property("value");
        });
        console.log(data.names)
        
        buildPlots(940);
        buildDemographics(940);
    });
}

init()
