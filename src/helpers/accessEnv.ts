const cache: { [key: string]: any } = {};

/*
    Fetches the key from process.env and caches it, so that next time when the same key is to be fetched
    again, the cache value is used. It takes sometime to fetch the value from .env. So it saves time.
*/
export default (key: string, defaultValue?: any) => {
  if (cache[key]) return cache[key];

  if (!(key in process.env)) {
    if (defaultValue) return defaultValue;
    throw new Error(`${key} not found in .env file.`);
  }

  cache[key] = process.env[key];

  return cache[key];
};
