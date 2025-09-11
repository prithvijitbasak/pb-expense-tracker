import "../data/monthData.json";

const formatDateTime = (isoString) => {
  const date = new Date(isoString);

  const day = String(date.getDate()).padStart(2, "0"); // dd
  const month = String(date.getMonth() + 1).padStart(2, "0"); // mm (0-based index)
  const year = date.getFullYear(); // yyyy

  const hours = String(date.getHours()).padStart(2, "0"); // hh
  const minutes = String(date.getMinutes()).padStart(2, "0"); // mm
  const seconds = String(date.getSeconds()).padStart(2, "0"); // ss

  return `${day}-${month}-${year} | ${hours}:${minutes}:${seconds}`;
};

const formatDtConven = (isoString) => {
  const date = new Date(isoString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear());

  const formattedDate = `${day}-${month}-${year}`;

  return formattedDate;
};

const toInputDateFormat = (dateString) => {
  const date = new Date(dateString);

  // Get date parts using local time
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`; // yyyy-mm-dd
};

const BritishDate = (props) => {
  const { date } = props;
  const [day, month, year] = date.split("-");

  // Convert day to number
  const dayNum = parseInt(day, 10);

  // Function to get suffix
  const getDaySuffix = (d) => {
    if (d >= 11 && d <= 13) return "th"; // special case
    switch (d % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  // Day with suffix
  // const dayWithSuffix = `${dayNum}${getDaySuffix(dayNum)}`;

  // Months array
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthName = months[parseInt(month, 10) - 1];

  // return `${dayWithSuffix} ${monthName}, ${year}`;
  return (
    <span>
      {dayNum}
      <sup>{getDaySuffix(dayNum)}</sup> {monthName}, {year}
    </span>
  );
};

export { formatDateTime, formatDtConven, toInputDateFormat, BritishDate };
