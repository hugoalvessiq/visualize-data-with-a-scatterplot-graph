const {
  json,
  extent,
  timeParse,
  timeFormat,
  tickFormat,
  tooltip,
  format,
  scaleLinear,
  max,
  min,
  axisBottom,
  axisLeft,
} = d3;

const dataYear = [];

d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
).then((data) => {
  const w = 950;
  const h = 500;
  const padding = 50;

  const tooltip = d3
    .select("body")
    .append("div")
    .data(data)
    .style("position", "absolute")
    .attr("id", "tooltip")
    .style("visibility", "hidden")
    .style("background", "grey")
    .style("padding", "10px")
    .style("opacity", 1)
    .style("color", "white")
    .style("border-radius", "5px");

  data.map((d) => {
    dataYear.push(d.Time);
  });

  const svg = d3
    .select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  svg
    .append("text")
    .attr("id", "title")
    .attr("x", w / 2)
    .attr("y", 40)
    .attr("text-anchor", "middle")
    .style("font-size", "30px")
    .text("Doping in Professional Bicycle Racing");
  svg
    .append("text")
    .attr("id", "title")
    .attr("x", w / 2)
    .attr("y", 67)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .text("35 Fastest times up Alpe d'Huez");

  const formatMinSec = "%M:%S";

  const xScale = d3
    .scaleLinear()
    .domain([
      new Date(min(data, (d) => d.Year) - 1),
      new Date(max(data, (d) => d.Year) + 1),
    ])
    .range([padding, w - padding]);

  const yScale = d3
    .scaleTime()
    .domain(
      extent(
        data.map(function (d) {
          return timeParse(formatMinSec)(d.Time);
        })
      )
    )
    .range([padding, h - padding]);

  svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("data-xvalue", (d) => d.Year)
    .attr("data-yvalue", (d) => {
      const newDate = new Date(
        d.Year,
        0,
        0,
        0,
        d.Time.slice(0, 2),
        d.Time.slice(3)
      );
      return newDate.toString();
    })
    .attr("cx", (d) => xScale(new Date(d.Year)))
    .attr("cy", (d) => yScale(d3.timeParse("%M:%S")(d.Time)))
    .attr("r", 5)
    .style("stroke", "#000")
    .style("fill", (d, i) => {
      if (d.Doping.length === 0) {
        return "#76c893";
      } else {
        return "#f07167";
      }
    })
    .on("mouseover", (d, i) => {
      return tooltip.style("visibility", "visible");
    })
    .on("mousemove", (d, i) => {
      tooltip
        .attr("data-year", `${i.Year}`)
        .style("left", d.pageX + 10 + "px")
        .style("top", d.pageY + 20 + "px");

      d3.selectAll("#tooltip")
        .html(
          `${i.Name}: ${i.Nationality} <br/>Year: ${i.Year}, Time: ${i.Time}<br><br>${i.Doping}`
        )
        .style("font-size", "0.8rem")
        .style("font-family", "Helvetica");

      return tooltip.style("visibility", "visible");
    })
    .on("mouseout", (d, i) => {
      return tooltip.style("visibility", "hidden");
    });

  const xAxis = axisBottom(xScale).tickFormat(format("d"));

  const yAxis = axisLeft(yScale).tickFormat((d, i) => {
    return timeFormat(formatMinSec)(d);
  });

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -200)
    .attr("y", 70)
    .text("Time in Minutes");

  svg
    .append("text")
    .attr("x", w - 260)
    .attr("y", h - 270)
    .style("font-size", "14")
    .attr("id", "title")
    .text("Riders with doping allegations 🟥")
    .attr("id", "legend");
  svg
    .append("text")
    .attr("x", w - 211)
    .attr("y", h - 250)
    .style("font-size", "14")
    .attr("id", "title")
    .text("No doping allegations 🟩")
    .attr("id", "legend");

  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .call(xAxis);
  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis);
});
