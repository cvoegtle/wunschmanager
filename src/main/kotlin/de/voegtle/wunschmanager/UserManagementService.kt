package de.voegtle.wunschmanager

import com.google.appengine.api.users.UserService
import com.google.appengine.api.users.UserServiceFactory
import de.voegtle.wunschmanager.util.extractUserName
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.voegtle.wunschmanager.data.UserStatus
import javax.servlet.http.HttpServletRequest

@RestController class UserManagementService {
  var userService = UserServiceFactory.getUserService()

  @CrossOrigin(origins = ["*"])
  @RequestMapping("/user/status")
  fun status(@RequestParam() startUrl: String, req: HttpServletRequest): UserStatus {
    val userName = extractUserName(req)
    val loggedIn = userName != null

    return UserStatus(name = userName, loggedIn = loggedIn,
                      url = localise(createUserManagementUrl(userService, startUrl, loggedIn), req))
  }

  fun createUserManagementUrl(userService: UserService, startUrl: String, loggedIn: Boolean)
    = if (loggedIn) userService.createLogoutURL(startUrl) else userService.createLoginURL(startUrl)

  fun localise(url: String, req: HttpServletRequest): String {
    val scheme = req.scheme
    val hostname = req.serverName
    val port = req.serverPort
    return "$scheme://$hostname:$port$url"
  }
}