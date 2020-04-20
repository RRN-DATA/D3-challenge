var svgWidth = 900;
var svgHeight = 600;

  var margin = {
    top: 50,
    bottom: 100,
    right: 50,
    left: 110
  };

var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;


var labelspair={"poverty": "Poverty (%)","age":"Age (Median)","income":"Household Income (Median)","healthcare":"Lacks Healthcare (%)","smokes":"Smokes (%)","obesity":"Obesity (%)"}
var Xlabels ={"poverty": "Poverty (%)","age":"Age (Median)","income":"Household Income (Median)"}
var Ylabels={"healthcare":"Lacks Healthcare (%)","smokes":"Smokes (%)","obesity":"Obesity (%)"}

var mainX="poverty";
var mainY="healthcare";
var bubbleText="abbr";
var tipText="state"
var chartGroup,labelsGroup,axisI,pairAxis,pdata;
var iPair={0:3,1:4,2:5,3:0,4:1,5:2}



function Chartfunction(){
    var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);
    var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
return chartGroup;
}

function Scalefunction(pdata,axisName)
{
    var currentLinearScale = d3.scaleLinear()
    .domain([d3.min(pdata, d => d[axisName]*0.9),d3.max(pdata, d => d[axisName]*1.6)])
    .range([0, width]);
return currentLinearScale;
};
function Axisfunction(chartGroup,xLinearScale,yLinearScale){
// create axes
if (xLinearScale)
{
    var xAxis = d3.axisBottom(xLinearScale);
    chartGroup.append("g")
    .transition()
    .duration(1000)
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);  
    return xAxis;
}
if(yLinearScale)
{
    var yAxis = d3.axisLeft(yLinearScale);
    chartGroup.append("g")
    .transition()
    .duration(1000)
    .call(yAxis); 
    return yAxis;
}
}
function createChartCircles(chartGroup,pdata,mainX,mainY,xLinearScale,yLinearScale){
var circlesGroup = chartGroup.selectAll("circle")
.data(pdata)
.enter()
.append("circle")
.attr("cx", d => xLinearScale(d[mainX]))
.attr("cy", d => yLinearScale(d[mainY]))
.attr("r", "13")
.attr("fill", "lightblue")
.attr("stroke-width", "1")
.attr("stroke", "black")
.attr("opacity", "0.8");

var toolTip = d3.tip()
.attr("class", "tooltip")
.offset([60, +60])
.html(function(d) {
return (`<strong>${d.state}</strong><br>Poverty: ${d.poverty}%<br>Obesity: ${d.obesity}%`);
});

chartGroup.call(toolTip);

circlesGroup.on("mouseover", function(d) {
  toolTip.show(d, this);

  d3.select(this)
  .transition()
  .duration(1000)
  .attr("r", 30)
})
.on("mouseout", function(d) {
  toolTip.hide(d);
  d3.select(this)
  .transition()
  .duration(1000)
  .style("stroke", "#000")
  .attr("r", 13)
  .style("fill","lightgrey");
});

return circlesGroup
}
function updateText(chartGroup,pdata,mainX,mainY,bubbleText,xLinearScale,yLinearScale){
var TextGroup = chartGroup.selectAll()
.data(pdata)
.enter()
.append("text")
.text(d => (d[bubbleText]))
.attr("x", d => xLinearScale(d[mainX]))
.attr("y", d => yLinearScale(d[mainY]))
.style("font-size", "11px")
.style("text-anchor", "middle")
.style('fill', 'black')
.attr("opacity", ".5")
;

return TextGroup;
}
function createLabelsGroup(chartGroup){
var labelsGroup = chartGroup.append("g")
.attr("transform", `translate(${width / 2}, ${height + 20})`);

return labelsGroup;
}
function setLabel(labelsGroup,CurrentKey,axis,i,ActiveKey){
var CurrentKeyValue, degrees,x,y;
                Object.entries(labelspair).forEach(([key,value])=>{
                  if (CurrentKey ==key)
                  {
                    CurrentKeyValue =value;
                  }
                })
if (axis=="X"){
  degrees = 0;
  x=0
  y=(i+1)*20
}
else{
  degrees=-90;
  x=(margin.left) * 2.5
  
  y=0 - (height - i*20);
}
var currentLabel = labelsGroup.append("text")
.attr("transform", "rotate("+degrees+")")
.attr("x", x)
.attr("y", y)
.attr("value", CurrentKey)
.text(CurrentKeyValue);


      if (ActiveKey==CurrentKey){
          console.log("a="+ActiveKey);
            currentLabel.classed("active", true);
            currentLabel.classed("inactive", false);
      }
      else if (ActiveKey == null)
      {
          if (i==0)
            {
              currentLabel.classed("active", true);
              currentLabel.classed("inactive", false);
            }
          if (i==3)
            {
              currentLabel.classed("active", true);
              currentLabel.classed("inactive", false);
            }
        }
      else
        {
          currentLabel.classed("active", false);
          currentLabel.classed("inactive", true);
        }

}

function populateLabels(labelsGroup,mainX,mainY){
var i=0;
Object.keys(Xlabels).forEach((key)=>{
  setLabel(labelsGroup,key,"X",i,mainX)
  i++

 });

Object.keys(Ylabels).forEach((key)=>{
setLabel(labelsGroup,key,"Y",i,mainY)
i--
});
}

function findObject(clickedvalue){
var i=0;
Object.keys(labelspair).forEach((key)=>{
  if(key==clickedvalue){
    Object.entries(iPair).forEach(([key,value])=>{
        if (key == i){
          axisI=value;
        }
    })
  }
  i++;
})
var j=0
Object.keys(labelspair).forEach((key)=>{
  
  if (j==axisI){
    pairAxis=key;
   
  }
  j++;
});

return pairAxis;
}



function dataFunction(mainX,mainY){
    var svgArea = d3.select("body").select("svg");
    if (!svgArea.empty()) {
        svgArea.remove();
      }
    console.clear();
    d3.csv("D3_data_journalism/assets/data/data.csv").then(function(pdata) {    
        pdata.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        data.age = +data.age;
        data.income = +data.income;
        data.smokes = +data.smokes;
        data.obesity = +data.obesity;
        });
       
        
        var chartGroup = Chartfunction();
        var xLinearScale=Scalefunction(pdata,mainX)
        var yLinearScale=Scalefunction(pdata,mainY)
        Axisfunction(chartGroup,xLinearScale,null);
        Axisfunction(chartGroup,null,yLinearScale);
        circlesGroup=createChartCircles(chartGroup,pdata,mainX,mainY,xLinearScale,yLinearScale);
        updateText(chartGroup,pdata,mainX,mainY,bubbleText,xLinearScale,yLinearScale);
        
        var labelsGroup=createLabelsGroup(chartGroup);
        populateLabels(labelsGroup,mainX,mainY)
    

        labelsGroup.selectAll("text")
        .on("click", function() {
        var clickedvalue = d3.select(this).attr("value");
        var PairAxis=findObject(clickedvalue)
        Object.keys(Xlabels).forEach((key)=>{
            if(clickedvalue==key)
                {

                    mainX=clickedvalue;
                    mainY=PairAxis;
                    dataFunction(mainX,mainY);
                }
        })
        Object.keys(Ylabels).forEach((key)=>{
            if(clickedvalue==key)
                {

                    mainY=clickedvalue;
                    mainX=PairAxis;
                    dataFunction(mainX,mainY);
                }
        })
    })
    });
}

dataFunction(mainX,mainY);
