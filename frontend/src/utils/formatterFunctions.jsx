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

export { formatDateTime, formatDtConven };
