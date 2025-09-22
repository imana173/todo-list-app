import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlight]', // utilisation : [appHighlight]="couleur"
  standalone: true
})
export class HighlightDirective implements OnInit {
  @Input() appHighlight = 'yellow'; // couleur par défaut
  @Input() appHighlightDelay = 0;   // délai en ms

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    setTimeout(() => {
      this.renderer.setStyle(
        this.el.nativeElement,
        'background-color',
        this.appHighlight
      );
    }, this.appHighlightDelay);
  }
}
