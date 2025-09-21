const postgres = require('postgres');

function createClient(connectionString, options = {}) {
  const baseOptions = { prepare: false, ...options };
  const client = postgres(connectionString, baseOptions);

  const neonTag = (...args) => client(...args);

  Object.assign(neonTag, client);

  neonTag.end = async () => {
    if (typeof client.end === 'function') {
      await client.end();
    }
  };

  return neonTag;
}

function neon(connectionString, options = {}) {
  if (!connectionString || typeof connectionString !== 'string') {
    throw new Error('DATABASE_URL is required to create a Neon connection');
  }
  return createClient(connectionString, options);
}

const neonConfig = {
  fetchConnectionCache: true,
};

module.exports = {
  neon,
  neonConfig,
};

