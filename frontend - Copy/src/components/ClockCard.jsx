import { useState, useEffect } from "react";

const ClockCard = () => {
  const [time, setTime] = useState("");
  const [weekDay, setWeekDay] = useState("");
  const [date, setDate] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [suffix, setSuffix] = useState("");

  useEffect(() => {
    const getDateSuffix = (day) => {
      if (day >= 11 && day <= 13) return "th";
      const lastDigit = day % 10;
      switch (lastDigit) {
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

    const updateTime = () => {
      const now = new Date();

      // Format time: HH:MM:SS
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      setTime(`${hours}:${minutes}:${seconds}`);

      // Weekday name
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      setWeekDay(days[now.getDay()]);

      // Date with suffix: DDth Month YYYY
      const day = now.getDate();
      const suffix = getDateSuffix(day);
      setSuffix(suffix);

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

      setDate(`${day}`);
      setMonth(`${months[now.getMonth()]}`);
      setYear(`${now.getFullYear()}`);
    };

    updateTime(); // Initial call
    const timer = setInterval(updateTime, 1000); // Update every second

    // Cleanup on component unmount
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="clock-card-wrapper w-2xs bg-[var(--top-color)] p-3 rounded-sm shadow-(--global-box-shadow)">
      <p className="text-lg text-white">Today is,</p>
      <p className="text-white text-2xl font-bold">
        {weekDay} | {time}
      </p>
      <p className="text-right text-white text-lg italic">
        {date}
        <sup className="ml-0.5">{suffix}</sup> {month}, {year}
      </p>
    </div>
  );
};

export default ClockCard;
