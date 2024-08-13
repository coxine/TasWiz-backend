import { Bootstrap } from '@midwayjs/bootstrap';

Bootstrap.configure({
  imports: require('./dist/index'),
  moduleDetector: false,
}).run();
