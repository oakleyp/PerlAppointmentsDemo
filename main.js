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

// Post data in form id, rerender search, clear inputs
function postAppointment(formId) {
  $.post('bin/index.cgi', $(formId).serialize()).then(() => {
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
        trows.push(`
        <tr>
          <td>${data[i]['date']}</td>
          <td>${data[i]['time']}</td>
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