import {
  setupWorker
} from 'msw/browser'
import {
  handlers
} from './handlers';

const worker = new setupWorker();
worker.use(...handlers)
// worker.events.on('request:start', ({
//   request
// }) => {
//   console.log('Outgoing:', request.method, request.url)
// })
export {
  worker
};
