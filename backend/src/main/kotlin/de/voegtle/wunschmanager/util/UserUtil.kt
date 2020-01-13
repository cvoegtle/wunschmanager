package de.voegtle.wunschmanager.util

import org.voegtle.wunschmanager.data.WishList
import java.util.logging.Logger
import javax.servlet.http.HttpServletRequest

fun extractUserName(request: HttpServletRequest, exceptionIfNull: Boolean = true): String? {
  val userName = request.userPrincipal?.name
  if (exceptionIfNull && userName == null) {
    logException("This action requires a login")
    throw LoginRequiredException("This action requires a login")
  }
  return userName
}

fun checkOwnership(request: HttpServletRequest, wishList: WishList, message: String) {
  val userName = extractUserName(request, true)
  if (wishList.owner != userName) {
    logException("$userName: $message")
    throw PermissionDenied(message = message)
  }
}

fun checkNotOwnership(userName: String?, wishList: WishList, message: String) {
  if (wishList.owner == userName && !wishList.managed) {
    logException("$userName: $message")
    throw PermissionDenied(message= message)
  }
}

private fun logException(message: String) {
  val log = Logger.getLogger("UserUtil")
  log.warning(message)
}

