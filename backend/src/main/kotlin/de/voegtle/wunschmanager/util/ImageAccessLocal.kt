package de.voegtle.wunschmanager.util

import org.springframework.web.multipart.MultipartFile
import java.io.File
import java.util.logging.Logger

class ImageAccessLocal(private val basePath: String?) : ImageAccess {
  val log: Logger = Logger.getLogger("ImageAccessLocal")

  private val rootDir: File

  init {
    rootDir = if (!basePath.isNullOrBlank()) {
      File(basePath)
    } else {
      File("uploads")
    }
  }

  override fun deleteImage(imageUrl: String) {
    val uploadsIndex = imageUrl.indexOf("/uploads/")
    if (uploadsIndex != -1) {
      val relativePath = imageUrl.substring(uploadsIndex + "/uploads/".length) // e.g. "user/filename"
      try {
        val file = File(rootDir, relativePath)
        if (file.exists()) {
          file.delete()
          log.info("deleted local image $relativePath from $rootDir")
        }
      } catch (e: Exception) {
        log.warning("failed to delete local image $relativePath: ${e.message}")
      }
    }
  }

  override fun saveImage(userName: String, image: MultipartFile): String {
    val userPath = userName.replace("[^a-zA-Z0-9]".toRegex(), "_")
    val uploadsDir = File(rootDir, userPath)
    if (!uploadsDir.exists()) {
      uploadsDir.mkdirs()
    }
    val fileName = "${System.currentTimeMillis()}-${image.originalFilename}"
    val destFile = File(uploadsDir, fileName)
    image.transferTo(destFile)
    return "/uploads/$userPath/$fileName"
  }
}
