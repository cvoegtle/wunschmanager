package de.voegtle.wunschmanager

import com.googlecode.objectify.ObjectifyService
import de.voegtle.wunschmanager.util.MissingLoginException
import de.voegtle.wunschmanager.util.PermissionDenied
import de.voegtle.wunschmanager.util.extractUserName
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.voegtle.wunschmanager.data.WishList
import javax.servlet.http.HttpServletRequest

@RestController
class WishListService {
  @CrossOrigin(origins = ["*"])
  @RequestMapping("/wishlist/create")
  fun create(@RequestParam() event: String, req: HttpServletRequest): WishList {
    val userName = extractUserName(req)
    if (userName != null) {
      val newWishList = WishList(event = event, owner = userName)
      ObjectifyService.ofy().save().entity(newWishList).now()
      return newWishList
    } else {
      throw MissingLoginException("please login before editing")
    }
  }

  @CrossOrigin(origins = ["*"])
  @RequestMapping("/wishlist/list")
  fun list(req: HttpServletRequest): List<WishList> {
    val userName = extractUserName(req)
    return ObjectifyService.ofy().load().type(WishList::class.java).filter("owner ==", userName).list()
  }

  @CrossOrigin(origins = ["*"])
  @RequestMapping("/wishlist/delete")
  fun delete(@RequestParam() id: Long, req: HttpServletRequest): Boolean {
    val userName = extractUserName(req)
    val deleteCandidate = ObjectifyService.ofy().load().type(WishList::class.java).id(id).now()

    if (deleteCandidate.owner == userName) {
      ObjectifyService.ofy().delete().type(WishList::class.java).id(id).now()
      return true
    } else {
      throw PermissionDenied("you are not permitted to delete the wishlist $id")
    }
  }


}