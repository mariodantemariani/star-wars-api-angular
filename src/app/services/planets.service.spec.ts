import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { PlanetsService } from './planets.service';

describe('PlanetsService', () => {
  let service: PlanetsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PlanetsService],
    });

    service = TestBed.inject(PlanetsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve planets by page number', () => {
    const mockResponse = { results: ['planet1', 'planet2'] };
    const page = 1;

    service.getPlanetsByPage(page).subscribe((response) => {
      expect(response.results.length).toBe(2);
      expect(response.results[0]).toBe('planet1');
      expect(response.results[1]).toBe('planet2');
    });

    const request = httpMock.expectOne(
      `https://swapi.dev/api/planets?page=${page}`
    );
    expect(request.request.method).toBe('GET');
    request.flush(mockResponse);
  });
});
