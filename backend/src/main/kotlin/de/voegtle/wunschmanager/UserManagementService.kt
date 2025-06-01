package de.voegtle.wunschmanager

import de.voegtle.wunschmanager.util.extractUserId
import jakarta.servlet.http.HttpServletRequest
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.oauth2.core.oidc.user.OidcUser
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.voegtle.wunschmanager.data.UserStatus
import java.util.logging.Logger

@RestController class UserManagementService {
  protected val log = Logger.getLogger("UserManagementService")


  @GetMapping("/user/status")
  fun status(@RequestParam() startUrl: String, @AuthenticationPrincipal oidcUser: OidcUser?): UserStatus {
    val userName = extractUserId(oidcUser, exceptionIfNull = false)
    val loggedIn = userName != null

    log.info("UserId=${oidcUser?.subject},  currentUser=${oidcUser?.email}")

    return UserStatus(name = userName, loggedIn = loggedIn,
                      url = createUserManagementUrl(startUrl, loggedIn))
  }

  fun createUserManagementUrl(startUrl: String, loggedIn: Boolean)
    = if (!loggedIn) "/oauth2/authorization/google"  else "/logout"

  private fun trimUrlParameter(url: String): String {
    val startParameter = url.indexOf("?")
    return if (startParameter >= 0) url.substring(0, startParameter) else url
  }


  fun localise(url: String, req: HttpServletRequest): String {
    val scheme = req.scheme
    val hostname = req.serverName
    val port = req.serverPort
    return if (hostname == "localhost") "$scheme://$hostname:$port$url" else url
  }
}
