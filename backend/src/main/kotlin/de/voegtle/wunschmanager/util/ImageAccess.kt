package de.voegtle.wunschmanager.util

import org.springframework.web.multipart.MultipartFile

interface ImageAccess {
  fun deleteImage(imageUrl: String)
  fun saveImage(userName: String, image: MultipartFile): String

  companion object {
    fun create(): ImageAccess {
      val blobstorePath = System.getenv("BLOBSTORE_EMULATOR_PATH")
      return if (!blobstorePath.isNullOrBlank()) {
        ImageAccessLocal(blobstorePath)
      } else {
        ImageAccessGoogleApis()
      }
    }
  }
}
