<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<sql:query var="appointments" dataSource="jdbc/AppointmentsDemo">
  SELECT date, time, desc FROM appointments
</sql:query>

<%@page contentType="text/html" pageEncoding="UTF-8"%>

<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Java Demo</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="styles.css" />
    <script
    src="https://code.jquery.com/jquery-3.2.1.min.js"
    integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4="
    crossorigin="anonymous"></script>
  </head>
  <body>
    <div class="new-appointment-container">
      <button id="new-appt-btn">New</button>
      <form id="new-appt-form" action="index.jsp" method="POST">
        <input name="date" type="text" placeholder="Date" />
        <input name="time" type="text" placeholder="Time" />
        <input name="desc" type="text" placeholder="Description" />
        <input type="submit" value="Submit" />
      </form>
    </div>
    <div class="search-container" action="index.jsp/query" method="GET">
      <input id="search-input" type="text" placeholder="Search" /> 
      <button id="search-submit">Submit</button>
    </div>
    <div class="appointments-table-container">
      <table id="appts-table">
        <!-- column headers -->
        <tr>
          <c:forEach var="columnName" items="${appointments.columnNames}">
            <th><c:out value="${columnName}"/></th>
          </c:forEach>
        </tr>
        <!-- column data -->
        <c:forEach var="row" items="${appointments.rowsByIndex}">
          <tr>
            <c:forEach var="column" items="${row}">
              <td><c:out value="${column}"/></td>
            </c:forEach>
          </tr>
        </c:forEach>
      </table>
    </div>
    <script>
      $('#new-appt-btn').click(function() {
        $('#new-appt-form').css('display', 'block');
      });
    </script>
  </body>
</html>