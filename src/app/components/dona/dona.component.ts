import { Component, Input } from '@angular/core';
import { MultiDataSet, Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styleUrls: ['./dona.component.css']
})
export class DonaComponent 
{

  @Input('title') titulo: string = 'No hay título';
  @Input('labels') doughnutChartLabels: Label[] = ['No hay descripciones'];
  @Input('data') doughnutChartData: MultiDataSet = [ [350, 450, 100] ];

  public colors: Color[] = 
  [
    { backgroundColor: ['#6857E6', '#009FEE', '#F02059'] }
  ]

}
