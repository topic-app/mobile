import updatePrefs from '@redux/actions/data/prefs';
import Store, { Persistor } from '@redux/store';
import { FULL_CLEAR } from '@ts/types';

const quickDevServer = () => {
  Persistor.pause();
  setTimeout(() => {
    updatePrefs({
      useDevServer: true,
    });
    Store.dispatch({ type: FULL_CLEAR, data: {} });
  }, 200);
};

export default quickDevServer;
