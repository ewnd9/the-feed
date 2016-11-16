import config from '../config';

let opbeat;

if (process.env.NODE_ENV === 'production' && config.opbeat) {
  opbeat = require('opbeat').start({
    organizationId: config.opbeat.organizationId,
    appId: config.opbeat.appId,
    secretToken: config.opbeat.secretToken
  });

  console.log(config.opbeat);
}

export function captureError(err) {
  console.error(err.stack || err);

  if (opbeat) {
    opbeat.captureError(err);
  }
}
