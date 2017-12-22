package de.voegtle.wunschmanager

import com.googlecode.objectify.Key
import com.googlecode.objectify.ObjectifyService
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.voegtle.wunschmanager.data.UpdateRequest
import org.voegtle.wunschmanager.data.Wish
import org.voegtle.wunschmanager.data.WishList

@RestController() class WishService {
  @CrossOrigin(origins = ["*"])
  @RequestMapping("/wish/list") fun list(@RequestParam() list: Long): List<Wish> {
    val tempList = ObjectifyService.ofy().load().type(Wish::class.java)
        .ancestor(Key.create(WishList::class.java, list)).list() as MutableList<Wish>
    return tempList
  }

  @CrossOrigin(origins = ["*"])
  @RequestMapping("/wish/create") fun create(@RequestParam() list: Long): Wish {
    val newWish = Wish(wishList = Key.create(WishList::class.java, list))
    ObjectifyService.ofy().save().entity(newWish).now()
    return newWish
  }

  @CrossOrigin(origins = ["*"])
  @RequestMapping("/wish/update", method = [RequestMethod.POST])
  fun update(@RequestBody() updateRequest: UpdateRequest): Boolean {
    val wish = updateRequest.wish
    wish?.let {
      val wishList: WishList = ObjectifyService.ofy().load().type(WishList::class.java).id(updateRequest.listId!!).now()
      val existingWish = ObjectifyService.ofy().load().type(Wish::class.java).parent(wishList).id(it.id!!).now()
      existingWish.caption = it.caption
      existingWish.description = it.description
      existingWish.link = it.link
      existingWish.available = it.available
      ObjectifyService.ofy().save().entity(existingWish).now()
      return true
    }
    return false
  }

  @CrossOrigin(origins = ["*"])
  @RequestMapping("/wish/delete") fun delete(@RequestParam() listId: Long, @RequestParam() wishId: Long): Boolean {
    val wishList: WishList = ObjectifyService.ofy().load().type(WishList::class.java).id(listId).now()
    ObjectifyService.ofy().delete().type(Wish::class.java).parent(wishList).id(wishId).now()
    return true
  }

}