const https = require('https');

module.exports = (nodecg) => {
  nodecg.log.info('successful require');
  const donationTotal = nodecg.Replicant('donationTotal');
  setInterval(() => {
    let url = 'https://tracker.preventathon.com/tracker/event/4?json';
    https.get(url,(res) => {
      let body = "";
      res.on("data", (chunk) => {
          body += chunk;
      });
      res.on("end", () => {
        try {
        //   nodecg.log.debug(`Got ${body} from tracker`);
          let json = JSON.parse(body);
          let eventTotal = json['agg']['amount'];
          let eventTotalString = JSON.stringify(eventTotal);
          if (eventTotalString !== JSON.stringify(eventTotal.value)) {
            // nodecg.log.info(`donationTotal = ${eventTotalString}`);
            donationTotal.value = eventTotal;
          }
        } catch (error) {
          console.error(error.message);
        };
      });
    }).on("error", (error) => {
      nodecg.log.error(error.message);
    });
  }, 5000);
};