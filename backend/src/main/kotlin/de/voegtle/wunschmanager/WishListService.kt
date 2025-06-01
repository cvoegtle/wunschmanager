package de.voegtle.wunschmanager

import com.googlecode.objectify.Key
import com.googlecode.objectify.ObjectifyService
import de.voegtle.wunschmanager.util.assertOwnership
import de.voegtle.wunschmanager.util.duplicateUnusedWishes
import de.voegtle.wunschmanager.util.extractUserId
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.voegtle.wunschmanager.data.SharedWishList
import org.voegtle.wunschmanager.data.WishList
import java.util.Date
import jakarta.servlet.http.HttpServletRequest
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.oauth2.core.oidc.user.OidcUser

@RestController
class WishListService {
  @GetMapping("/wishlist/create")
  fun create(@RequestParam() event: String, @RequestParam() managed: Boolean, @AuthenticationPrincipal oidcUser: OidcUser?): WishList {
    val userName = extractUserId(oidcUser, true)

    val newWishList = WishList(event = event, owner = userName, managed = managed, createTimestamp = Date().time)
    ObjectifyService.ofy().save().entity(newWishList).now()
    return newWishList
  }

  @PostMapping("/wishlist/duplicate")
  fun duplicate(@RequestBody() wishList: WishList, @RequestParam() templateId: Long,
                @AuthenticationPrincipal oidcUser: OidcUser?): WishList {
    val userName = extractUserId(oidcUser, true)
    val template = ObjectifyService.ofy().load().type(WishList::class.java).id(templateId).now()
    assertOwnership(oidcUser, template, "You do not have the permission to copy this list.")

    val newWishList = WishList(event = wishList.event, owner = userName, managed = wishList.managed,
                               description = wishList.description, background = wishList.background,
                               createTimestamp = Date().time)
    ObjectifyService.ofy().save().entity(newWishList).now()

    val unusedWishes = duplicateUnusedWishes(template, newWishList)
    ObjectifyService.ofy().save().entities(unusedWishes).now()
    return newWishList
  }

  @GetMapping("/wishlist/get")
  fun get(@RequestParam() id: Long, req: HttpServletRequest): WishList = ObjectifyService.ofy().load().type(
      WishList::class.java).id(id).now()

  @PostMapping("/wishlist/update")
  fun update(@RequestBody() wishList: WishList, @AuthenticationPrincipal oidcUser: OidcUser?): WishList {
    val updateCandidate = ObjectifyService.ofy().load().type(WishList::class.java).id(wishList.id!!).now()

    assertOwnership(oidcUser, updateCandidate, "You do not have the permission to change the list.")

    updateCandidate.event = wishList.event
    updateCandidate.description = wishList.description
    updateCandidate.background = wishList.background
    ObjectifyService.ofy().save().entity(updateCandidate).now()

    return updateCandidate
  }

  @GetMapping("/wishlist/list")
  fun list(@AuthenticationPrincipal oidcUser: OidcUser?): List<WishList> {
    val userName = extractUserId(oidcUser, true)
    return ObjectifyService.ofy().load().type(WishList::class.java).filter("owner ==", userName)
        .order("createTimestamp").list()
  }

  @GetMapping("/wishlist/delete")
  fun delete(@RequestParam() id: Long, @AuthenticationPrincipal oidcUser: OidcUser?): Boolean {
    val deleteCandidate = ObjectifyService.ofy().load().type(WishList::class.java).id(id).now()

    assertOwnership(oidcUser, deleteCandidate, "You do not have the permission to delete the list.")

    ObjectifyService.ofy().delete().type(WishList::class.java).id(id).now()
    return true
  }


  @GetMapping("/wishlist/share")
  fun share(@RequestParam() id: Long, @AuthenticationPrincipal oidcUser: OidcUser?): List<WishList> {
    val result = ArrayList<WishList>()

    val userName = extractUserId(oidcUser, true)
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
  fun shared(@AuthenticationPrincipal oidcUser: OidcUser?): Collection<WishList> {
    val userName = extractUserId(oidcUser)

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
  fun unshare(@RequestParam() id: Long, @AuthenticationPrincipal oidcUser: OidcUser?): Boolean {
    val userName = extractUserId(oidcUser)
    val sharedLists = ObjectifyService.ofy().load().type(SharedWishList::class.java)
        .filter("sharedWith", userName).filter("wishListId", id).list()
    ObjectifyService.ofy().delete().entities(sharedLists).now()

    return !sharedLists.isEmpty()
  }
}
