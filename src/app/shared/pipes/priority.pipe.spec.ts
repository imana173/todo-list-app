import { PriorityPipe } from './priority.pipe';

describe('PriorityPipe', () => {
  let pipe: PriorityPipe;

  beforeEach(() => {
    pipe = new PriorityPipe();
  });

  it('devrait être créé', () => {
    expect(pipe).toBeTruthy();
  });

  it('devrait traduire "low" en "Faible"', () => {
    expect(pipe.transform('low')).toBe('Faible');
  });

  it('devrait traduire "medium" en "Moyenne"', () => {
    expect(pipe.transform('medium')).toBe('Moyenne');
  });

  it('devrait traduire "high" en "Haute"', () => {
    expect(pipe.transform('high')).toBe('Haute');
  });

  it('devrait retourner la valeur d’origine pour une priorité inconnue', () => {
    expect(pipe.transform('unknown' as any)).toBe('unknown');
  });
});
