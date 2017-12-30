package de.voegtle.wunschmanager.util

import org.voegtle.wunschmanager.data.WishList
import javax.servlet.http.HttpServletRequest

fun extractUserName(request: HttpServletRequest, exceptionIfNull: Boolean = true): String? {
  val userName = request.userPrincipal?.name
  if (exceptionIfNull && userName == null) {
    throw LoginRequiredException("This action requires a login")
  }
  return userName
}

fun checkOwnership(request: HttpServletRequest, wishList: WishList, message: String) {
  val userName = extractUserName(request, true)
  if (wishList.owner != userName) {
    throw PermissionDenied(message = message)
  }
}
