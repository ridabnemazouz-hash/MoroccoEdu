module.exports = {
  apps: [{
    name: 'moroccoedu-api',
    script: 'app.js',
    instances: 'max', // Use all available CPU cores
    exec_mode: 'cluster',
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      PORT: 5000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    // Logging
    log_file: 'logs/pm2-combined.log',
    out_file: 'logs/pm2-out.log',
    error_file: 'logs/pm2-error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    // Restart policy
    watch: false,
    ignore_watch: ['node_modules', 'logs', 'uploads'],
    max_restarts: 10,
    restart_delay: 4000,
    // Advanced
    merge_logs: true,
    autorestart: true,
    vizion: false
  }]
};
