
// dummy data
import { appleStock } from "@vx/mock-data";

import React, { Component } from 'react';
import { LinePath, Line, Bar } from "@vx/shape";
import { scaleTime, scaleLinear, scaleLog, scalePower } from "@vx/scale";
import { GridRows, GridColumns } from '@vx/grid';
import { localPoint } from "@vx/event";
import { extent, max, bisector } from "d3-array";
import { withTooltip, Tooltip } from '@vx/tooltip';
import { timeFormat } from 'd3-time-format';


// get data
//const stock = appleStock.slice(800);
const formatDate = timeFormat("%b %d, '%y");

// accessors
const xData = d => new Date(d.date);
const yData = d => d.score;
const bisectDate = bisector(d => new Date(d.date)).left;


class Area extends Component {
    constructor(props) {
        super(props);
        this.handleTooltip = this.handleTooltip.bind(this);
    }

    handleTooltip({ event, data, xData, xScale, yScale }) {
        const { showTooltip } = this.props;
        const { x } = localPoint(event);
        const x0 = xScale.invert(x);
        const index = bisectDate(data, x0, 1);
        const d0 = data[index - 1];
        const d1 = data[index];
        let d = d0;
        if (d1 && d1.date) {
          d = x0 - xData(d0.date) > xData(d1.date) - x0 ? d1 : d0;
        }
        showTooltip({
          tooltipData: d,
          tooltipLeft: x,
          tooltipTop: yScale(d.score),
        });
    };

    render(){
        const {
            width,
            height,
            margin,

            showTooltip,
            hideTooltip,
            tooltipData,
            tooltipTop,
            tooltipLeft,
            events,
        } = this.props;
        if (width < 10) return null;

        const {
            data,
        } = this.props;
        //console.log(data);

        // bounds
        const xMax = width - margin.left - margin.right;
        const yMax = height - margin.top - margin.bottom;


        //const { position } = this.state;
        // arbitrary
        // const width = 500;
        // const height = 300;

        // scale to fit the data into a view height
        // (500 from above)
        // domain == our data
        // extent() from d3 takes 2 lists and returns
        // min for first, max for second
        // const xScale = scaleTime({
        // range: [0, width],
        // domain: extent(data, xData),
        // });

        //const yMax = max(stock, yStock);

        // swapped range() so that 0 is at the bottom
        //  and max (300) is at the top
        // domain has to be a bit manual because
        // we need to add padding to the top
        // otherwise the max value is gonna hit the top
        // of the screen
        // const yScale = scalePower({
        // range: [height, 0],
        // domain: [0, max(data, yData) + yMax / 3],
        // nice: true,
        // });

        //console.log(position ? stock[position.index] : 'none');
        //let markerData = position ? stock[position.index] : 'none';
        //let markerLabel = position ? `${markerData.date.slice(0, 10)} value:${markerData.close}` : 'none';

        // make a jsx list of hashtags
        let xScale;
        let yScale;
        const listLinePaths = data.map((v,i) => {
            xScale = scaleTime({
                range: [0, width],
                domain: extent(v, xData),
            });
            yScale = scaleLinear({
                range: [height, 0],
                domain: [0, max(v, yData) + yMax / 3],
                nice: true,
            });

            //const {label, date, score} = v;
            return (<LinePath
                key={i}
                data={v}
                xScale={xScale}
                yScale={yScale}
                x={xData}  // i'm guessing these are labels
                y={yData}
                strokeWidth={1}
                stroke="#2AB0EA"
            />)
      
          })

        //   <LinePath
        //             data={data}
        //             xScale={xScale}
        //             yScale={yScale}
        //             x={xData}  // i'm guessing these are labels
        //             y={yData}
        //             strokeWidth={2}
        //             stroke="#2AB0EA"
        //         />
        
        // JSX here
        return (
            <div>
            <svg width={width} height={height}>
                <rect x={0} y={0} width={width} height={height} fill="transparent" rx={14} />

                {/* 
                weird boolean operator JS thing
                https://blog.mariusschulz.com/2016/05/25/the-andand-and-operator-in-javascript
                
                in this context, 
                - if position can be coerced into false, return position
                - otherwise return <Line..etc/>
                */}
                <GridRows
                    lineStyle={{ pointerEvents: 'none' }}
                    scale={yScale}
                    width={xMax}
                    strokeDasharray="2,2"
                    stroke="rgba(0,0,0,0.3)"
                />
                <GridColumns
                    lineStyle={{ pointerEvents: 'none' }}
                    scale={xScale}
                    height={yMax}
                    strokeDasharray="2,2"
                    stroke="rgba(0,0,0,0.3)"
                />
                
                {/* input line
                find out how to JSX an array
                */}
                {/* <LinePath
                    data={data}
                    xScale={xScale}
                    yScale={yScale}
                    x={xData}  // i'm guessing these are labels
                    y={yData}
                    strokeWidth={2}
                    stroke="#2AB0EA"
                /> */}

                {listLinePaths}

                

                <Bar
                    x={0}
                    y={0}
                    width={width}
                    height={height}
                    fill="transparent"
                    rx={14}
                    data={data[1]}
                    onTouchStart={data => event =>
                    this.handleTooltip({
                        event,
                        data,
                        xData,
                        xScale,
                        yScale,
                    })}
                    onTouchMove={data => event =>
                    this.handleTooltip({
                        event,
                        data,
                        xData,
                        xScale,
                        yScale,
                    })}
                    onMouseMove={data => event =>
                    this.handleTooltip({
                        event,
                        data,
                        xData,
                        xScale,
                        yScale,
                    })}
                    onMouseLeave={data => event => hideTooltip()}
                />
                
                {/* the pretty dotted line with white and blue dot thing */}
                {tooltipData && (
                    <g>
                    <Line
                        from={{ x: tooltipLeft, y: 0 }}
                        to={{ x: tooltipLeft, y: yMax }}
                        stroke="rgba(92, 119, 235, 1.000)"
                        strokeWidth={2}
                        style={{ pointerEvents: 'none' }}
                        strokeDasharray="2,2"
                    />
                    <circle
                        cx={tooltipLeft}
                        cy={tooltipTop + 1}
                        r={4}
                        fill="black"
                        fillOpacity={0.1}
                        stroke="black"
                        strokeOpacity={0.1}
                        strokeWidth={2}
                        style={{ pointerEvents: 'none' }}
                    />
                    <circle
                        cx={tooltipLeft}
                        cy={tooltipTop}
                        r={4}
                        fill="rgba(92, 119, 235, 1.000)"
                        stroke="white"
                        strokeWidth={2}
                        style={{ pointerEvents: 'none' }}
                    />
                    </g>
                )}

            </svg>

            {/* the white box date label thing */}
            {tooltipData && (
                <div>
                <Tooltip
                    top={tooltipTop - 12}
                    left={tooltipLeft + 12}
                    style={{
                    backgroundColor: 'rgba(92, 119, 235, 1.000)',
                    color: 'white',
                    }}
                >
                    {`score: ${yData(tooltipData)}`}
                </Tooltip>
                <Tooltip
                    top={yMax - 14}
                    left={tooltipLeft}
                    style={{
                    transform: 'translateX(-50%)',
                    }}
                >
                    {formatDate(xData(tooltipData))}
                </Tooltip>
                </div>
            )}
            </div>
        );
    }
}

export default withTooltip(Area);
