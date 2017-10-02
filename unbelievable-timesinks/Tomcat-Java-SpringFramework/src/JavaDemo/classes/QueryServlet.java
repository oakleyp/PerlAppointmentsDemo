import java.io.*;
import java.sql.*;
import javax.servlet.*;
import javax.servlet.http.*;
 
public class QueryServlet extends HttpServlet {  // JDK 1.6 and above only
 
   // The doGet() runs once per HTTP GET request to this servlet.
   @Override
   public void doGet(HttpServletRequest request, HttpServletResponse response)
               throws ServletException, IOException {
      // Set the MIME type for the response message
      response.setContentType("text/html");
      // Get a output writer to write the response message into the network socket
      PrintWriter out = response.getWriter();
      
      Statement stmt = null;
      Connection conn = null;
      try {
          // db parameters
          String url = "jdbc:sqlite:appointments_test.db";
          // create a connection to the database
          conn = DriverManager.getConnection(url);
          
          System.out.println("Connection to SQLite has been established.");
          
      } catch (SQLException e) {
          System.out.println(e.getMessage());
      } finally {
          try {
              if (conn != null) {
                  conn.close();
              }
          } catch (SQLException ex) {
              System.out.println(ex.getMessage());
          }
      }
   }
}