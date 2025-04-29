import {
  setupWorker
} from 'msw/browser'
import {
  handlers
} from './handlers';

const worker = new setupWorker();
worker.use(...handlers)
// worker.events.on('request:start', ({
//   requestId,
//   request
// }) => {
//   console.log('Outgoing:', request.method, request.url, requestId)
//   return false
// })
export {
  worker
};
