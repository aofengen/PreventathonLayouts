const https = require('https');
const { setBreadcrumbCallback } = require('raven-js');

module.exports = (nodecg) => {
  nodecg.log.info('successful require of bids.js');
  const milestones = nodecg.Replicant('milestones');
  const incentives = nodecg.Replicant('incentives');
  const parentBids = nodecg.Replicant('parentBids');
  const childBids  = nodecg.Replicant('childBids');

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
            // nodecg.log.info(`milestone = ${milestones.value.amount}`);
          } else {
            for (let i = 0; i < json.count; i++) {
              // nodecg.log.info(`milestoneArray ${i} = ${milestoneArray[i]}`);
              milestoneArray.push(json.results[i]);
            }
            // nodecg.log.info(`total number of milestones = ${milestoneCountString}`);
            milestones.value  = milestoneArray;
            milestones.length = milestoneArray.length;
          }
        } catch (error) {
          console.error(error.message);
        };
      });
    }).on("error", (error) => {
      nodecg.log.error(error.message);
    });
  }, 30000);

  setInterval(() => {
    let url = 'https://tracker.preventathon.com/tracker/api/v2/bids/';
    https.get(url,(res) => {
      let body = "";
      res.on("data", (chunk) => {
          body += chunk;
      });
      res.on("end", () => {
        try {
        //   nodecg.log.debug(`Got ${body} from tracker`);
          let incentiveArray = new Array;
          let parentArray = new Array;
          let childArray = new Array
          let json = JSON.parse(body);
          if (json.count <= 0) {
            //do nothing
          } else {
            for (let i = 0; i < json.count; i++) {
              if (json.results[i].istarget == true) {
                if (json.results[i].parent != null) {
                  childArray.push(json.results[i]);
                } else {
                  incentiveArray.push(json.results[i]);
                }
              } else {
                parentArray.push(json.results[i]);
              }
            }
            incentives.value = incentiveArray;
            incentives.length = incentiveArray.length;
            parentBids.value = parentArray;
            parentBids.length = parentArray.length;
            childBids.value  = childArray;
            childBids.length = childArray.length;
            // nodecg.log.info(`incentives.value.name = ${incentives.value[0].name}, parentBids.value.name = ${parentBids.value[0].name}, childBids.value.name = ${childBids.value[0].name}`);
          }
          //TODO: handle incentives vs bidwars
        } catch (error) {
          console.error(error.message);
        };
      });
    }).on("error", (error) => {
      nodecg.log.error(error.message);
    });
  }, 30000);
};