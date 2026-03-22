package de.voegtle.wunschmanager

import com.google.cloud.storage.BlobId
import com.google.cloud.storage.BlobInfo
import com.google.cloud.storage.Storage
import com.google.cloud.storage.StorageOptions
import com.googlecode.objectify.ObjectifyService
import de.voegtle.wunschmanager.util.FileTooLargeException
import de.voegtle.wunschmanager.util.ImageAccess
import de.voegtle.wunschmanager.util.assertOwnership
import de.voegtle.wunschmanager.util.extractUserIdNotNull
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.oauth2.core.oidc.user.OidcUser
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile
import org.voegtle.wunschmanager.data.Image
import org.voegtle.wunschmanager.data.Wish
import org.voegtle.wunschmanager.data.WishList
import java.util.logging.Logger

@RestController
class ImageService {
  val log: Logger = Logger.getLogger("ImageService")
  val imageAccess: ImageAccess = ImageAccess()
  private val maxImageSize = 2*1024*1024


  @PostMapping("/image/upload")
  @CrossOrigin(origins = ["https://wunschmanager.appspot.com"])
  fun uploadImage(@RequestParam listId: Long, @RequestParam wishId: Long, @RequestParam image: MultipartFile,
                  @AuthenticationPrincipal oidcUser: OidcUser?): Wish {
    val userName = extractUserIdNotNull(oidcUser)
    assertImageIsBelowSizeLimit(image)

    val wishList: WishList = ObjectifyService.ofy().load().type(WishList::class.java).id(listId).now()
    assertOwnership(oidcUser, wishList, "You must be the owner of the list to append an image")
    val wish = loadWish(wishList, wishId)

    val imageUrl = imageAccess.saveImage(userName, image)
    wish.images += Image(imageUrl)
    saveWish(wish)

    log.warning("saved image with url $imageUrl")
    return wish
  }


  private fun assertImageIsBelowSizeLimit(image: MultipartFile) {
    if (image.size > maxImageSize) {
      throw FileTooLargeException("${image.originalFilename} exceeds the maximum size of $maxImageSize bytes")
    }
  }

}
