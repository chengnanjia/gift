const crypto = require('node:crypto');

const TOKEN_TTL_SECONDS = 8 * 60 * 60;
const MIN_PASSWORD_LENGTH = 12;
const MIN_SECRET_BYTES = 32;

function constantTimeEqual(candidate, expected) {
  if (typeof candidate !== 'string' || typeof expected !== 'string') {
    return false;
  }
  const candidateHash = crypto.createHash('sha256').update(candidate).digest();
  const expectedHash = crypto.createHash('sha256').update(expected).digest();
  return crypto.timingSafeEqual(candidateHash, expectedHash);
}

function signPayload(payload, secret) {
  return crypto.createHmac('sha256', secret).update(payload).digest('base64url');
}

function issueToken(username, secret, now = Date.now()) {
  const issuedAt = Math.floor(now / 1000);
  const payload = Buffer.from(JSON.stringify({
    sub: username,
    iat: issuedAt,
    exp: issuedAt + TOKEN_TTL_SECONDS
  })).toString('base64url');
  return `${payload}.${signPayload(payload, secret)}`;
}

function verifyToken(token, secret, now = Date.now()) {
  if (typeof token !== 'string' || token.length > 4096) {
    return null;
  }

  const parts = token.split('.');
  if (parts.length !== 2 || !/^[A-Za-z0-9_-]+$/.test(parts[0]) ||
      !/^[A-Za-z0-9_-]+$/.test(parts[1])) {
    return null;
  }

  const expectedSignature = Buffer.from(signPayload(parts[0], secret), 'base64url');
  const actualSignature = Buffer.from(parts[1], 'base64url');
  if (actualSignature.length !== expectedSignature.length ||
      !crypto.timingSafeEqual(actualSignature, expectedSignature)) {
    return null;
  }

  try {
    const claims = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8'));
    const nowSeconds = Math.floor(now / 1000);
    if (typeof claims.sub !== 'string' || !claims.sub ||
        !Number.isInteger(claims.iat) || !Number.isInteger(claims.exp) ||
        claims.iat > nowSeconds || claims.exp <= nowSeconds ||
        claims.exp - claims.iat !== TOKEN_TTL_SECONDS) {
      return null;
    }
    return claims;
  } catch {
    return null;
  }
}

function loadAuthConfig(env = process.env) {
  const username = env.AUTH_USERNAME;
  const password = env.AUTH_PASSWORD;
  const tokenSecret = env.AUTH_TOKEN_SECRET;
  const missing = [
    ['AUTH_USERNAME', username],
    ['AUTH_PASSWORD', password],
    ['AUTH_TOKEN_SECRET', tokenSecret]
  ].filter(([, value]) => typeof value !== 'string' || !value.trim());

  if (missing.length) {
    throw new Error(`缺少必需的环境变量: ${missing.map(([name]) => name).join(', ')}`);
  }
  if (password.startsWith('replace-with-') || tokenSecret.startsWith('replace-with-')) {
    throw new Error('请先将 .env.example 中的占位值替换为真实密码和随机签名密钥');
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`AUTH_PASSWORD 至少需要 ${MIN_PASSWORD_LENGTH} 个字符`);
  }
  if (Buffer.byteLength(tokenSecret, 'utf8') < MIN_SECRET_BYTES) {
    throw new Error(`AUTH_TOKEN_SECRET 至少需要 ${MIN_SECRET_BYTES} 字节`);
  }

  return { username, password, tokenSecret };
}

function requireAuth(authConfig) {
  return (req, res, next) => {
    const authorization = req.get('authorization') || '';
    const match = /^Bearer\s+(\S+)$/i.exec(authorization);
    const claims = match && verifyToken(match[1], authConfig.tokenSecret);
    if (!claims || claims.sub !== authConfig.username) {
      return res.status(401).json({
        code: 401,
        data: null,
        message: '登录已失效或未登录，请重新登录'
      });
    }

    req.auth = { username: claims.sub };
    return next();
  };
}

module.exports = {
  TOKEN_TTL_SECONDS,
  constantTimeEqual,
  issueToken,
  loadAuthConfig,
  requireAuth,
  verifyToken
};
