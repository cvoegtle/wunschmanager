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
import de.voegtle.wunschmanager.util.extractUserNameNotNull
import de.voegtle.wunschmanager.util.loadFullListOfWishes
import de.voegtle.wunschmanager.util.loadReducedListOfWishes
import de.voegtle.wunschmanager.util.updatePriorities
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.voegtle.wunschmanager.data.Donation
import org.voegtle.wunschmanager.data.ReserveRequest
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
      existingWish.groupGift = it.groupGift
      existingWish.estimatedPrice = it.estimatedPrice
      existingWish.suggestedParticipation = it.suggestedParticipation
      existingWish.description = it.description
      existingWish.link = it.link
      existingWish.alternatives = it.alternatives
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

  @PostMapping("/wish/reserve") fun reserve(
    @RequestParam() listId: Long,
    @RequestParam() wishId: Long,
    @RequestBody() reserveRequest: ReserveRequest,
    request: HttpServletRequest
  ): Wish {
    val userName = extractUserNameNotNull(request)
    val wishList: WishList = ObjectifyService.ofy().load().type(WishList::class.java).id(listId).now()

    assertNotOwnership(userName, wishList, "You cannot make reservations to your own wishes")

    val existingWish = loadWish(wishList, wishId)
    mergeGroupGiftInformation(existingWish, reserveRequest.wish)

    when {
      existingWish.isAvailable(userName) -> {
        reserveRequest.donation.donor = userName
        existingWish.addDonation(reserveRequest.donation)
      }
      existingWish.isReservedForMe(userName) -> {
        existingWish.removeDonation(userName)
        removeGroupInformationWithoutDonation(existingWish)
      }
      else -> throw PermissionDenied("This wish is reserved by ${existingWish.firstDonor()}")
    }

    saveWish(existingWish)
    return existingWish
  }

  @PostMapping("wish/proxy_reserve") fun proxyReserve(
    @RequestParam() listId: Long,
    @RequestParam() wishId: Long,
    @RequestBody() reserveRequest: ReserveRequest,
    request: HttpServletRequest
  ): Wish {
    val userName = extractUserNameNotNull(request)
    val wishList: WishList = ObjectifyService.ofy().load().type(WishList::class.java).id(listId).now()

    assertManagedOwnership(userName, wishList, "You have to own the list and the list has to be a managed list")
    assertNotEmpty(reserveRequest.donation.donor, "The donor must not be empty")

    val existingWish = loadWish(wishList, wishId)
    mergeGroupGiftInformation(existingWish, reserveRequest.wish)

    if (existingWish.isAvailable(userName)) {
      reserveRequest.donation.proxyDonor = userName
      existingWish.addDonation(reserveRequest.donation)
    } else {
      throw PermissionDenied("This wish is reserved by ${existingWish.firstDonor()}")
    }

    saveWish(existingWish)
    return existingWish
  }

  private fun mergeGroupGiftInformation(existingWish: Wish, clientWish: Wish?) {
    clientWish?.let {
      existingWish.groupGift = it.groupGift
      existingWish.estimatedPrice = it.estimatedPrice
      existingWish.suggestedParticipation = it.suggestedParticipation
    }
  }

  private fun removeGroupInformationWithoutDonation(existingWish: Wish) {
    if (existingWish.donations.isEmpty()) {
      existingWish.groupGift = false
      existingWish.estimatedPrice = null
      existingWish.suggestedParticipation = null
    }
  }

  @PostMapping("/wish/copy") fun copy(@RequestBody() copyTask: WishCopyTask, request: HttpServletRequest): List<Wish> {
    val destinationList: WishList = ObjectifyService.ofy().load().type(WishList::class.java).id(copyTask.destinationListId).now()

    assertOwnership(request, destinationList, "You must be owner of the list to add wishes")
    val userName = extractUserNameNotNull(request)

    val newWishes = ArrayList<Wish>()
    copyTask.wishes.forEach {
      val sourceList: WishList = ObjectifyService.ofy().load().type(WishList::class.java).id(it.sourceListId).now()
      val wishes = ObjectifyService.ofy().load().type(Wish::class.java).parent(sourceList).ids(it.wishIds)
      newWishes.addAll(duplicateWishes(wishes.values, destinationList))
    }
    ObjectifyService.ofy().save().entities(newWishes).now()

    return loadReducedListOfWishes(destinationList, userName)
  }

  private fun loadWish(wishList: WishList, wishId: Long): Wish {
    val wish = ObjectifyService.ofy().load().type(Wish::class.java).parent(wishList).id(wishId).now()
    wish.migrateDonor()
    return wish
  }

  private fun saveWish(existingWish: Wish?) {
    ObjectifyService.ofy().save().entity(existingWish).now()
  }
}
