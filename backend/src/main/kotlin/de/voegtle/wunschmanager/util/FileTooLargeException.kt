package de.voegtle.wunschmanager.util

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

@ResponseStatus(HttpStatus.PAYLOAD_TOO_LARGE)
class FileTooLargeException(override val message: String): Exception(message)
