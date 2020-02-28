import { Component, ElementRef, Input, OnChanges, ViewChild, ViewEncapsulation,OnInit } from '@angular/core';
import { DataModel } from 'src/app/data/data.model';
import * as d3 from 'd3';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnChanges {
	@ViewChild('chart')
  	private chartContainer: ElementRef;

  	@Input()
  	data: DataModel[];

  	private margin = {top: 20, right: 20, bottom: 30, left: 40};
  	private width:number;
  	private height:number;
  	private x:any;
  	private y:any;
  	private svg:any;
  	private line: d3.Line<[string, number]>; //This is line definition

  	constructor() { 
     
   	}
  
   	ngOnChanges(): void {
    	if (!this.data) { return; }

    	//this.createChart();
    	this.buildSvg();
  		this.addXandYAxis();
  		this.drawLineAndPath();
  	}
  	

  	private buildSvg() {
  		const element = this.chartContainer.nativeElement;
  		const svg = d3.select(element).append('svg')
        .attr('width', element.offsetWidth)
        .attr('height', element.offsetHeight);
         // configure margins and width/height of the graph

   		this.width = element.offsetWidth - this.margin.left - this.margin.right;
        this.height = element.offsetHeight - this.margin.top - this.margin.bottom;
        //this.svg = d3.select('svg')
        //    .append('svg:g')
        //    .attr('transform', 'translate(' + //this.margin.left + ',' + this.margin.top + ')');
    }
    private addXandYAxis() {
         // range of data configuring
         this.x = d3.scaleTime().range([0, this.width]);
         this.y = d3.scaleLinear().range([this.height, 0]);
         this.x.domain(d3.extent(this.data, (d) => d.letter ));
         this.y.domain(d3.extent(this.data, (d) => d.frequency ));

        // Configure the Y Axis
        this.svg.append('g')
            .attr('transform', 'axis axis--x')
            .attr("transform", "translate(0," + this.height + ")")
            .call(d3.axisBottom(this.x));
        // Configure the Y Axis
        this.svg.append('g')
            .attr('class', 'axis axis--y')
            .call(d3.axisLeft(this.y))
            .append("text")
          	.attr("class", "axis-title")
          	.attr("transform", "rotate(-90)")
          	.attr("y", 6)
          	.attr("dy", ".71em")
          	.style("text-anchor", "end");
    }

    private drawLineAndPath() {
        this.line
            .x( (d: any) => this.x(d.letter) )
            .y( (d: any) => this.y(d.frequency) );
        // Configuring line path
        this.svg.append('path')
            .datum(this.data)
            .attr('class', 'line')
            .attr('d', this.line)
            .attr("fill", "none")
            .attr("stroke","steelblue");
    }

    onResize(){
   // 	this.createChart();
  		this.addXandYAxis();
  		this.drawLineAndPath();
    }

}
