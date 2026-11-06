const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const test = require('node:test');
const {
  TOKEN_TTL_SECONDS,
  constantTimeEqual,
  issueToken,
  loadAuthConfig,
  requireAuth,
  verifyToken
} = require('../auth');

const createSecret = () => crypto.randomBytes(32).toString('hex');

test('issues a signed token that expires after the configured lifetime', () => {
  const secret = createSecret();
  const now = 1_800_000_000_000;
  const token = issueToken('admin', secret, now);

  assert.equal(verifyToken(token, secret, now).sub, 'admin');
  assert.equal(verifyToken(token, secret, now + TOKEN_TTL_SECONDS * 1000), null);
});

test('rejects malformed, modified, and differently signed tokens', () => {
  const secret = createSecret();
  const token = issueToken('admin', secret);
  const [payload, signature] = token.split('.');
  const replacement = signature[0] === 'A' ? 'B' : 'A';
  const modified = `${payload}.${replacement}${signature.slice(1)}`;

  assert.equal(verifyToken('not-a-token', secret), null);
  assert.equal(verifyToken(modified, secret), null);
  assert.equal(verifyToken(token, createSecret()), null);
});

test('rejects missing credentials, short passwords, and short signing keys', () => {
  assert.throws(() => loadAuthConfig({}), /AUTH_USERNAME/);
  assert.throws(() => loadAuthConfig({
    AUTH_USERNAME: 'admin',
    AUTH_PASSWORD: 'replace-with-a-unique-password-of-at-least-12-characters',
    AUTH_TOKEN_SECRET: 'replace-with-at-least-32-random-bytes'
  }), /占位值/);
  assert.throws(() => loadAuthConfig({
    AUTH_USERNAME: 'admin',
    AUTH_PASSWORD: 'short',
    AUTH_TOKEN_SECRET: createSecret()
  }), /AUTH_PASSWORD/);
  assert.throws(() => loadAuthConfig({
    AUTH_USERNAME: 'admin',
    AUTH_PASSWORD: 'long-enough-password',
    AUTH_TOKEN_SECRET: 'too-short'
  }), /AUTH_TOKEN_SECRET/);
});

test('compares credentials and protects routes with a valid bearer token', () => {
  const authConfig = {
    username: 'admin',
    password: 'a-long-test-password',
    tokenSecret: createSecret()
  };
  assert.equal(constantTimeEqual(authConfig.password, authConfig.password), true);
  assert.equal(constantTimeEqual('wrong', authConfig.password), false);

  const middleware = requireAuth(authConfig);
  const token = issueToken(authConfig.username, authConfig.tokenSecret);
  let nextCalled = false;
  middleware({
    get: () => `Bearer ${token}`
  }, {
    status() { throw new Error('valid token was rejected'); },
    json() { throw new Error('valid token was rejected'); }
  }, () => { nextCalled = true; });
  assert.equal(nextCalled, true);

  let statusCode;
  let responseBody;
  middleware({
    get: () => ''
  }, {
    status(code) { statusCode = code; return this; },
    json(body) { responseBody = body; }
  }, () => { throw new Error('missing token was accepted'); });
  assert.equal(statusCode, 401);
  assert.equal(responseBody.code, 401);
});
