/* global moment:false */
var timezone = '00:00'
$(document).ready(function(){
  var updateClock = function(){
    $('#clock').text(
      moment.utc().zone(timezone).format('MMM DD, YYYY hh:mm:ss a'))
  }
  var updateSchedule = function(){
    //update select
    $('#timezoneSelect option[value="' + timezone + '"]').attr('selected',true)
    //update entries
    $('.schedule').each(function(){
      var utc = moment.utc($(this).attr('data-value'))
      utc.zone(timezone)
      $(this).text(utc.format('hh:mm a'))
    })
  }
  updateClock()
  setInterval(updateClock,1000)
  $('#timezoneSelect').change(function(){
    var val = $(this).val()
    timezone = val
    updateSchedule()
  })
  timezone = moment().format('Z')
  updateSchedule()
})
