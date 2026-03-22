package de.voegtle.wunschmanager.util

import com.google.cloud.storage.BlobId
import com.google.cloud.storage.BlobInfo
import com.google.cloud.storage.Storage
import com.google.cloud.storage.StorageOptions
import org.springframework.web.multipart.MultipartFile
import java.util.logging.Logger

class ImageAccess {
  val log: Logger = Logger.getLogger("ImageAccess")

  private val storage: Storage = StorageOptions.getDefaultInstance().service
  private val googleApisUrl = "https://storage.googleapis.com"
  private val bucketName = "wunschmanager.appspot.com"

  fun deleteImage(imageUrl: String) {
    if (imageUrl.startsWith("$googleApisUrl/$bucketName/")) {
      val blobName = imageUrl.substringAfter("$googleApisUrl/$bucketName/")
      try {
        storage.delete(BlobId.of(bucketName, blobName))
        log.info("deleted image $blobName")
      } catch (e: Exception) {
        log.warning("failed to delete image $blobName: ${e.message}")
      }
    }
  }

  fun saveImage(userName: String, image: MultipartFile): String {
    val blobId = BlobId.of(bucketName, "images/$userName/${image.originalFilename}-${System.currentTimeMillis()}")
    val blobInfo = BlobInfo.newBuilder(blobId).setContentType(image.contentType).build()
    storage.create(blobInfo, image.bytes)
    return "$googleApisUrl/$bucketName/${blobId.name}"
  }

}
