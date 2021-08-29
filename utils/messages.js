const formatMessage = (text,username="ChatApp Bot") => {
  return {
    username,
    text,
    time: formatAMPM(new Date()),
  };
};

function formatAMPM(date) {
  date.setHours(date.getHours() + 5); 
  date.setMinutes(date.getMinutes() + 30);
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}

module.exports = formatMessage;
