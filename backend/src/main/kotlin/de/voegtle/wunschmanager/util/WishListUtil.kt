package de.voegtle.wunschmanager.util

import com.googlecode.objectify.ObjectifyService
import org.voegtle.wunschmanager.data.Wish
import org.voegtle.wunschmanager.data.WishList

fun loadListOfWishes(wishList: WishList, userName: String?): MutableList<Wish> {
  val wishes = ObjectifyService.ofy().load().type(Wish::class.java).ancestor(wishList).order("createTimestamp").list() as MutableList<Wish>
  wishes.sort()

  return reduceWishList(userName, wishList, wishes)
}


fun reduceWishList(userName: String?, wishList: WishList, wishes: MutableList<Wish>): MutableList<Wish> {
  when (userName) {
    wishList.owner -> {
      if (!wishList.managed) {
        wishes.forEach { it.donor = null }
      }
    }

    null -> wishes.removeIf { it.invisible == true || it.donor != null }

    else -> wishes.removeIf { it.invisible == true }
  }
  return wishes
}

