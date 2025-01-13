const request = require('supertest');
const path = require('path');

describe('Server Authentication', () => {
  let app;
  let server;
  
  beforeAll(async () => {
    // Temporarily disable cert verification for tests
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    process.env.NODE_ENV = 'test';
    
    // Import server after setting env vars
    const serverModule = require('../server');
    app = serverModule.app;
    server = serverModule.server;
    
    // Start server on a random port
    await new Promise((resolve) => {
      server.listen(0, () => {
        console.log(`Test server started on port ${server.address().port}`);
        resolve();
      });
    });
  });
  
  afterAll((done) => {
    // Re-enable cert verification
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1';
    server.close(done);
  });

  it('should have basic authentication enabled', async () => {
    const response = await request(server)
      .get('/')
      .expect(401); // Expect unauthorized status
    
    expect(response.headers['www-authenticate']).toBeDefined();
    expect(response.headers['www-authenticate']).toMatch(/^Basic realm="JAX UI"/);
  });
}); 