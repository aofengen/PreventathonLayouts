const https = require('https');

module.exports = (nodecg) => {
  nodecg.log.info('successful require');
  const nowPlaying = nodecg.Replicant('nowPlaying');
  setInterval(() => {
    let url = 'https://rainwave.cc/api4/info_all?sid=2';
    https.get(url,(res) => {
      let body = "";
      res.on("data", (chunk) => {
          body += chunk;
      });
      res.on("end", () => {
        try {
          //nodecg.log.debug(`Got ${body} from rainwave API`);
          let json = JSON.parse(body);
          let stationInfo = json['all_stations_info']['2'];
          let stationInfoString = JSON.stringify(stationInfo);
          if (stationInfoString !== JSON.stringify(nowPlaying.value)) {
            nodecg.log.info(`nowPlaying = ${stationInfoString}`);
            nowPlaying.value = stationInfo;
          }
        } catch (error) {
          console.error(error.message);
        };
      });
    }).on("error", (error) => {
      nodecg.log.error(error.message);
    });
  }, 500);
};