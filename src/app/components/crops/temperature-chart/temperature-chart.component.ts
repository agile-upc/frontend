import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-temperature-chart',
  template: '<svg #chartSvg></svg>',
  styles: [`
    :host {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: auto;
    }
  `]
})
export class TemperatureChartComponent implements OnInit, OnChanges {
  @Input() value: number = 0;
  @Input() threshold: number = 0;
  @Input() size: number = 100;
  @Input() strokeWidth: number = 8;

  @ViewChild('chartSvg', { static: true }) private chartContainer!: ElementRef;

  private svg: any;
  private arcGenerator: d3.Arc<any, d3.DefaultArcObject>;
  private pathBackground: any;
  private pathForeground: any;
  private textValue: any;

  constructor() {}

  ngOnInit(): void {
    this.createChart();
    this.updateChart(this.value);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] && !changes['value'].firstChange) {
      this.updateChart(changes['value'].currentValue);
    }
  }

  private createChart(): void {
    const element = this.chartContainer.nativeElement;

    this.arcGenerator = d3.arc<any, d3.DefaultArcObject>()
      .innerRadius(this.size / 2 - this.strokeWidth)
      .outerRadius(this.size / 2)
      .startAngle(0);

    this.svg = d3.select(element)
      .attr('width', this.size)
      .attr('height', this.size)
      .attr(
        'viewBox',
        `-${this.strokeWidth} -${this.strokeWidth} ${this.size + this.strokeWidth * 2} ${this.size + this.strokeWidth * 2}`
      )
      .append('g')
      .attr('transform', `translate(${this.size / 2}, ${this.size / 2})`);

    this.pathBackground = this.svg.append('path')
      .datum({ endAngle: 2 * Math.PI })
      .style('fill', 'none')
      .style('stroke', '#e6e6e6')
      .style('stroke-width', this.strokeWidth)
      .attr('d', this.arcGenerator as any);

    this.pathForeground = this.svg.append('path')
      .datum({ endAngle: 0 })
      .style('fill', 'none')
      .style('stroke-width', this.strokeWidth)
      .attr('d', this.arcGenerator as any)
      .style('stroke-linecap', 'round');

    this.textValue = this.svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .style('font-size', this.size * 0.15 + 'px')
      .style('font-weight', '600')
      .style('fill', 'currentColor')
      .text('0°C');
  }

  private updateChart(newValue: number): void {
    const angleScale = d3.scaleLinear()
      .domain([0, this.threshold + 1])
      .range([0, 2 * Math.PI]);

    const newAngle = angleScale(newValue);

    const color = newValue > this.threshold ? '#f44336' : '#4caf50';
    this.pathForeground.style('stroke', color);

    this.pathForeground.transition()
      .duration(750)
      .call((transition: any) => {
        transition.tween('arc', () => {
          const interpolate = d3.interpolate(
            (this.pathForeground.datum() as any).endAngle,
            newAngle
          );
          return (t: number) => {
            (this.pathForeground.datum() as any).endAngle = interpolate(t);
            this.pathForeground.attr('d', this.arcGenerator as any);
            this.pathForeground.attr('transform', 'rotate(-90)');
          };
        });
      });

    this.textValue.transition()
      .duration(750)
      .tween('text', () => {
        const i = d3.interpolate(parseFloat(this.textValue.text()), newValue);
        return (t: number) => {
          this.textValue.text(`${Math.round(i(t))}°C`);
        };
      });
  }
}
