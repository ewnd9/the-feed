import configureStore from '../../src/app/configure-store';
import createApi from '../../src/app/api';

export default function createReduxStore(port) {
  const api = createApi(`http://localhost:${port}`);
  const store = configureStore(undefined, api);

  return store;
}
