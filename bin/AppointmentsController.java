import java.util.*;
import java.io.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.sql.*;

import org.google.gson.Gson;
import org.google.gson.GsonBuilder;
 

public class AppointmentsController { 
  public AppointmentsController() {
    super();
  }

  private List<Appointment> getAppointmentsWithQuery(DB db, String query) {
    List<Appointment> appointmentsList = new ArrayList<Appointment>();
    ArrayList apptList = db.selectAll(query);

    for(int i = 0; i < apptList.size(); i++) {
      HashMap<String, String> tmp = (HashMap<String, String>) apptList.get(i);
      Appointment appt = new Appointment(tmp.get("date"), tmp.get("time"), tmp.get("desc"));
      appointmentsList.add(appt);
    }

    return appointmentsList;
  }

  public static void main(String[] args) {
    // Parse form data into hash table
    Hashtable form_data = cgi_lib.ReadParse(System.in);

    // Insert new appt into table if fields are valid
    String date = (String)form_data.get("date");
    String time = (String)form_data.get("time");
    String desc = (String)form_data.get("desc");

    DB apptDB = new DB("jdbc:sqlite:OP_ApptsDemo.db");

    if(date.length() > 0 && time.length() > 0 && desc.length() > 0) {
      apptDB.insert(date, time, desc);
    }

    // Output data as JSON
    ObjectMapper mapper = new ObjectMapper();
    List<Appointment> appointments = new getAppointmentsWithQuery(apptDB, (String)form_data.get("q"));
    String dataJSON = mapper.writeValueAsString(appointments);

    System.out.print("Content-Type: application/json\n\n");
    System.out.println("{data: " + dataJSON + "}");
  }
}

class Appointment {
  // In the real world, date and time would be timestamps, but I would also have a real 
  // date picker and bootstrap on the front end
  private String date;
  private String time;
  private String desc;

  public Appointment(String date, String time, String desc) {
    super();

    this.date = date;
    this.time = time;
    this.desc = desc;
  }

  //Accessors
  public String getDate() { return date; }
  public String getTime() { return time; }
  public String getDesc() { return desc; }

  //Modifiers
  public void setDate(String date) { this.date = date; }
  public void setTime(String time) { this.time = time; }
  public void setDesc(String desc) { this.desc = desc; }

}

class DB {
  public DB(String jdbcURL) {
    super();

    this.jdbcURL = jdbcURL;
  }

  private String jdbcURL;

  private Connection connect() {
    // SQLite connection string
    String url = this.jdbcURL;
    Connection conn = null;
    try {
        conn = DriverManager.getConnection(url);
    } catch (SQLException e) {
        System.out.println(e.getMessage());
    }
    return conn;
  }

  // Returns all rows in appointments table as arraylist, matching query if provided
  public ArrayList selectAll(String query){
    String sql = "SELECT id, date, time, description FROM appointments";
    ArrayList result = new ArrayList(50);

    query = (query == null) ? "" : query.toLowerCase();
    
    try (Connection conn = this.connect();
         Statement stmt  = conn.createStatement();
         ResultSet rs    = stmt.executeQuery(sql)){

        ResultSetMetaData md = rs.getMetaData();
        int columns = md.getColumnCount();

        // loop through the result set
        while (rs.next()) {
          HashMap row = new HashMap(columns);
          for(int i = 0; i < columns; i++) {
            row.put(md.getColumnName(i), rs.getObject(i));
          }

          // Skip if description does not match query
          Pattern r = Pattern.compile(query);
          Matcher m = r.matcher((String)row.get("description"));

          if(query.length() > 0) {
            if(m.find()) continue;
          }

          result.add(row);
        }

        return result;

    } catch (SQLException e) {
      return result;
    }
  }


  public void insert(String date, String time, String desc) {
    String sql = "INSERT INTO appointments(date,time,description) VALUES(?,?,?)";

    try (Connection conn = this.connect();
            PreparedStatement pstmt = conn.prepareStatement(sql)) {

        pstmt.setString(1, date);
        pstmt.setString(2, time);
        pstmt.setString(3, desc);
        pstmt.executeUpdate();
    } catch (SQLException e) {
        System.out.println(e.getMessage());
    }
  }
}