

const isValidTimezone = async (timezone) => {
  try {
    const params = new URLSearchParams({
      key: process.env.TIMEZONE_DB_API_KEY,
      format: "json",
      by: "zone",
      zone: timezone,
    });

    const response = await fetch(
      `https://api.timezonedb.com/v2.1/list-time-zone?${params.toString()}`,
    );

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    // checking whether the timezone exists in the returned data
    return data.zones[0].zoneName === timezone;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = { isValidTimezone };
