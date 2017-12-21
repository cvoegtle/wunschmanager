package de.voegtle.wunschmanager

import com.googlecode.objectify.Key
import com.googlecode.objectify.ObjectifyService
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.voegtle.wunschmanager.data.Wish
import org.voegtle.wunschmanager.data.WishList

@RestController() class WishService {
  @CrossOrigin(origins =["*"] )
  @RequestMapping("/wish/list") fun list(@RequestParam() list: Long): List<Wish> {
    val tempList = ObjectifyService.ofy().load().type(Wish::class.java)
        .ancestor(Key.create(WishList::class.java, list)).list() as MutableList<Wish>
    return tempList
  }

  @CrossOrigin(origins =["*"] )
  @RequestMapping("/wish/create") fun createWish(@RequestParam() list: Long): Wish {
    val newWish = Wish(wishList = Key.create(WishList::class.java, list))
    ObjectifyService.ofy().save().entity(newWish).now()
    return newWish
  }

  @CrossOrigin(origins =["*"] )
  @RequestMapping("/wish/update") fun updateWish(@RequestParam() wish: Wish): Boolean {
    val existingWish = ObjectifyService.ofy().load().type(Wish::class.java).id(wish.id!!).now()

    existingWish.caption = wish.caption
    existingWish.description = wish.description
    existingWish.link = wish.link
    existingWish.available = wish.available
    ObjectifyService.ofy().save().entity(existingWish).now()

    return true
  }

  @CrossOrigin(origins =["*"] )
  @RequestMapping("/wish/delete") fun deleteWish(@RequestParam() id: Long): Boolean {
    ObjectifyService.ofy().delete().type(Wish::class.java).id(id)
    return true
  }

}