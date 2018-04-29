package de.voegtle.wunschmanager

import com.googlecode.objectify.Key
import com.googlecode.objectify.ObjectifyService
import de.voegtle.wunschmanager.util.checkOwnership
import de.voegtle.wunschmanager.util.extractUserName
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.voegtle.wunschmanager.data.SharedWishList
import org.voegtle.wunschmanager.data.WishList
import java.util.Date
import javax.servlet.http.HttpServletRequest

@RestController
class WishListService {
  @GetMapping("/wishlist/create")
  fun create(@RequestParam() event: String, @RequestParam() managed: Boolean, req: HttpServletRequest): WishList {
    val userName = extractUserName(req, true)

    val newWishList = WishList(event = event, owner = userName, managed = managed, createTimestamp = Date().time)
    ObjectifyService.ofy().save().entity(newWishList).now()
    return newWishList
  }

  @GetMapping("/wishlist/get")
  fun get(@RequestParam() id: Long, req: HttpServletRequest): WishList
      = ObjectifyService.ofy().load().type(WishList::class.java).id(id).now()

  @PostMapping("/wishlist/update")
  fun update(@RequestBody() wishList: WishList, req: HttpServletRequest): WishList {
    val updateCandidate = ObjectifyService.ofy().load().type(WishList::class.java).id(wishList.id!!).now()

    checkOwnership(req, updateCandidate, "You do not have the permission to change the list.")

    updateCandidate.event = wishList.event
    updateCandidate.description = wishList.description
    updateCandidate.background = wishList.background
    ObjectifyService.ofy().save().entity(updateCandidate).now()

    return updateCandidate
  }

  @GetMapping("/wishlist/list")
  fun list(req: HttpServletRequest): List<WishList> {
    val userName = extractUserName(req, true)
    return ObjectifyService.ofy().load().type(WishList::class.java).filter("owner ==", userName)
        .order("createTimestamp").list()
  }

  @GetMapping("/wishlist/delete")
  fun delete(@RequestParam() id: Long, req: HttpServletRequest): Boolean {
    val deleteCandidate = ObjectifyService.ofy().load().type(WishList::class.java).id(id).now()

    checkOwnership(req, deleteCandidate, "You do not have the permission to delete the list.")

    ObjectifyService.ofy().delete().type(WishList::class.java).id(id).now()
    return true
  }


  @GetMapping("/wishlist/share")
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

  @GetMapping("/wishlist/shared")
  fun shared(req: HttpServletRequest): Collection<WishList> {
    val userName = extractUserName(req)

    val sharedLists = ObjectifyService.ofy().load().type(SharedWishList::class.java)
        .filter("sharedWith", userName).list()
    val keys = ArrayList<Key<WishList>>()
    sharedLists.forEach { keys.add(Key.create(WishList::class.java, it.wishListId!!)) }

    val wishLists = ObjectifyService.ofy().load().keys(keys)
    val sortedList = ArrayList<WishList>(wishLists.values)
    sortedList.sort()

    return sortedList
  }

  @GetMapping("/wishlist/unshare")
  fun unshare(@RequestParam() id: Long, req: HttpServletRequest): Boolean {
    val userName = extractUserName(req)
    val sharedLists = ObjectifyService.ofy().load().type(SharedWishList::class.java)
        .filter("sharedWith", userName).filter("wishListId", id).list()
    ObjectifyService.ofy().delete().entities(sharedLists).now()

    return !sharedLists.isEmpty()
  }
}