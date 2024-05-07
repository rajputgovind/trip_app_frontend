const mois = [
  "Jan",
  "Feb",
  "March",
  "April",
  "May",
  "June",
  "July",
  "Aug",
  "Sept",
  "oct",
  "Nov",
  "Dec",
];

export default function frenchTodayDate(date) {
  let today = new Date(date);

  let year = today.getFullYear();
  let dayNumber = today.getDate();
  let month = mois[today.getMonth()];
  let weekday = today.toLocaleDateString("en-US", { weekday: "long" });

  let newDate = `  ${year} , ${month}-${dayNumber}  `;

  return newDate;
}
