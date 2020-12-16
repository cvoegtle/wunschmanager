package de.voegtle.wunschmanager

import com.googlecode.objectify.Key
import com.googlecode.objectify.ObjectifyService
import de.voegtle.wunschmanager.util.PermissionDenied
import de.voegtle.wunschmanager.util.assertManagedOwnership
import de.voegtle.wunschmanager.util.assertNotEmpty
import de.voegtle.wunschmanager.util.assertNotOwnership
import de.voegtle.wunschmanager.util.assertOwnership
import de.voegtle.wunschmanager.util.duplicateWishes
import de.voegtle.wunschmanager.util.extractUserName
import de.voegtle.wunschmanager.util.loadFullListOfWishes
import de.voegtle.wunschmanager.util.loadReducedListOfWishes
import de.voegtle.wunschmanager.util.updatePriorities
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.voegtle.wunschmanager.data.UpdateOrderRequest
import org.voegtle.wunschmanager.data.UpdateRequest
import org.voegtle.wunschmanager.data.Wish
import org.voegtle.wunschmanager.data.WishCopyTask
import org.voegtle.wunschmanager.data.WishIds
import org.voegtle.wunschmanager.data.WishList
import java.util.Date
import javax.servlet.http.HttpServletRequest

@RestController() class WishService {
  @GetMapping("/wish/list") fun list(@RequestParam() list: Long, request: HttpServletRequest): List<Wish> {
    val wishList: WishList = ObjectifyService.ofy().load().type(WishList::class.java).id(list).now()

    val userName = extractUserName(request, false)

    return loadReducedListOfWishes(wishList, userName)
  }

  @GetMapping("/wish/create") fun create(@RequestParam() list: Long, request: HttpServletRequest): Wish {
    val wishList: WishList = ObjectifyService.ofy().load().type(WishList::class.java).id(list).now()

    assertOwnership(request, wishList, "You must be the owner of the list to create new wishes")

    val newWish = Wish(wishList = Key.create(wishList), createTimestamp = Date().time)
    saveWish(newWish)
    return newWish
  }

  @PostMapping("/wish/update")
  fun update(@RequestBody() updateRequest: UpdateRequest, request: HttpServletRequest): Boolean {
    val wish = updateRequest.wish
    wish?.let {
      val wishList: WishList = ObjectifyService.ofy().load().type(WishList::class.java).id(updateRequest.listId!!).now()

      assertOwnership(request, wishList, "You must be the owner of the list to update a wishes")

      val existingWish = loadWish(wishList, it.id!!)
      existingWish.caption = it.caption
      existingWish.description = it.description
      existingWish.link = it.link
      existingWish.priority = it.priority
      existingWish.background = it.background
      existingWish.invisible = it.invisible
      saveWish(existingWish)
      return true
    }
    return false
  }

  @PostMapping("/wish/update_order")
  fun update(@RequestBody() updateOrderRequest: UpdateOrderRequest, request: HttpServletRequest): Boolean {
    val wishList: WishList = ObjectifyService.ofy().load().type(WishList::class.java).id(updateOrderRequest.listId).now()

    assertOwnership(request, wishList, "You must be the owner of the list to update a wishes")

    val wishes = loadFullListOfWishes(wishList)
    updatePriorities(wishes, updateOrderRequest.wishOrders)
    ObjectifyService.ofy().save().entities(wishes).now()
    return true
  }


  @PostMapping("/wish/delete") fun delete(@RequestBody wishIds: WishIds, request: HttpServletRequest): Boolean {
    val wishList: WishList = ObjectifyService.ofy().load().type(WishList::class.java).id(wishIds.sourceListId).now()

    assertOwnership(request, wishList, "You must be owner of the list to delete wishes")

    ObjectifyService.ofy().delete().type(Wish::class.java).parent(wishList).ids(wishIds.wishIds).now()
    return true
  }

  @GetMapping("/wish/reserve") fun reserve(@RequestParam() listId: Long, @RequestParam() wishId: Long, request: HttpServletRequest): Wish {
    val userName = extractUserName(request, true)
    val wishList: WishList = ObjectifyService.ofy().load().type(WishList::class.java).id(listId).now()

    assertNotOwnership(userName, wishList, "You cannot make reservations to your own wishes")

    val existingWish = loadWish(wishList, wishId)

    when {
      existingWish.donor == null -> existingWish.donor = userName
      existingWish.donor == userName || existingWish.proxyDonor == userName -> existingWish.resetDonor()
      else -> throw PermissionDenied("This wish is reserved by ${existingWish.donor}")
    }

    saveWish(existingWish)
    return existingWish
  }

  @GetMapping("wish/proxy_reserve") fun proxyReserve(
    @RequestParam() listId: Long,
    @RequestParam() wishId: Long,
    @RequestParam() donor: String,
    request: HttpServletRequest
  ): Wish {
    val userName = extractUserName(request, true)
    val wishList: WishList = ObjectifyService.ofy().load().type(WishList::class.java).id(listId).now()

    assertManagedOwnership(userName, wishList, "You have to own the list and the list has to be a managed list")
    assertNotEmpty(donor, "The donor must not be empty")

    val existingWish = loadWish(wishList, wishId)

    when {
      existingWish.donor == null -> {
        existingWish.donor = donor
        existingWish.proxyDonor = userName
      }

      existingWish.proxyDonor == userName -> existingWish.resetDonor()

      else -> throw PermissionDenied("This wish is reserved by ${existingWish.donor}")
    }

    saveWish(existingWish)
    return existingWish
  }

  @PostMapping("/wish/copy") fun copy(@RequestBody() copyTask: WishCopyTask, request: HttpServletRequest): List<Wish> {
    val destinationList: WishList = ObjectifyService.ofy().load().type(WishList::class.java).id(copyTask.destinationListId).now()

    assertOwnership(request, destinationList, "You must be owner of the list to add wishes")
    val userName = extractUserName(request, true)

    val newWishes = ArrayList<Wish>()
    copyTask.wishes.forEach {
      val sourceList: WishList = ObjectifyService.ofy().load().type(WishList::class.java).id(it.sourceListId).now()
      val wishes = ObjectifyService.ofy().load().type(Wish::class.java).parent(sourceList).ids(it.wishIds)
      newWishes.addAll(duplicateWishes(wishes.values, destinationList))
    }
    ObjectifyService.ofy().save().entities(newWishes).now()

    return loadReducedListOfWishes(destinationList, userName)
  }

  private fun loadWish(wishList: WishList, wishId: Long) =
    ObjectifyService.ofy().load().type(Wish::class.java).parent(wishList).id(wishId).now()

  private fun saveWish(existingWish: Wish?) {
    ObjectifyService.ofy().save().entity(existingWish).now()
  }


}