package de.voegtle.wunschmanager

import com.googlecode.objectify.ObjectifyService
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.voegtle.wunschmanager.data.Wish

@RestController() class WishService {
  @RequestMapping("/wish/list") fun list() : List<Wish> {
    val result = ArrayList<Wish>()
    val tempList = ObjectifyService.ofy().load().list() as MutableList<Wish>
    for (wish in tempList) {
      result.add(wish)
    }
     return  result
  }

  @RequestMapping("/wish/create") fun create(): Wish {
    val newWish = Wish(caption = "Rennauto", description = "Ferngesteuertes Auto, das sich überschlägt")
    ObjectifyService.ofy().save().entity(newWish).now()
    return newWish
  }
}