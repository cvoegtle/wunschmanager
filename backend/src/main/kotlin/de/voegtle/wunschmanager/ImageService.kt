package de.voegtle.wunschmanager

import com.google.cloud.storage.BlobId
import com.google.cloud.storage.BlobInfo
import com.google.cloud.storage.Storage
import com.google.cloud.storage.StorageOptions
import de.voegtle.wunschmanager.util.FileTooLargeException
import de.voegtle.wunschmanager.util.extractUserIdNotNull
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.oauth2.core.oidc.user.OidcUser
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile
import java.util.logging.Logger

@RestController
class   ImageService(val wishService: WishService) {
  val log = Logger.getLogger("ImageService")

  private val storage: Storage = StorageOptions.getDefaultInstance().service
  private val googleApisUrl = "https://storage.googleapis.com"
  private val bucketName = "wunschmanager.appspot.com"
  private val maxImageSize = 2*1024*1024

  @PostMapping("/image/upload")
  @CrossOrigin(origins = ["https://wunschmanager.appspot.com"])
  fun uploadImage(@RequestParam image: MultipartFile,
                  @AuthenticationPrincipal oidcUser: OidcUser?): String {
    val userName = extractUserIdNotNull(oidcUser)
    assertImageIsBelowSizeLimit(image)

    val blobId = BlobId.of(bucketName, "images/$userName/${image.originalFilename}-${System.currentTimeMillis()}")
    val blobInfo = BlobInfo.newBuilder(blobId).setContentType(image.contentType).build()
    storage.create(blobInfo, image.bytes)

    val imageUrl = "$googleApisUrl/$bucketName/${blobId.name}"
    log.warning("saved image with url $imageUrl")
    return imageUrl
  }

  private fun assertImageIsBelowSizeLimit(image: MultipartFile) {
    if (image.size > maxImageSize) {
      throw FileTooLargeException("${image.originalFilename} exceeds the maximum size of $maxImageSize bytes")
    }
  }

}
