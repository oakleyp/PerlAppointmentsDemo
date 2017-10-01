"use strict";

/* --- Event handler functions --- */

$(document).ready(function() {
  getAppointments().then((data) => {
    renderAppointments(data);
  });
});

$('#new-appt-btn').click(function() {
  $('#new-appt-form').css('display', 'block');
});

$('#search-submit').click(function() {
  let searchText = $('#search-input').val();

  getAppointments(searchText).then((data) => {
    renderAppointments(data);
  })
  
  .catch((data) => {
    console.log("Error while fetching search results.");
  });

});


/* --- Data handler functions --- */

// Populates #appts-table with rows given json cgi response
function renderAppointments(apptsArr) {
  let trows = [];
    for(var i = 0; i < apptsArr.length; i++) {
      trows.push(`
      <tr>
        <td>${apptsArr[i]['date']}</td>
        <td>${apptsArr[i]['time']}</td>
        <td>${apptsArr[i]['description']}</td>
      </tr>
      `);
    }

  $('#appts-table > tbody').html(trows.join(''));
}

// Returns promise that resolves to array of appointment objects 
// parsed from index.cgi json response
function getAppointments(searchText="") {
  return new Promise(function(resolve, reject) {

    $.getJSON(`bin/index.cgi?q=${searchText}`, (resp) => {
      if(resp.data) resolve(resp.data);
    })

    .fail((resp) => { reject(resp.errors) });
  });
}