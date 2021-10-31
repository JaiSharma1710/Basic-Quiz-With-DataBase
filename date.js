module.exports = function(){

  var today = new Date;
  var currentDay = today.getDay();
  var fullDate = "";
  var options = {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  }

  fullDate = today.toLocaleString('en-US', options);

  return fullDate;

}
