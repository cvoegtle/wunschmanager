package de.voegtle.wunschmanager

import com.googlecode.objectify.Key
import com.googlecode.objectify.ObjectifyService
import de.voegtle.wunschmanager.util.PermissionDenied
import de.voegtle.wunschmanager.util.checkNotOwnership
import de.voegtle.wunschmanager.util.checkOwnership
import de.voegtle.wunschmanager.util.duplicateWishes
import de.voegtle.wunschmanager.util.extractUserName
import de.voegtle.wunschmanager.util.loadListOfWishes
import de.voegtle.wunschmanager.util.reduceWishList
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.voegtle.wunschmanager.data.UpdateRequest
import org.voegtle.wunschmanager.data.Wish
import org.voegtle.wunschmanager.data.WishCopyTask
import org.voegtle.wunschmanager.data.WishList
import java.util.Date
import javax.servlet.http.HttpServletRequest

@RestController() class WishService {
  @GetMapping("/wish/list") fun list(@RequestParam() list: Long, request: HttpServletRequest): List<Wish> {
    val wishList: WishList = ObjectifyService.ofy().load().type(WishList::class.java).id(list).now()

    val userName = extractUserName(request, false)

    return loadListOfWishes(wishList, userName)
  }

  @GetMapping("/wish/create") fun create(@RequestParam() list: Long, request: HttpServletRequest): Wish {
    val wishList: WishList = ObjectifyService.ofy().load().type(WishList::class.java).id(list).now()

    checkOwnership(request, wishList, "You must be the owner of the list to create new wishes")

    val newWish = Wish(wishList = Key.create(wishList), createTimestamp = Date().time)
    ObjectifyService.ofy().save().entity(newWish).now()
    return newWish
  }

  @PostMapping("/wish/update")
  fun update(@RequestBody() updateRequest: UpdateRequest, request: HttpServletRequest): Boolean {
    val wish = updateRequest.wish
    wish?.let {
      val wishList: WishList = ObjectifyService.ofy().load().type(WishList::class.java).id(updateRequest.listId!!).now()

      checkOwnership(request, wishList, "You must be the owner of the list to update a wishes")

      val existingWish = ObjectifyService.ofy().load().type(Wish::class.java).parent(wishList).id(it.id!!).now()
      existingWish.caption = it.caption
      existingWish.description = it.description
      existingWish.link = it.link
      existingWish.priority = it.priority
      existingWish.background = it.background
      existingWish.invisible = it.invisible
      ObjectifyService.ofy().save().entity(existingWish).now()
      return true
    }
    return false
  }

  @GetMapping("/wish/delete") fun delete(@RequestParam() listId: Long, @RequestParam() wishId: Long,
                                         request: HttpServletRequest): Boolean {
    val wishList: WishList = ObjectifyService.ofy().load().type(WishList::class.java).id(listId).now()

    checkOwnership(request, wishList, "You must be owner of the list to delete wishes")

    ObjectifyService.ofy().delete().type(Wish::class.java).parent(wishList).id(wishId).now()
    return true
  }

  @GetMapping("/wish/reserve") fun reserve(@RequestParam() listId: Long, @RequestParam() wishId: Long, request: HttpServletRequest): Wish {
    val userName = extractUserName(request, true)
    val wishList: WishList = ObjectifyService.ofy().load().type(WishList::class.java).id(listId).now()

    checkNotOwnership(userName, wishList, "You cannot make reservations to your own wishes");

    val existingWish = ObjectifyService.ofy().load().type(Wish::class.java).parent(wishList).id(wishId).now()

    when {
      existingWish.donor == null -> existingWish.donor = userName
      existingWish.donor == userName -> existingWish.donor = null;
      else -> throw PermissionDenied("This wish is reserved by ${existingWish.donor}")
    }

    ObjectifyService.ofy().save().entity(existingWish).now()
    return existingWish
  }

  @PostMapping("/wish/copy") fun copy(@RequestBody() copyTask: WishCopyTask, request: HttpServletRequest): List<Wish> {
    val wishList: WishList = ObjectifyService.ofy().load().type(WishList::class.java).id(copyTask.destinationListId).now()

    checkOwnership(request, wishList, "You must be owner of the list to add wishes")
    val userName = extractUserName(request, true)

    val newWishes = ArrayList<Wish>()
    copyTask.wishes.forEach {
      val wishes = ObjectifyService.ofy().load().type(Wish::class.java).parent(it.sourceListId).ids(it.wishIds)
      newWishes.addAll(duplicateWishes(wishes.values, wishList))
    }
    ObjectifyService.ofy().save().entities(newWishes).now()

    return loadListOfWishes(wishList, userName)
  }

}