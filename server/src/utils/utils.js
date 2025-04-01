const TIME_CONSTANTS = {
  MORE_THAN_63_DAYS: {
    TIME_VALUE: 63 * 24 * 60 * 60,
    VALID_PERIOD: 3600, 
    WARNING_MESSAGE: "Period adjusted to {period} seconds (1 hour) since the requested time range is greater than 63 days. For time ranges greater than 63 days, the period must be a multiple of 3600 seconds (1 hour) due to CloudWatch limits.",
  },
  BETWEEN_15_DAYS_AND_63_DAYS: {
    TIME_VALUE: 15 * 24 * 60 * 60,
    VALID_PERIOD: 300, 
    WARNING_MESSAGE: "Period adjusted to {period} seconds (5 minutes) since the requested time range is between 15 and 63 days. For time ranges between 15 and 63 days, the period must be a multiple of 300 seconds (5 minutes) due to CloudWatch limits.",
  },
  BETWEEN_3_HOURS_AND_15_DAYS: {
    TIME_VALUE: 3 * 60 * 60,
    VALID_PERIOD: 60, 
    WARNING_MESSAGE: "Period adjusted to {period} seconds (1 minute) since the requested time range is between 3 hours and 15 days. For time ranges between 3 hours and 15 days, the period must be a multiple of 60 seconds (1 minute) due to CloudWatch limits.",
  },
  LESS_THAN_3_HOURS: {
    TIME_VALUE: 3 * 60 * 60,
    VALID_PERIOD: 60, 
    VALID_PERIODS: [1, 5, 10, 20, 30], 
    WARNING_MESSAGE: "Period adjusted to {period} seconds since the requested time range is less than 3 hours. For time ranges less than 3 hours, the period can be 1, 5, 10, 30, 60 seconds, or any multiple of 60 seconds due to CloudWatch limits.",
  }
};

const TIME_UNITS = {
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
};

const convertTimePeriodToMs = (timePeriod) => {
  const unitMap = {
    m: TIME_UNITS.MINUTE, 
    h: TIME_UNITS.HOUR, 
    d: TIME_UNITS.DAY, 
    w: TIME_UNITS.WEEK, 
};
  const match = timePeriod.match(/^(\d+)([mhdw])$/);
  if (!match) throw new Error("Invalid timePeriod format");

  const [, value, unit] = match;
  return parseInt(value, 10) * unitMap[unit];
};

const getClosestValidPeriod = (period, validPeriod) => {
  if (period % validPeriod === 0) {
    return period; 
  }
  const closest = Math.round(period / validPeriod) * validPeriod;
  return closest;
};

const validateAndAdjustPeriod = (userPeriod, timeDiff) => {
  let warningMessage = null;
  let period = userPeriod;

  if (timeDiff > TIME_CONSTANTS.MORE_THAN_63_DAYS.TIME_VALUE && userPeriod % TIME_CONSTANTS.MORE_THAN_63_DAYS.VALID_PERIOD !== 0) {
      period = getClosestValidPeriod(userPeriod, TIME_CONSTANTS.MORE_THAN_63_DAYS.VALID_PERIOD); 
      warningMessage = TIME_CONSTANTS.MORE_THAN_63_DAYS.WARNING_MESSAGE.replace("{period}", period);

  } else if (timeDiff > TIME_CONSTANTS.BETWEEN_15_DAYS_AND_63_DAYS.TIME_VALUE && userPeriod % TIME_CONSTANTS.BETWEEN_15_DAYS_AND_63_DAYS.VALID_PERIOD !== 0) {
      period = getClosestValidPeriod(userPeriod, TIME_CONSTANTS.BETWEEN_15_DAYS_AND_63_DAYS.VALID_PERIOD);
      warningMessage = TIME_CONSTANTS.BETWEEN_15_DAYS_AND_63_DAYS.WARNING_MESSAGE.replace("{period}", period);

  } else if (timeDiff > TIME_CONSTANTS.BETWEEN_3_HOURS_AND_15_DAYS.TIME_VALUE && userPeriod % TIME_CONSTANTS.BETWEEN_3_HOURS_AND_15_DAYS.VALID_PERIOD !== 0) {
      period = getClosestValidPeriod(userPeriod, TIME_CONSTANTS.BETWEEN_3_HOURS_AND_15_DAYS.VALID_PERIOD); 
      warningMessage = TIME_CONSTANTS.BETWEEN_3_HOURS_AND_15_DAYS.WARNING_MESSAGE.replace("{period}", period);
  }

  else if (timeDiff <= TIME_CONSTANTS.LESS_THAN_3_HOURS.TIME_VALUE) {
      const validShortPeriods = TIME_CONSTANTS.LESS_THAN_3_HOURS.VALID_PERIODS;
      if (validShortPeriods.includes(userPeriod) || userPeriod % 60 === 0) {
          period = userPeriod;
      } else {
          const shortPeriodClosest = validShortPeriods.reduce((prev, curr) =>
              Math.abs(curr - userPeriod) < Math.abs(prev - userPeriod) ? curr : prev
          );
          const longPeriodClosest = getClosestValidPeriod(userPeriod, TIME_CONSTANTS.LESS_THAN_3_HOURS.VALID_PERIOD);

          const closestPeriod = Math.abs(shortPeriodClosest - userPeriod) < Math.abs(longPeriodClosest - userPeriod) 
              ? shortPeriodClosest 
              : longPeriodClosest;
          period = closestPeriod;
          warningMessage = TIME_CONSTANTS.LESS_THAN_3_HOURS.WARNING_MESSAGE.replace("{period}", period);
      }
  } 
  return { period, warningMessage };
};

module.exports = {
  convertTimePeriodToMs,
  validateAndAdjustPeriod
};