import {
    animation,
    transition, animate, style, state
  } from '@angular/animations';
  
  export const transAnimation = animation([
      state('open', style({
        backgroundColor : '{{ color_inactive }}'
      })),
      state('opening', style({
        backgroundColor : '{{ color_inactive }}',
      })),
      transition('opening => open', [
        animate('1s')
      ]),
]);