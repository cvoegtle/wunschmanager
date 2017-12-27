package de.voegtle.wunschmanager.util

import javax.servlet.http.HttpServletRequest

fun extractUserName(request: HttpServletRequest): String? {
  return request.userPrincipal?.name
}