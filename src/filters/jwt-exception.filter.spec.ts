import { JwtExceptionFilter } from './jwt-exception.filter';

describe('JwtFilter', () => {
  it('should be defined', () => {
    expect(new JwtExceptionFilter()).toBeDefined();
  });
});
