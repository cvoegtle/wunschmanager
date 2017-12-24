package de.voegtle.wunschmanager

import com.google.appengine.api.users.UserServiceFactory
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.voegtle.wunschmanager.data.UserStatus
import javax.servlet.http.HttpServletRequest

@RestController class UserService {
  @CrossOrigin(origins = ["*"])
  @RequestMapping("/user/status")
  fun status(@RequestParam() startUrl: String, req: HttpServletRequest): UserStatus {
    val userPrincipal = req.userPrincipal
    val userService = UserServiceFactory.getUserService()
    return if (userPrincipal != null)
      UserStatus(name = userPrincipal.name, loggedIn = true, url = localise(userService.createLogoutURL(startUrl), req))
     else
      UserStatus(name = null, loggedIn = false, url = localise(userService.createLoginURL(startUrl), req))
  }

  fun localise(url: String, req: HttpServletRequest): String {
    val scheme = req.scheme
    val hostname = req.serverName
    val port = req.serverPort
    return "$scheme://$hostname:$port$url"
  }
}