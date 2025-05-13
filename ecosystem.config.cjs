// ecosystem.config.cjs
module.exports = {
  apps: [
    {
      name: "astro-app",
      script: "./dist/server/entry.mjs", // Entry point for Astro standalone server
      instances: 1,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
      },
      watch: false,
      autorestart: true,
      restart_delay: 5000,
      max_memory_restart: "300M",
    },
    {
      name: "discord-bot",
      script: "./src/discord-bot/index.js",
      instances: 1,
      exec_mode: "fork", // Bot usually runs as a single instance
      env: {
        NODE_ENV: "production",
      },
      watch: false,
      autorestart: true,
      restart_delay: 5000,
    },
  ],
};
