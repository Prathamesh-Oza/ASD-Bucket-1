const cache = new Map();
let TTL = 60 * 1000;

function normalizeKey(url) {
  return url.replace(/\/$/, '') || '/';
}

function cacheMiddleware(req, res, next) {
  if (req.method !== 'GET') {
    return next();
  }

  const key = normalizeKey(req.originalUrl || req.url);
  const cachedEntry = cache.get(key);
  const now = Date.now();

  if (cachedEntry) {
    const age = now - cachedEntry.createdAt;

    if (age < TTL) {
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('X-Cache-Created-At', new Date(cachedEntry.createdAt).toISOString());
      return res.json(cachedEntry.data);
    }

    cache.delete(key);
  }

  res.setHeader('X-Cache', 'MISS');

  const originalJson = res.json.bind(res);
  res.json = (body) => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      cache.set(key, {
        data: body,
        createdAt: Date.now(),
      });
    }
    return originalJson(body);
  };

  next();
}

function invalidateCache() {
  cache.clear();
}

function invalidateCacheMiddleware(req, res, next) {
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      invalidateCache();
    }
    return originalJson(body);
  };

  res.on('finish', () => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      invalidateCache();
    }
  });

  next();
}

function setTTL(ms) {
  TTL = ms;
}

function getTTL() {
  return TTL;
}

function getCacheStore() {
  return cache;
}

module.exports = {
  cacheMiddleware,
  invalidateCacheMiddleware,
  invalidateCache,
  clearCache: invalidateCache,
  setTTL,
  getTTL,
  getCacheStore,



  
};
