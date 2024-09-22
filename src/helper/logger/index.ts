// import loglevel from "loglevel";
// const logger = loglevel.getLogger("logger");
// logger.setLevel("info"); // levels: https://github.com/pimterry/loglevel#documentation

// export default logger;

import winston, { format, transports } from "winston";
import WinstonCloudWatch from "winston-cloudwatch";
import httpContext from "express-http-context";
const { combine, timestamp, json, colorize } = format;

const logger = winston.createLogger({
  format: combine(timestamp(), json(), colorize()),
  transports: [new transports.Console()],
});

if (
  process.env.NODE_ENV !== "local" &&
  process.env.AWS_ACCESS_ID &&
  process.env.AWS_ACCESS_SECRET
) {
  const cloudwatchConfig: WinstonCloudWatch.CloudwatchTransportOptions = {
    awsOptions: {
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_ID as string,
        secretAccessKey: process.env.AWS_ACCESS_SECRET as string,
      },
      region: process.env.AWS_CLOUD_REGION as string,
    },
    logGroupName: process.env.CLOUDWATCH_LOG_GROUP,
    logStreamName: `${process.env.CLOUDWATCH_LOG_GROUP}-${process.env.NODE_ENV}`,
    messageFormatter: ({ level, message, additionalInfo }) => {
      let requestId, _additionalInfo;
      try {
        _additionalInfo = JSON.stringify(additionalInfo);
        requestId = httpContext.get("requestId");
      } catch (error) {
        _additionalInfo = additionalInfo;
      }
      return `[${requestId}] - [${level}] : ${message} \n
        Additional Info: ${_additionalInfo}`;
    },
  };
  logger.add(new WinstonCloudWatch(cloudwatchConfig));
}

export default logger;
