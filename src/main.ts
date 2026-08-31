// Human Kernel Theory Toolkit v0.1
// Landing page entry point

import './style.css';
import { LandingDemo } from './demo/landing';

const app = document.querySelector<HTMLDivElement>('#app');

if (app) {
  const demo = new LandingDemo();
  demo.init(app);
}
