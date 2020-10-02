var jsonData;

// add values to dropdown menu
d3.json('../../samples.json').then(function(data) {
    jsonData=data;
    var drops = data.names;     
    var sel = document.getElementById('selDataset');
    for(var i = 0; i < drops.length; i++) {
        var opt = document.createElement('option');
        opt.innerHTML = drops[i];
        opt.value = drops[i];
        sel.appendChild(opt);
    }
    barChart();
});

  



// make function to chart ID in the selection box
function barChart() {
    d3.json('../../samples.json').then(function(data) {

        var selection= d3.select('#selDataset');
        var inputValue= selection.property('value');
        demoFill(inputValue);

        bubbles(inputValue);
    
        data.samples.forEach((entry)=> {
            if (entry.id == inputValue) {
                var sampV= entry.sample_values.slice(0, 10);
                var oids= entry.otu_ids.slice(0,10).map(i=>'OTU ID: '+i);
                //console.log(sampV);
                //console.log(oids);

                var trace1= {
                    x: sampV,
                    y: oids,
                    type: "bar",
                    orientation: 'h'
                };
            
                var data=[trace1];
            
                var layout = {
                    title: `Belly Button ID: ${inputValue}`,
                };
            
                Plotly.newPlot('bar', data, layout);
        
            }

             
        });
    });
};

//make on change selection call barChart function
var idSelection=d3.select("#selDataset");
idSelection.on("change", barChart);


/// make function to fill Demographic Info
function demoFill(inputValue) {
    var dems= jsonData.metadata.filter(name=> name.id==inputValue)[0];
    var demInfo= d3.select('#sample-metadata');
    demInfo.html('')
    for (const [key, value] of Object.entries(dems)) {
        demInfo.append('p').text(`${key}: ${value}`);
    }
};
    
// make function to create Bubble Chart
function bubbles(idnumber) {
    var sample= jsonData.samples.filter(person => person.id == idnumber)[0];
    var otus= sample.otu_ids;
    var sampValues= sample.sample_values;

    var trace= {
        x: otus,
        y: sampValues,
        marker: {
            color: otus,
            size: sampValues},
        mode: 'markers'
    };

    var layout= {
        title: `Sample ID ${idnumber}`,
        xaxis: {
            title: "OTU Id Numbers"},
        yaxis: {
            title: "OTU Count"}
    }

    Plotly.newPlot('bubble', [trace], layout);
};