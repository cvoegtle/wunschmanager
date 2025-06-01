package de.voegtle.wunschmanager.util

import org.voegtle.wunschmanager.data.WishList
import java.util.logging.Logger
import org.springframework.security.oauth2.core.oidc.user.OidcUser

fun extractUserId(oidcUser: OidcUser?, exceptionIfNull: Boolean = true): String? {
  val userName = oidcUser?.subject
  if (exceptionIfNull && userName == null) {
    logException("This action requires a login")
    throw LoginRequiredException("This action requires a login")
  }
  return userName
}

fun extractUserIdNotNull(oidcUser: OidcUser?):String = extractUserId(oidcUser)!!

fun assertOwnership(oidcUser: OidcUser?, wishList: WishList, message: String) {
  val userId = extractUserId(oidcUser, true)
  if (wishList.owner != userId) {
    logException("$userId: $message")
    throw PermissionDenied(message)
  }
}

fun assertNotOwnership(userId: String?, wishList: WishList, message: String) {
  if (wishList.owner == userId && !wishList.managed) {
    logException("$userId: $message")
    throw PermissionDenied(message)
  }
}

fun assertManagedOwnership(userId: String?, wishList: WishList, message: String) {
  if (wishList.owner != userId || !wishList.managed) {
    logException("$userId: $message")
    throw PermissionDenied(message)
  }
}

fun assertNotEmpty(donor: String, message: String) {
  if (donor.isEmpty()) {
    logException(message)
    throw PermissionDenied(message)
  }
}

private fun logException(message: String) {
  val log = Logger.getLogger("UserUtil")
  log.warning(message)
}

