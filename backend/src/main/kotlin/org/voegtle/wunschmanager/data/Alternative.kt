package org.voegtle.wunschmanager.data

data class Alternative(
  var description: String? = null,
  var link: String? = null
) {
  fun isEmpty() = description.isNullOrBlank() && link.isNullOrBlank()
}

