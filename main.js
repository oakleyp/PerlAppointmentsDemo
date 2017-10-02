"use strict";

/* --- Event handlers --- */

//On load render all appointments
$(document).ready(function() {
  $('#datepicker').datepicker();

  getAppointments().then((data) => {
    renderAppointments(data);
  })
  
  //Catch submission errors
  .catch((data) => {
    renderAppointments(data);
  });
});

//New/Add button
$('#new-appt-btn').click(function() {
  if($('#new-appt-form').attr('class').includes('form-hidden')) { // Show form
    $('#new-appt-form').removeClass();
    $('#new-appt-form').addClass('form-visible');
    $('#cancel-btn').removeClass(); 
    $('#cancel-btn').addClass('button-visible');
    $('#new-appt-btn').html('Add');
  } else { // Submit form
    postAppointment('#new-appt-form');
  }
});

//Cancel button
$('#cancel-btn').click(function() {
  $('#new-appt-form').removeClass();
  $('#new-appt-form').addClass('form-hidden');
  $('#cancel-btn').removeClass(); 
  $('#cancel-btn').addClass('button-hidden');
  $('#new-appt-btn').html('New');
});

//Search button
$('#search-submit').click(function() {
  let searchText = $('#search-input').val();

  getAppointments(searchText).then((data) => {
    renderAppointments(data);
  })
  
  .catch((data) => {
    console.log("Error while fetching search results.");
    renderAppointments(data);
  });

});


/* --- Data handlers --- */

// Returns promise that resolves to array of appointment objects 
// parsed from index.cgi json response
function getAppointments(searchText="") {
  return new Promise(function(resolve, reject) {

    $.getJSON(`bin/index.cgi?q=${searchText}`, (resp) => {
      if(resp.data) resolve(resp);
    })

    .fail((resp) => { reject(resp) });
  });
}

// Returns null if date or time are invalid.
// otherwise, returns ISO date str
function getDateTimeStr(formId) {
  let dateIn = $(`${formId} > input[name='date']`).val().trim(),
      timeIn = $(`${formId} > input[name='time']`).val().trim();

  //If all is well, these should be in the format '10/04/2017' and '07:32' resp.
  let dateStr = dateIn + ' ' + timeIn + ":00";

  if(isNaN(Date.parse(dateStr))) {
    //Try and alert what went wrong
    if(isNaN(Date.parse(dateIn))) {
      $(`${formId} > input[name='date']`).val('Invalid date.');
    } 

    //Check valid time string format HH:MM
    if(!/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(timeIn)) {
      $(`${formId} > input[name='time']`).val('Invalid time.');
    }

    console.log("Problem with datestr", dateStr);

    return null;
  } 

  dateStr = new Date(dateStr).toISOString();

  console.log("Got datestr from inputs: ", dateStr);
  return dateStr;

}

// Post data in form id, rerender search, clear inputs
function postAppointment(formId) {
  let pdata = "desc=" + $(`${formId} > input[name='desc']`).val(),
      dts = getDateTimeStr(formId);

  // If null, getDateTimeStr handles error display
  if(!dts) return;

  pdata = encodeURI(pdata + `&date_time=${dts}`);

  console.log('Posting appt data: ', pdata);
  

  $.post('bin/index.cgi', pdata).then(() => {
    //Rerender search results
    getAppointments($('#search-input').val()).then((data) => {
      renderAppointments(data);
    });

    //This at least works in the latest Chrome to clear inputs
    $(formId).trigger('reset');
  });
}

// Populates #appts-table with rows given json cgi response
// also, .errors-container errors for invalid submissions and potentially search
function renderAppointments(respJSON) {
  let trows = [];

  //render appoinment rows
  if(respJSON.data) {
    let data = respJSON.data;

    for(var i = 0; i < data.length; i++) {
        let dateTime = new Date(data[i]['date_time']);
        trows.push(`
        <tr>
          <td>${dateTime.toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric' })}</td>
          <td>${('0' + dateTime.getHours()).slice(-2) + ':' + ('0' + dateTime.getMinutes()).slice(-2)}</td>
          <td>${data[i]['description']}</td>
        </tr>
        `);
      }

    $('#appts-table > tbody').html(trows.join(''));
  }

  //render errors
  let errNodes = [];
  if(respJSON.errors) {
    for(var i = 0; i < respJSON.errors.length; i++)
      errNodes.push(`<p class="error-msg">${respJSON.errors[i]}</p>`);

    $('.errors-container')[0].html(errNodes.join(''));
  }
}