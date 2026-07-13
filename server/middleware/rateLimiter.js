const requestCounts = new Map();

/**
 * Basic in-memory rate limiter middleware
 */
export const rateLimiter = (options = { windowMs: 60 * 1000, max: 200 }) => {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const currentTime = Date.now();

    if (!requestCounts.has(ip)) {
      requestCounts.set(ip, { count: 1, firstRequest: currentTime });
      return next();
    }

    const record = requestCounts.get(ip);
    if (currentTime - record.firstRequest > options.windowMs) {
      record.count = 1;
      record.firstRequest = currentTime;
      requestCounts.set(ip, record);
      return next();
    }

    record.count += 1;
    if (record.count > options.max) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests from this IP, please try again shortly.'
      });
    }

    next();
  };
};
