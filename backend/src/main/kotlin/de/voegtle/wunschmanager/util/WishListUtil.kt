package de.voegtle.wunschmanager.util

import com.googlecode.objectify.ObjectifyService
import org.voegtle.wunschmanager.data.Wish
import org.voegtle.wunschmanager.data.WishList

fun loadReducedListOfWishes(wishList: WishList, userName: String?): MutableList<Wish> {
   val wishes = loadFullListOfWishes(wishList)
  return reduceWishList(userName, wishList, wishes)
}

fun loadFullListOfWishes(wishList: WishList): MutableList<Wish> {
  val wishes = ObjectifyService.ofy().load().type(Wish::class.java).ancestor(wishList).order("createTimestamp").list() as MutableList<Wish>
  wishes.sort()
  return wishes
}


fun reduceWishList(userName: String?, wishList: WishList, wishes: MutableList<Wish>): MutableList<Wish> {
  when (userName) {
    wishList.owner -> {
      if (!wishList.managed) {
        wishes.forEach { it.donor = null }
      }
    }

    else -> wishes.removeIf { it.invisible == true }
  }
  return wishes
}

