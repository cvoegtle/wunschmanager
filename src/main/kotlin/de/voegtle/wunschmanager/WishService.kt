package de.voegtle.wunschmanager

import com.googlecode.objectify.Key
import com.googlecode.objectify.ObjectifyService
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.voegtle.wunschmanager.data.Wish
import org.voegtle.wunschmanager.data.WishList

@RestController() class WishService {
  @RequestMapping("/wish/list") fun list(@RequestParam() list: Long): List<Wish> {
    val tempList = ObjectifyService.ofy().load().type(Wish::class.java)
        .ancestor(Key.create(WishList::class.java, list)).list() as MutableList<Wish>
    return tempList
  }

  @RequestMapping("/wish/create") fun createWish(@RequestParam() list: Long): Wish {
    val newWish = Wish(wishList = Key.create(WishList::class.java, list), caption = "Philips Hue",
                       description = "Immer schön hell")
    ObjectifyService.ofy().save().entity(newWish).now()
    return newWish
  }

  @RequestMapping("/wishlist/create") fun createList(@RequestParam(name = "event") event: String): WishList {
    val newWishList = WishList(event = event)
    ObjectifyService.ofy().save().entity(newWishList).now()
    return newWishList
  }

  @RequestMapping("/wishlist/list") fun listList(): List<WishList> {
    val tempList = ObjectifyService.ofy().load().type(WishList::class.java).list() as MutableList<WishList>
    return tempList
  }


}