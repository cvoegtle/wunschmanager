package de.voegtle.wunschmanager

import com.googlecode.objectify.ObjectifyService
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.voegtle.wunschmanager.data.WishList

@RestController
class WishListService {
  @CrossOrigin(origins = ["*"])
  @RequestMapping("/wishlist/create")
  fun create(@RequestParam() event: String): WishList {
    val newWishList = WishList(event = event)
    ObjectifyService.ofy().save().entity(newWishList).now()
    return newWishList
  }

  @CrossOrigin(origins = ["*"])
  @RequestMapping("/wishlist/list")
  fun list(): List<WishList> {
    return ObjectifyService.ofy().load().type(WishList::class.java).list()
  }

  @CrossOrigin(origins = ["*"])
  @RequestMapping("/wishlist/delete")
  fun delete(@RequestParam() id: Long): Boolean {
    ObjectifyService.ofy().delete().type(WishList::class.java).id(id).now()
    return true
  }


}