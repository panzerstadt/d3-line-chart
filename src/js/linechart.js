
import React, { Component } from 'react';
import { LinePath, Line, Bar } from "@vx/shape";
import { Marker } from "@vx/marker";
import { appleStock } from "@vx/mock-data";
import { scaleTime, scaleLinear } from "@vx/scale";
import { localPoint } from "@vx/event";
import { extent, max, bisector } from "d3-array";

// get data
const stock = appleStock.slice(800);

const xSelector = d => new Date(d.date);
const ySelector = d => d.close;
const bisectDate = bisector(xSelector).left;


class lineChartVX extends Component {
    state = {
        position: null,
    };

    handleDrag = ({ event, data, xSelector, xScale, yScale }) => {
        const { x } = localPoint(event);  // screen point
        const x0 = xScale.invert(x);
        let index = bisectDate(data, x0, 1);  //?
        const d0 = data[index -1];
        const d1 = data[index];
        let d = d0;
        if (d1 && d1.date) {
            if (x0 - xSelector(d0) > xSelector(d1) - x0) {
                d = d1;
            } else {
                d = d0;
                index = index -1;
            }
        }
    
        this.setState({
            position: {
                index, 
                x: xScale(xSelector(d)),
            },
        });
    };

    render(){
        const { position } = this.state;
        // arbitrary
        const width = 500;
        const height = 300;

        // scale to fit the data into a view height
        // (500 from above)
        // domain == our data
        // extent() from d3 takes 2 lists and returns
        // min for first, max for second
        const xScale = scaleTime({
        range: [0, width],
        domain: extent(stock, xSelector),
        });

        const yMax = max(stock, ySelector);

        // swapped range() so that 0 is at the bottom
        //  and max (300) is at the top
        // domain has to be a bit manual because
        // we need to add padding to the top
        // otherwise the max value is gonna hit the top
        // of the screen
        const yScale = scaleLinear({
        range: [height, 0],
        domain: [0, yMax + (yMax + 4)],
        });

        //console.log(position ? stock[position.index] : 'none');
        let markerData = position ? stock[position.index] : 'none';
        let markerLabel = position ? `${markerData.date.slice(0, 10)} value:${markerData.close}` : 'none';
        
        // JSX here
        return (
            <svg width={width} height={height}>
                <rect x={0} y={0} width={width} height={height} fill="transparent" rx={14} />
                <LinePath
                    data={position ? stock.slice(0, position.index) : stock}
                    xScale={xScale}
                    yScale={yScale}
                    x={xSelector}
                    y={ySelector}
                    strokeWidth={2}
                    stroke="#2AB0EA"
                />

                {/* 
                weird boolean operator JS thing
                https://blog.mariusschulz.com/2016/05/25/the-andand-and-operator-in-javascript
                
                in this context, 
                - if position can be coerced into false, return position
                - otherwise return <Line..etc/>
                */}
                {position && (
                    <LinePath
                        data={stock.slice(position.index)}
                        xScale={xScale}
                        yScale={yScale}
                        x={xSelector}
                        y={ySelector}
                        strokeWidth={1}
                        stroke="rgba(0,0,0,0.1)"
                    />
                )}

                

                {position && (
                    // <Line
                    //     from={{ x: position.x, y: 0 }}
                    //     to={{ x: position.x, y: height }}
                    //     strokeWidth={2}
                    //     stroke="#E2615F"
                    // />
                    <Marker
                        from={{ x: position.x, y: 0 }}
                        to={{ x: position.x, y: height }}
                        stroke={"#E2615F"}
                        label={markerLabel}
                        labelStroke={'none'}
                        labelDx={6}
                        labelDy={15}
                    />
                )}

                

                <Bar
                    x={0}
                    y={0}
                    width={width}
                    height={height}
                    fill="transparent"
                    rx={14}
                    data={stock}
                    onTouchStart={data => event =>
                        this.handleDrag({
                            event,
                            data,
                            xSelector,
                            xScale,
                            yScale,
                        })}
                    onTouchMove={data => event =>
                        this.handleDrag({
                            event,
                            data,
                            xSelector,
                            xScale,
                            yScale,
                        })}
                    onMouseMove={data => event =>
                        this.handleDrag({
                            event,
                            data,
                            xSelector,
                            xScale,
                            yScale,
                        })}
                    onTouchEnd={data => event =>
                        this.setState({
                            position: null
                        })}
                    onMouseLeave={data => event =>
                        this.setState({
                            position: null
                        })}
                />

            </svg>
        );
    }
}

export default lineChartVX;
