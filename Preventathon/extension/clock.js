module.exports = (nodecg) => {
    nodecg.log.info('successful require');
    const currentTime = nodecg.Replicant('currentTime');
    setInterval(() => {
        const options = {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
        }

        const time = new Date().toLocaleString('en-US', options);
        currentTime.value = time;
        // console.log(clock.value);
    }, 1000);
}