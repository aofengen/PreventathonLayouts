const https = require('https');

module.exports = (nodecg) => {
  nodecg.log.info('successful require of bids.js');
  const milestones = nodecg.Replicant('milestones');
  const incentives = nodecg.Replicant('incentives');
  const bidwards = nodecg.Replicant('bidwars');
  setInterval(() => {
    let url = 'https://tracker.preventathon.com/tracker/api/v2/milestones/';
    https.get(url,(res) => {
      let body = "";
      res.on("data", (chunk) => {
          body += chunk;
      });
      res.on("end", () => {
        try {
        //   nodecg.log.debug(`Got ${body} from tracker`);
          let milestoneArray = new Array;
          let json = JSON.parse(body);
          let milestoneCount = json['count'];
          let milestoneCountString = JSON.stringify(milestoneCount);
          if (milestoneCountString <= '0') {
            milestones.value = "";
          } else if (milestoneCountString <= '1') {            
            milestones.value = json.results[0];
            //nodecg.log.info(`milestone = ${milestones.value.amount}`);
          } else {
            for (let i = 0; i < json.count; i++) {
              nodecg.log.info(`milestoneArray ${i} = ${milestoneArray[i]}`);
              milestoneArray.push(json.results[i]);
            }
            nodecg.log.info(`total number of milestones = ${milestoneCountString}`);
            milestones.value = milestoneArray;
          }
        } catch (error) {
          console.error(error.message);
        };
      });
    }).on("error", (error) => {
      nodecg.log.error(error.message);
    });
  }, 30000);

//   setInterval(() => {
//     let url = 'https://tracker.preventathon.com/tracker/api/v2/bids/';
//     https.get(url,(res) => {
//       let body = "";
//       res.on("data", (chunk) => {
//           body += chunk;
//       });
//       res.on("end", () => {
//         try {
//         //   nodecg.log.debug(`Got ${body} from tracker`);
//           let json = JSON.parse(body);
//           //TODO: handle incentives vs bidwards
//         } catch (error) {
//           console.error(error.message);
//         };
//       });
//     }).on("error", (error) => {
//       nodecg.log.error(error.message);
//     });
//   }, 30000);
};