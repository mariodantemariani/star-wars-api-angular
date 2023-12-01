import {
  Component,
  ViewChild,
  OnInit,
  HostListener,
  ElementRef,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Planet } from '../../models';
import { ThousandsPipe, collectionOfDisplayedColumns } from '../../utils';
import { PlanetsService } from '../../services';

@Component({
  selector: 'app-planet-list',
  standalone: true,
  templateUrl: './planet-list.component.html',
  styleUrl: './planet-list.component.scss',
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    ThousandsPipe,
  ],
})
export class PlanetListComponent implements OnInit {
  currentPage: number = 0;
  dataSource: MatTableDataSource<Planet> = new MatTableDataSource<Planet>();
  displayedColumns: string[] = collectionOfDisplayedColumns;
  destroyed = new Subject<void>();
  isLoadingResults: boolean = true;
  isSmallScreen!: boolean;
  nextVisible: boolean = false;
  pageLength: number = 0;
  pageSize: number = 0;
  planets: Planet[] = [];
  previousPageIndex = 0;
  previousVisible: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('input') input!: ElementRef;

  constructor(
    private planetsService: PlanetsService,
    public breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit() {
    this.isLoadingResults = true;
    this.planetsService.getPlanets().subscribe((res: any) => {
      this.dataSource.data = res.results;
      this.planets = res.results;
      this.pageSize = res.results.length;
      this.pageLength = res.count;
      this.previousVisible = Boolean(res.previous);
      this.nextVisible = Boolean(res.next);
      this.currentPage = 1;
      this.isLoadingResults = false;
    });

    this.dataSource.paginator = this.paginator;

    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(takeUntil(this.destroyed))
      .subscribe((result) => {
        this.isSmallScreen =
          this.breakpointObserver.isMatched(Breakpoints.XSmall) ||
          this.breakpointObserver.isMatched(Breakpoints.Small);
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.dataSource.data = this.planets.filter(
      (planet) =>
        planet.name.toLowerCase().includes(filterValue) ||
        planet.climate.toLowerCase().includes(filterValue) ||
        planet.terrain.toLowerCase().includes(filterValue) ||
        planet.diameter.toLowerCase().includes(filterValue) ||
        planet.population.toLowerCase().includes(filterValue) ||
        planet.rotation_period.toLowerCase().includes(filterValue)
    );
  }

  clearFilter() {
    this.input.nativeElement.value = '';
  }

  loadData(page: number) {
    this.isLoadingResults = true;
    this.planetsService.getPlanetsByPage(page).subscribe((res: any) => {
      this.dataSource.data = res.results;
      this.planets = res.results;
      this.pageSize = res.results.length;
      this.pageLength = res.count;

      this.previousVisible = Boolean(res.previous);
      this.nextVisible = Boolean(res.next);

      this.isLoadingResults = false;
      if (!this.isSmallScreen) {
        this.paginator.pageIndex = this.currentPage - 1;
      }
    });
  }

  onNextClick() {
    this.currentPage = this.currentPage + 1;
    this.loadData(this.currentPage);
    this.clearFilter();
  }

  onPageChange(e: any) {
    let pageNo: number = e.pageIndex + 1;
    this.currentPage = pageNo;
    this.loadData(this.currentPage);
    this.clearFilter();
  }

  onPreviousClick() {
    this.currentPage = this.currentPage - 1;
    this.loadData(this.currentPage);
    this.clearFilter();
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    if (this.isSmallScreen) {
      this.loadData(this.currentPage);
      this.clearFilter();
    }
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
