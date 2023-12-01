import { Component } from '@angular/core';
import { PlanetListComponent } from './components';

const MODULES: any[] = [PlanetListComponent];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MODULES],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'star-wars-challenge';
}
