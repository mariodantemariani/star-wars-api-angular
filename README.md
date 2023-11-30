# Star-wars

This project aims to create a simple web application that fetches data from an API and displays it in an organized manner. The chosen API is the Star Wars API (SWAPI), which provides various resources related to the Star Wars universe.

## Technologies Used

- Angular 17.0.0.
- HTML.
- SCSS.
- Typescript.
- Jest (testing).

## API Integration

For this project, we will be using the SWAPI API to retrieve data. The API documentation can be found here. You are free to choose any data from the API, but the "planet" resource is suggested for this task

## Project Structure

The projects follows the Angular best practices to development.

## Getting Started

To get started with this project, follow the steps below:

- Clone the repository: git clone `https://github.com/mariodantemariani/star-wars-api-angular`.
- Install the required dependencies: `npm install` or `pnpm install`.
- run the development server: `ng serve` (the site will open on `http://localhost:4200/`).

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `npm run test:watch` to execute the unit tests. I suggest to use `npm run test:coverage` to have a better visualization of the test cases. For this project, I created the test using `Jest` instead of `karma` (`jasmine-karma` will be deprecated soon).
