module.exports = {
    apps: [{
        name: 'Iplan',
        script: 'server.js',
        instance: 'max',
        autorestart: true,
        restart_delay: 3000,
        watch: true,
        env: {
            NODE_ENV: 'development'
        },
        env_production: {
            NODE_ENV: 'production'
        }
    }],
};
