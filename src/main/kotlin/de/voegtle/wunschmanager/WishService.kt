package de.voegtle.wunschmanager

import com.googlecode.objectify.Key
import com.googlecode.objectify.ObjectifyService
import de.voegtle.wunschmanager.util.checkOwnership
import de.voegtle.wunschmanager.util.extractUserName
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.voegtle.wunschmanager.data.UpdateRequest
import org.voegtle.wunschmanager.data.Wish
import org.voegtle.wunschmanager.data.WishList
import javax.servlet.http.HttpServletRequest

@RestController() class WishService {
  @CrossOrigin(origins = ["*"])
  @RequestMapping("/wish/list") fun list(@RequestParam() list: Long, request: HttpServletRequest): List<Wish> {
    val wishList: WishList = ObjectifyService.ofy().load().type(WishList::class.java).id(list).now()

    val wishes = ObjectifyService.ofy().load().type(Wish::class.java).ancestor(wishList).list() as MutableList<Wish>
    val userName = extractUserName(request, true)
    if (userName == wishList.owner) {
      wishes.forEach { it.available = it.donor == null; it.donor = null }
    }
    return wishes
  }

  @CrossOrigin(origins = ["*"])
  @RequestMapping("/wish/create") fun create(@RequestParam() list: Long, request: HttpServletRequest): Wish {
    val wishList: WishList = ObjectifyService.ofy().load().type(WishList::class.java).id(list).now()

    checkOwnership(request, wishList, "You must be the owner of the list to create new wishes")

    val newWish = Wish(wishList = Key.create(wishList))
    ObjectifyService.ofy().save().entity(newWish).now()
    return newWish
  }

  @CrossOrigin(origins = ["*"])
  @RequestMapping("/wish/update", method = [RequestMethod.POST])
  fun update(@RequestBody() updateRequest: UpdateRequest, request: HttpServletRequest): Boolean {
    val wish = updateRequest.wish
    wish?.let {
      val wishList: WishList = ObjectifyService.ofy().load().type(WishList::class.java).id(updateRequest.listId!!).now()

      checkOwnership(request, wishList, "You must be the owner of the list to update a wishes")

      val existingWish = ObjectifyService.ofy().load().type(Wish::class.java).parent(wishList).id(it.id!!).now()
      existingWish.caption = it.caption
      existingWish.description = it.description
      existingWish.link = it.link
      ObjectifyService.ofy().save().entity(existingWish).now()
      return true
    }
    return false
  }

  @CrossOrigin(origins = ["*"])
  @RequestMapping("/wish/delete") fun delete(@RequestParam() listId: Long, @RequestParam() wishId: Long,
                                             request: HttpServletRequest): Boolean {
    val wishList: WishList = ObjectifyService.ofy().load().type(WishList::class.java).id(listId).now()

    checkOwnership(request, wishList, "You must be owner of the list to delete wishes")

    ObjectifyService.ofy().delete().type(Wish::class.java).parent(wishList).id(wishId).now()
    return true
  }

  @CrossOrigin(origins = ["*"])
  @RequestMapping("/wish/give") fun give(@RequestParam() listId: Long, @RequestParam() wishId: Long,
                                         request: HttpServletRequest): Boolean {
    val userName = extractUserName(request, true)

    val wishList: WishList = ObjectifyService.ofy().load().type(WishList::class.java).id(listId).now()
    val existingWish = ObjectifyService.ofy().load().type(Wish::class.java).parent(wishList).id(wishId).now()
    existingWish.donor = userName

    ObjectifyService.ofy().save().entity(existingWish).now()
    return true
  }


}