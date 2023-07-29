const { ActivityType } = require("discord.js");

/**
 * @param {import('@src/structures').BotClient} client
 */
function updatePresence(client) {
  let message = client.config.PRESENCE.MESSAGE;
  let presenceMsg = client.config.PRESENCE
  const activitiesMsgs = [
		presenceMsg.MESSAGE, 
		presenceMsg.MESSAGE_2, 
		presenceMsg.MESSAGE_3, 
		presenceMsg.MESSAGE_4, 
		presenceMsg.MESSAGE_5,
	];
	let activitiesTypes = [
		presenceMsg.MESSAGE_TYPE,
		presenceMsg.MESSAGE_2_TYPE,
		presenceMsg.MESSAGE_3_TYPE,
		presenceMsg.MESSAGE_4_TYPE,
		presenceMsg.MESSAGE_5_TYPE,
	];
	let i = 0;

  const getType = (type) => {
    switch (type) {
      case "COMPETING":
        return ActivityType.Competing;

      case "LISTENING":
        return ActivityType.Listening;

      case "PLAYING":
        return ActivityType.Playing;

      case "WATCHING":
        return ActivityType.Watching;
				
			case "STREAMING":
				return ActivityType.Streaming;

			default:
				return ActivityType.Playing; 
    }
  };
	
  setInterval(() => {
		const message = activitiesMsgs[i % activitiesMsgs.length];
		const botActivity = getType(activitiesTypes[i % activitiesTypes.length]);
		const activityUrl = presenceMsg.STREAMING_URL;

		if (message.includes("{servers}")) {
    	message = message.replaceAll("{servers}", client.guilds.cache.size);
		}

  	if (message.includes("{members}")) {
    	const members = client.guilds.cache.map((g) => g.memberCount).reduce((partial_sum, a) => partial_sum + a, 0);
    	message = message.replaceAll("{members}", members);
  	}
		
		client.user.setPresence({
	    status: client.config.PRESENCE.STATUS, 
			activities: [
				{ 
					name: message,
	        type: botActivity,
					url: botActivity === botActivity.Streaming ? activityUrl : null,
	    	},
			],
  	});
		i++;
	}, 30000); // 5 minutes
}

module.exports = function handlePresence(client) {
  updatePresence(client);
  setInterval(() => updatePresence(client), 10 * 60 * 1000);
};
