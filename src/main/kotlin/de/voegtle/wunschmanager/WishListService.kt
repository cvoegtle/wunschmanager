package de.voegtle.wunschmanager

import com.googlecode.objectify.Key
import com.googlecode.objectify.ObjectifyService
import de.voegtle.wunschmanager.util.checkOwnership
import de.voegtle.wunschmanager.util.extractUserName
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.voegtle.wunschmanager.data.SharedWishList
import org.voegtle.wunschmanager.data.WishList
import javax.servlet.http.HttpServletRequest

@RestController
class WishListService {
  @CrossOrigin(origins = ["*"])
  @RequestMapping("/wishlist/create")
  fun create(@RequestParam() event: String, req: HttpServletRequest): WishList {
    val userName = extractUserName(req, true)

    val newWishList = WishList(event = event, owner = userName)
    ObjectifyService.ofy().save().entity(newWishList).now()
    return newWishList
  }

  @CrossOrigin(origins = ["*"])
  @RequestMapping("/wishlist/rename")
  fun rename(@RequestParam() id: Long, @RequestParam() event: String, req: HttpServletRequest): WishList {
    val renameCandidate = ObjectifyService.ofy().load().type(WishList::class.java).id(id).now()

    checkOwnership(req, renameCandidate, "You do not have the permission to change the list.")

    renameCandidate.event = event
    ObjectifyService.ofy().save().entity(renameCandidate).now()

    return renameCandidate
  }

  @CrossOrigin(origins = ["*"])
  @RequestMapping("/wishlist/list")
  fun list(req: HttpServletRequest): List<WishList> {
    val userName = extractUserName(req, true)
    return ObjectifyService.ofy().load().type(WishList::class.java).filter("owner ==", userName).list()
  }

  @CrossOrigin(origins = ["*"])
  @RequestMapping("/wishlist/delete")
  fun delete(@RequestParam() id: Long, req: HttpServletRequest): Boolean {
    val deleteCandidate = ObjectifyService.ofy().load().type(WishList::class.java).id(id).now()

    checkOwnership(req, deleteCandidate, "You do not have the permission to delete the list.")

    ObjectifyService.ofy().delete().type(WishList::class.java).id(id).now()
    return true
  }


  @CrossOrigin(origins = ["*"])
  @RequestMapping("/wishlist/share")
  fun share(@RequestParam() id: Long, req: HttpServletRequest): List<WishList> {
    val result = ArrayList<WishList>()

    val userName = extractUserName(req)
    val wishListToBeShared = ObjectifyService.ofy().load().type(WishList::class.java).id(id).now()

    if (wishListToBeShared.owner != userName) {
      val sharedLists = ObjectifyService.ofy().load().type(SharedWishList::class.java)
          .filter("sharedWith", userName).filter("wishListId", id).list()
      if (sharedLists.isEmpty()) {
        val sharedWishList = SharedWishList(sharedWith = userName, wishListId = id)
        ObjectifyService.ofy().save().entity(sharedWishList).now()
      }
      result.add(wishListToBeShared)
    }

    return result
  }

  @CrossOrigin(origins = ["*"])
  @RequestMapping("/wishlist/shared")
  fun shared(req: HttpServletRequest): Collection<WishList> {
    val userName = extractUserName(req)

    val sharedLists = ObjectifyService.ofy().load().type(SharedWishList::class.java)
        .filter("sharedWith", userName).list()
    val keys = ArrayList<Key<WishList>>()
    sharedLists.forEach { keys.add(Key.create(WishList::class.java, it.wishListId!!)) }

    val wishLists = ObjectifyService.ofy().load().keys(keys)

    return wishLists.values
  }

  @CrossOrigin(origins = ["*"])
  @RequestMapping("/wishlist/unshare")
  fun unshare(@RequestParam() id: Long, req: HttpServletRequest): Boolean {
    val userName = extractUserName(req)
    val sharedLists = ObjectifyService.ofy().load().type(SharedWishList::class.java)
        .filter("sharedWith", userName).filter("wishListId", id).list()
    ObjectifyService.ofy().delete().entities(sharedLists).now()

    return !sharedLists.isEmpty()
  }


}