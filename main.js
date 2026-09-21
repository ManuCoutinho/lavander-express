import { initMenu } from './src/menu.js';
import { initHeader } from './src/header.js';
import { initReveal } from './src/reveal.js';
import { initCounters } from './src/counters.js';
import { initScrollSpy } from './src/scrollspy.js';
import { initForm } from './src/form.js';
import { initYear } from './src/year.js';

export function bootstrap(doc = document) {
  initMenu(doc);
  initHeader(doc);
  initReveal(doc);
  initCounters(doc);
  initScrollSpy(doc);
  initForm(doc);
  initYear(doc);
}

bootstrap();
