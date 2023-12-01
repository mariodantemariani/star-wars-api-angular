import { TestBed } from '@angular/core/testing';

import { PlanetListComponent } from './planet-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { Subject, of } from 'rxjs';
import { PlanetsService } from '../../services';
import { Planet } from '../../models';
import { BreakpointObserver } from '@angular/cdk/layout';
describe('PlanetsComponent', () => {
  let component: PlanetListComponent;
  let planetsService: PlanetsService;
  let paginator: MatPaginator;
  let breakpointObserver: BreakpointObserver;
  let destroyedSubject: Subject<void>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        MatListModule,
        MatTableModule,
        MatPaginatorModule,
        FormsModule,
        MatInputModule,
        MatButtonModule,
        PlanetListComponent,
      ],
      providers: [PlanetsService],
    }).compileComponents();

    component = TestBed.createComponent(PlanetListComponent).componentInstance;
    planetsService = TestBed.inject(PlanetsService);
    breakpointObserver = TestBed.inject(BreakpointObserver);
    destroyedSubject = component.destroyed;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set properties correctly when getPlanets() emits a result', () => {
      // Create a mock response
      const mockResponse = {
        results: [
          { name: 'Planet 1' },
          { name: 'Planet 2' },
          { name: 'Planet 3' },
        ],
        count: 3,
        previous: 'previous-url',
        next: 'next-url',
      };

      // Mock the getPlanets method to return the mock response
      jest
        .spyOn(planetsService, 'getPlanets')
        .mockReturnValue(of(mockResponse));

      // Call the method
      component.ngOnInit();

      // Expect the properties to be set correctly
      expect(component.dataSource.data).toEqual(mockResponse.results);
      expect(component.planets).toEqual(mockResponse.results);
      expect(component.pageSize).toBe(mockResponse.results.length);
      expect(component.pageLength).toBe(mockResponse.count);
      expect(component.previousVisible).toBeTruthy();
      expect(component.nextVisible).toBeTruthy();
      expect(component.currentPage).toBe(1);
      expect(component.isLoadingResults).toBeFalsy();
    });

    it('should set the dataSource.paginator property', () => {
      // Mock the paginator property
      component.paginator = {} as MatPaginator;
      // Call the method
      component.ngOnInit();
      // Expect the dataSource.paginator property to be set
      expect(component.dataSource.paginator).toBe(component.paginator);
    });

    it('should update to true the isSmallScreen property based on the breakpointObserver subscription', () => {
      // Mock the isMatched method
      jest.spyOn(breakpointObserver, 'isMatched').mockReturnValue(true);

      // Call the observable subscription manually
      component.ngOnInit();

      // Expect the isSmallScreen property to be updated correctly
      expect(component.isSmallScreen).toBeTruthy();
    });

    it('should update  to false the isSmallScreen property based on the breakpointObserver subscription', () => {
      // Mock the isMatched method
      jest.spyOn(breakpointObserver, 'isMatched').mockReturnValue(false);

      // Call the observable subscription manually
      component.ngOnInit();

      // Expect the isSmallScreen property to be updated correctly
      expect(component.isSmallScreen).toBeFalsy();
    });

    it('should load data using OnInit and dont have previous and next pages', () => {
      //create a mock response
      const mockResponse = {
        results: [{ name: 'Planet 1' }, { name: 'Planet 2' }],
        count: 2,
        previous: null,
        next: null,
      };

      //mock getPlanets
      jest
        .spyOn(planetsService, 'getPlanets')
        .mockReturnValue(of(mockResponse));

      //call the method
      component.ngOnInit();

      //expect the properties to be set correctly
      expect(component.dataSource.data).toEqual(mockResponse.results);
      expect(component.planets).toEqual(mockResponse.results);
      expect(component.pageSize).toEqual(mockResponse.results.length);
      expect(component.pageLength).toEqual(mockResponse.count);
      expect(component.previousVisible).toBeFalsy();
      expect(component.nextVisible).toBeFalsy();
      expect(component.currentPage).toBe(1);
      expect(component.isLoadingResults).toBeFalsy();
    });
    it('should load data using OnInit and dont have previous page', () => {
      //create a mock response
      const mockResponse = {
        results: [{ name: 'Planet 1' }, { name: 'Planet 2' }],
        count: 2,
        previous: 'previous-url',
        next: null,
      };

      //mock getPlanets
      jest
        .spyOn(planetsService, 'getPlanets')
        .mockReturnValue(of(mockResponse));

      //call the method
      component.ngOnInit();

      //expect the properties to be set correctly
      expect(component.dataSource.data).toEqual(mockResponse.results);
      expect(component.planets).toEqual(mockResponse.results);
      expect(component.pageSize).toEqual(mockResponse.results.length);
      expect(component.pageLength).toEqual(mockResponse.count);
      expect(component.previousVisible).toEqual(true);
      expect(component.nextVisible).toBeFalsy();
      expect(component.currentPage).toBe(1);
      expect(component.isLoadingResults).toBeFalsy();
    });

    it('should load data using OnInit and dont have next page', () => {
      //mock response
      const mockResponse = {
        results: [{ name: 'Planet 1' }, { name: 'Planet 2' }],
        count: 2,
        previous: null,
        next: 'next-url',
      };

      //mock getPlanets
      jest
        .spyOn(planetsService, 'getPlanets')
        .mockReturnValue(of(mockResponse));

      //call the method
      component.ngOnInit();

      //expect the properties to be set correctly
      expect(component.dataSource.data).toEqual(mockResponse.results);
      expect(component.planets).toEqual(mockResponse.results);
      expect(component.pageSize).toEqual(mockResponse.results.length);
      expect(component.pageLength).toEqual(mockResponse.count);
      expect(component.previousVisible).toBeFalsy();
      expect(component.nextVisible).toBeTruthy();
      expect(component.currentPage).toBe(1);
      expect(component.isLoadingResults).toBeFalsy();
    });
  });

  describe('applyFilter', () => {
    it('should filter the dataSource data correctly: One result', () => {
      // mock data
      const planet: Planet = {
        name: 'Planet 1',
        climate: 'Climate 1',
        terrain: 'Terrain 1',
        diameter: '100',
        population: '1000',
        rotation_period: '24',
      };

      const planet2: Planet = {
        name: 'Planet 2',
        climate: 'Climate 2',
        terrain: 'Terrain 2',
        diameter: '200',
        population: '2000',
        rotation_period: '48',
      };

      const planet3: Planet = {
        name: 'Planet 3',
        climate: 'Climate 3',
        terrain: 'Terrain 3',
        diameter: '300',
        population: '3000',
        rotation_period: '72',
      };

      const planets = [planet, planet2, planet3];

      component.planets = planets;
      component.dataSource.data = planets;

      // Set up the event object
      const event = {
        target: {
          value: 'planet 1',
        },
      } as any;

      // Call the method
      component.applyFilter(event);

      // Expect dataSource.data to be filtered correctly
      expect(component.dataSource.data).toEqual([planet]);
    });

    it('should filter the dataSource data correctly: Multiple results', () => {
      //mock planets
      const planet: Planet = {
        name: 'Planet 1',
        climate: 'Climate 1',
        terrain: 'Terrain 1',
        diameter: '100',
        population: '1000',
        rotation_period: '24',
      };

      const planet2: Planet = {
        name: 'Planet 2',
        climate: 'Climate 2',
        terrain: 'Terrain 2',
        diameter: '200',
        population: '2000',
        rotation_period: '48',
      };

      const planet3: Planet = {
        name: 'Planet 3',
        climate: 'Climate 3',
        terrain: 'Terrain 3',
        diameter: '300',
        population: '3000',
        rotation_period: '72',
      };

      const planets = [planet, planet2, planet3];

      component.planets = planets;
      component.dataSource.data = planets;

      // Set up the event object
      const event = {
        target: {
          value: 'planet',
        },
      } as any;

      // Call the method
      component.applyFilter(event);

      // Expect dataSource.data to be filtered correctly
      expect(component.dataSource.data).toEqual(planets);
    });

    it('should return empty result if no match is found', () => {
      //mock event
      const event = { target: { value: 'nonexistent' } } as any;
      //mock expected data
      const expectedData: Planet[] = [];
      // mock dataSource
      const planet: Planet = {
        name: 'Planet 1',
        climate: 'Climate 1',
        terrain: 'Terrain 1',
        diameter: '100',
        population: '1000',
        rotation_period: '24',
      };

      const planet2: Planet = {
        name: 'Planet 2',
        climate: 'Climate 2',
        terrain: 'Terrain 2',
        diameter: '200',
        population: '2000',
        rotation_period: '48',
      };

      const planet3: Planet = {
        name: 'Planet 3',
        climate: 'Climate 3',
        terrain: 'Terrain 3',
        diameter: '300',
        population: '3000',
        rotation_period: '72',
      };

      const planets = [planet, planet2, planet3];

      component.planets = planets;
      //call the method
      component.applyFilter(event);
      //expect dataSource.data to be filtered correctly
      expect(component.dataSource.data).toEqual(expectedData);
    });
  });

  describe('onPageChange', () => {
    it('should set currentPage property to pageIndex null', () => {
      // Mock the loadData method
      component.loadData = jest.fn();
      // Mock the clearFilter method
      component.clearFilter = jest.fn();
      //mock event
      const event = { pageIndex: null };
      //call the method
      component.onPageChange(event);
      expect(component.currentPage).toBe(1);
    });

    it('should set currentPage property to pageIndex non-null plus one', () => {
      // Mock the loadData method
      component.loadData = jest.fn();
      // Mock the clearFilter method
      component.clearFilter = jest.fn();
      const event = { pageIndex: 2 };
      component.onPageChange(event);
      expect(component.currentPage).toBe(3);
    });

    it('should set currentPage, call loadData, and call clearFilter', () => {
      // Mock the loadData method
      component.loadData = jest.fn();
      // Mock the clearFilter method
      component.clearFilter = jest.fn();

      // Set up the event object
      const event = { pageIndex: 5 };

      // Call onPageChange
      component.onPageChange(event);

      // Expect currentPage to be updated
      expect(component.currentPage).toBe(6);

      // Expect loadData to be called with the updated currentPage
      expect(component.loadData).toHaveBeenCalledWith(6);

      // Expect clearFilter to be called
      expect(component.clearFilter).toHaveBeenCalled();
    });
  });

  describe('onNextClick', () => {
    it('should set the currentPage property to the next page with currentPage 0', () => {
      // Mock the loadData method
      component.loadData = jest.fn();

      // Mock the clearFilter method
      component.clearFilter = jest.fn();

      // Set the currentPage to a specific value
      component.currentPage = 0;

      // Call onNextClick
      component.onNextClick();

      // Expect the currentPage to be updated
      expect(component.currentPage).toBe(1);

      // Expect loadData to be called with the updated currentPage
      expect(component.loadData).toHaveBeenCalledWith(1);
    });

    it('should set the currentPage property to the next page with currentPage different than 0', () => {
      // Mock the loadData method
      component.loadData = jest.fn();

      // Mock the clearFilter method
      component.clearFilter = jest.fn();

      // Set the currentPage to a specific value
      component.currentPage = 3;

      // Call onNextClick
      component.onNextClick();

      // Expect the currentPage to be updated
      expect(component.currentPage).toBe(4);

      // Expect loadData to be called with the updated currentPage
      expect(component.loadData).toHaveBeenCalledWith(4);
    });
    it('should call loadData function with incremented currentPage: next Page case', () => {
      //creat the mock current page
      component.currentPage = 1;

      //call the method
      component.loadData = jest.fn();
      component.clearFilter = jest.fn();
      component.onNextClick();

      //expected current page
      expect(component.loadData).toHaveBeenCalledWith(2);
    });
  });

  describe('onPreviousClick', () => {
    it('should set the currentPage property to previous page with currentPage different 0', () => {
      // Mock the loadData method
      component.loadData = jest.fn();
      component.clearFilter = jest.fn();

      // Set the currentPage to a specific value
      component.currentPage = 1;

      // Call onPreviousClick
      component.onPreviousClick();

      // Expect the currentPage to be updated
      expect(component.currentPage).toBe(0);

      // Expect clearFilter to be called
      expect(component.clearFilter).toHaveBeenCalled();

      // Expect loadData to be called with the updated currentPage
      expect(component.loadData).toHaveBeenCalledWith(0);
    });
    it('should set the currentPage property to previous page with currentPage different than 0', () => {
      // Mock the loadData method
      component.loadData = jest.fn();
      component.clearFilter = jest.fn();

      // Set the currentPage to a specific value
      component.currentPage = 3;

      // Call onPreviousClick
      component.onPreviousClick();

      // Expect the currentPage to be updated
      expect(component.currentPage).toBe(2);

      // Expect clearFilter to be called
      expect(component.clearFilter).toHaveBeenCalled();

      // Expect loadData to be called with the updated currentPage
      expect(component.loadData).toHaveBeenCalledWith(2);
    });

    it('should call loadData function with incremented currentPage:Previous Page case', () => {
      //create a mock current page
      component.currentPage = 2;
      //call the method
      component.loadData = jest.fn();
      component.clearFilter = jest.fn();
      component.onPreviousClick();
      //expected result
      expect(component.loadData).toHaveBeenCalledWith(1);
    });
  });

  describe('onWindowResize', () => {
    it('should call loadData and clearFilter when isSmallScreen is true', () => {
      // Mock the loadData method
      component.loadData = jest.fn();

      // Mock the clearFilter method
      component.clearFilter = jest.fn();

      // Set isSmallScreen to true
      component.isSmallScreen = true;

      // Call onWindowResize
      component.onWindowResize();

      // Expect loadData and clearFilter to be called
      expect(component.loadData).toHaveBeenCalled();
      expect(component.clearFilter).toHaveBeenCalled();
    });

    it('should not call loadData or clearFilter when isSmallScreen is false', () => {
      // Mock the loadData method
      component.loadData = jest.fn();

      // Mock the clearFilter method
      component.clearFilter = jest.fn();

      // Set isSmallScreen to false
      component.isSmallScreen = false;

      // Call onWindowResize
      component.onWindowResize();

      // Expect loadData and clearFilter not to be called
      expect(component.loadData).not.toHaveBeenCalled();
      expect(component.clearFilter).not.toHaveBeenCalled();
    });
  });

  describe('loadData', () => {
    it('should load data and set the necessary properties', () => {
      // Create a mock response
      const mockResponse = {
        results: [{ name: 'Planet 1' }, { name: 'Planet 2' }],
        count: 2,
        previous: null,
        next: null,
      };

      // Mock the getPlanets method to return the mock response
      jest
        .spyOn(planetsService, 'getPlanetsByPage')
        .mockReturnValue(of(mockResponse));

      // Call the method
      component.loadData(1);

      // Expect the properties to be set correctly
      expect(component.dataSource.data).toEqual(mockResponse.results);
      expect(component.planets).toEqual(mockResponse.results);
      expect(component.pageSize).toEqual(mockResponse.results.length);
      expect(component.pageLength).toEqual(mockResponse.count);
      expect(component.previousVisible).toBeFalsy();
      expect(component.nextVisible).toBeFalsy();
      expect(component.isLoadingResults).toBeFalsy();
    });
  });

  describe('clearFilter', () => {
    it('should clear the value of the input element', () => {
      const inputElement = document.createElement('input');
      component.input = {
        nativeElement: inputElement,
      };

      component.clearFilter();

      expect(inputElement.value).toBe('');
    });
  });
});
