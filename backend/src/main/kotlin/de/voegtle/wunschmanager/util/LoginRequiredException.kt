package de.voegtle.wunschmanager.util

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

@ResponseStatus(HttpStatus.UNAUTHORIZED)
class LoginRequiredException(override val message: String): Exception(message)
