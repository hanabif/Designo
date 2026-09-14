import { HealthController } from '../src/common/health.controller.js';

describe('HealthController', () => {
  it('returns the service status', () => {
    expect(new HealthController().check()).toEqual({ status: 'ok' });
  });
});
