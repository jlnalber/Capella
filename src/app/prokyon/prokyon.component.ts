import { Component } from '@angular/core';
import { MJ } from './services/drawer.service';
import { Tab } from './tab-group/tab-group.component';
import { FormulaTabComponent } from './formula-tab/formula-tab.component';
import { GeometryTabComponent } from './geometry-tab/geometry-tab.component';
import { SettingsTabComponent } from './settings-tab/settings-tab.component';
import { FormsModule } from '@angular/forms';
import { ProkyonCanvasComponent } from './canvas/prokyonCanvas.component';

declare const MathJax: MJ;

@Component({
  selector: 'app-prokyon',
  templateUrl: './prokyon.component.html',
  styleUrl: './prokyon.component.scss'
})
export class ProkyonComponent {

  renderMathToSvg(latex: string) {
    MathJax.Hub.Queue(['Typeset', MathJax.Hub, () => {
      const math = MathJax.Hub.getAllJax()[0];
      MathJax.Hub.Queue(['Text', math, latex]);
      MathJax.Hub.Queue(['Typeset', MathJax.Hub, () => {
        const svg = math.root.toSVG();
        this.displaySvg(svg);
      }]);
    }]);
  }

  displaySvg(svg: string) {
    console.log(svg)
    const svgContainer = document.getElementById('svg-container');
    if (svgContainer) {
      svgContainer.innerHTML = svg;
    }
  }

  tabs: Tab[] = [
    {
      title: 'Formeln',
      icon: 'functions',
      componentType: FormulaTabComponent
    },
    {
      title: 'Geometrie',
      icon: 'radio_button_unchecked',
      componentType: GeometryTabComponent
    },
    {
      title: 'Einstellungen',
      icon: 'settings',
      componentType: SettingsTabComponent
    }
  ]
}
