package de.voegtle.wunschmanager

import com.google.appengine.api.users.UserServiceFactory
import java.io.IOException
import javax.servlet.Servlet
import javax.servlet.ServletException
import javax.servlet.ServletRequest
import javax.servlet.ServletResponse
import javax.servlet.http.HttpServlet
import javax.servlet.http.HttpServletRequest


class LoginServlet {
  fun dispatcherServlet(): Servlet {
    return object : HttpServlet() {
      @Throws(ServletException::class, IOException::class)
      override fun service(request: ServletRequest, res: ServletResponse) {
        val userService = UserServiceFactory.getUserService()
        val req: HttpServletRequest = request as HttpServletRequest;
        val thisUrl = req.getRequestURI()

        res.setContentType("text/html")
        if (req.userPrincipal != null) {
          res.writer.println(
              "<p>Hello, "
                  + req.getUserPrincipal().getName()
                  + "!  You can <a href=\""
                  + userService.createLogoutURL(thisUrl)
                  + "\">sign out</a>.</p>")
        } else {
          res.writer.println("<p>Please <a href=\"" + userService.createLoginURL(thisUrl) + "\">sign in</a>.</p>")
        }
      }
    }
  }

}