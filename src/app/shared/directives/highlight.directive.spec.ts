import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HighlightDirective } from './highlight.directive';

@Component({
  template: `<p [appHighlight]="'red'" [appHighlightDelay]="0">Test Highlight</p>`,
  standalone: true,
  imports: [HighlightDirective]
})
class TestHostComponent {}

describe('HighlightDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent] // on importe le composant de test
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should apply background color', (done) => {
    // On attend un peu car la directive utilise setTimeout()
    setTimeout(() => {
      const element: HTMLElement = fixture.nativeElement.querySelector('p');
      expect(element.style.backgroundColor).toBe('red');
      done();
    }, 10);
  });
});
