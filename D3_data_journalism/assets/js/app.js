function makeResponsive() {

    // if SVG area is not empty, remove and replace with resized version
    var svgArea = d3.select("body").select("svg");
    if (!svgArea.empty()) {
        svgArea.remove();
    };

    // Set up chart
    var svgWidth = window.innerWidth;
    var svgHeight = window.innerHeight;

    var margin = {
        top: 20,
        right: 40,
        bottom: 60,
        left: 50
    };

    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    // Create an SVG wrapper
    var svg = d3
        .select("#scatter")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    // Append SVG group and shift by margins
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Import the data 
    d3.csv("././assets/data/data.csv").then(function(censusData) {

        // Format the data
        censusData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        });

        // Create the scales
        var xScale = d3.scaleLinear()
            .domain([d3.min(censusData, data => data.poverty) - 1, d3.max(censusData, data => data.poverty)])
            .range([0, width]);
        
        var yScale = d3.scaleLinear()
            .domain([0, d3.max(censusData, data => data.healthcare)])
            .range([height, 0]);

        // Create the axes
        var bottomAxis = d3.axisBottom(xScale);
        var leftAxis = d3.axisLeft(yScale);

        // Append axes to chartGroup
        chartGroup.append("g").attr("transform", `translate(0, ${height})`).call(bottomAxis);
        chartGroup.append("g").call(leftAxis);

        // Label x axis
        chartGroup.append("text")
            .attr("transform", `translate(${width/2}, ${height + 40})`)
            .style("text-anchor", "middle")
            .text("% in Poverty");

        // Label y axis
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height/2)
            .attr("y", -30)
            .style("text-anchor", "middle")
            .text("Lacks Healthcare (%)");

        // Append circles to chartGroup
        chartGroup.selectAll("circle")
            .data(censusData)
            .enter()
            .append("circle")
            .attr("cx", (data => xScale(data.poverty)))
            .attr("cy", (data => yScale(data.healthcare)))
            .attr("r", "8")
            .attr("fill", "lightskyblue");

        // Append labels to chartGroup
        chartGroup.selectAll("labels")
            .data(censusData)
            .enter()
            .append("text")
            .attr("x", (data => xScale(data.poverty)))
            .attr("y", (data => yScale(data.healthcare)))
            .attr("dx", "-0.7em")
            .attr("dy", "0.35em")
            .attr("font-size", "8px")
            .attr("font-weight", "bold")
            .attr("fill", "white")
            .text(data => data.abbr)
            ;

    }).catch(function(error) {
        console.log(error);
    });
};

makeResponsive();

// resize chart when browser window is resized
d3.select(window).on("resize", makeResponsive);
