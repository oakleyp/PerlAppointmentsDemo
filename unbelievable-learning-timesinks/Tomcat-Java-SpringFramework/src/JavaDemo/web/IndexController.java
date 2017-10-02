package JavaDemo.web;

import org.springframework.web.servlet.mvc.Controller;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.io.IOException;

public class IndexController implements Controller {

    protected final Log logger = LogFactory.getLog(getClass());

    public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        logger.info("Returning index view");

        String date = request.getParameter("date");
        String time = request.getParameter("time");
        String desc = request.getParameter("desc");

        DBHelper dbh = new DBHelper();

        if(date.length() > 0 && time.length() > 0 && desc.length() > 0) {
          dbh.insert(date, time, desc);
        }

        return new ModelAndView("WEB-INF/jsp/index.jsp");
    }

}