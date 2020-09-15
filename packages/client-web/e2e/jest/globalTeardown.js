module.exports = () => Promise.all(global.JEST_SERVERS.map((s) => s.destroy()))
