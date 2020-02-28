import { Component, ElementRef, Input, OnChanges, ViewChild, ViewEncapsulation,OnInit } from '@angular/core';
import { DataModel } from 'src/app/data/data.model';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';

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

  	margin = {top: 20, right: 20, bottom: 30, left: 40};
  	width:number;
  	height:number;
  	x:any;
  	y:any;
  	svg:any;
  	line: d3Shape.Line<[number, number]>; //This is line definition

  	constructor() { 
     
   	}
  
   	ngOnChanges(): void {
    	if (!this.data) { return; }

    	//this.createChart();
    	this.buildSvg();
  		this.addXandYAxis();
  		this.drawLineAndPath();
  	}
  	//ngOnInit(): void {
  	//	this.buildSvg();
  	//	this.addXandYAxis();
  	//	this.drawLineAndPath();
  	//}

  	private buildSvg() {
  		const element = this.chartContainer.nativeElement;
  		const svg = d3.select(element).append('svg')
        .attr('width', element.offsetWidth)
        .attr('height', element.offsetHeight);
         // configure margins and width/height of the graph

   		this.width = element.offsetWidth - this.margin.left - this.margin.right;
        this.height = element.offsetHeight - this.margin.top - this.margin.bottom;
        //this.svg = d3.select('svg')
        //    .append('g')
        //    .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
    }
    private addXandYAxis() {
         // range of data configuring
         this.x = d3Scale.scaleTime().range([0, this.width]);
         this.y = d3Scale.scaleLinear().range([this.height, 0]);
         this.x.domain(d3Array.extent(this.data, (d) => d.letter ));
         this.y.domain(d3Array.extent(this.data, (d) => d.frequency ));

        // Configure the Y Axis
        this.svg.append('g')
            .attr('transform', 'axis axis--x')
            .call(d3Axis.axisBottom(this.x));
        // Configure the Y Axis
        this.svg.append('g')
            .attr('class', 'axis axis--y')
            .call(d3Axis.axisLeft(this.y));
    }

    private drawLineAndPath() {
        this.line = d3Shape.line()
            .x( (d: any) => this.x(d.letter) )
            .y( (d: any) => this.y(d.frequency) );
        // Configuring line path
        this.svg.append('path')
            .datum(this.data)
            .attr('class', 'line')
            .attr('d', this.line);
    }

    onResize(){
   // 	this.createChart();
  		this.addXandYAxis();
  		this.drawLineAndPath();
    }

}
