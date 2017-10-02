import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class DBHelper {
  private Connection connect() {
    // SQLite connection string
    String url = "jdbc:sqlite:appointments_demo.db";
    Connection conn = null;
    try {
        conn = DriverManager.getConnection(url);
    } catch (SQLException e) {
        System.out.println(e.getMessage());
    }
    return conn;
}

  public void insert(String date, String time, String description) {
      String sql = "INSERT INTO appointments(date,time,description) VALUES(?,?,?)";

      try (Connection conn = this.connect();
              PreparedStatement pstmt = conn.prepareStatement(sql)) {
          pstmt.setString(1, date);
          pstmt.setString(2, time);
          pstmt.setString(3, description);
          pstmt.executeUpdate();
      } catch (SQLException e) {
          System.out.println(e.getMessage());
      }
  }
}