import { ThousandsPipe } from './thousands.pipe';

describe('ThousandsPipe', () => {
  let pipe: ThousandsPipe;

  beforeEach(() => {
    pipe = new ThousandsPipe();
  });

  it('should transform a valid number into a string with thousands separators', () => {
    const input = '1234567';
    const expectedOutput = '1.234.567';

    const transformedValue = pipe.transform(input);

    expect(transformedValue).toEqual(expectedOutput);
  });

  it('should return the same string if the input is a string with non-numeric characters', () => {
    const input = 'abc123';
    const expectedOutput = 'abc123';

    const transformedValue = pipe.transform(input);

    expect(transformedValue).toEqual(expectedOutput);
  });

  it('should return the same string if the input is not a valid number', () => {
    const pipe = new ThousandsPipe();
    const input = 'abc';
    const result = pipe.transform(input);
    expect(result).toEqual(input);
  });

  it('should return the same string if the input is an empty string', () => {
    const pipe = new ThousandsPipe();
    const input = '';
    const result = pipe.transform(input);
    expect(result).toEqual(input);
  });

  it('should handle decimal numbers correctly', () => {
    const input = '1234.5678';
    const expectedOutput = '1.234.5678';

    const transformedValue = pipe.transform(input);

    expect(transformedValue).toEqual(expectedOutput);
  });
});
