package de.voegtle.wunschmanager.util

import com.googlecode.objectify.ObjectifyService
import org.voegtle.wunschmanager.data.Wish
import org.voegtle.wunschmanager.data.WishList

fun loadReducedListOfWishes(wishList: WishList, userName: String?): MutableList<Wish> {
  val wishes = loadFullListOfWishes(wishList)
  val reducedWishes = reduceWishList(userName, wishList, wishes)
  return addAffiliateTags(reducedWishes)
}

fun loadFullListOfWishes(wishList: WishList): MutableList<Wish> {
  val wishes = ObjectifyService.ofy().load().type(Wish::class.java).ancestor(wishList).order("createTimestamp").list() as MutableList<Wish>
  wishes.sort()
  wishes.stream().forEach { it.migrateDonor() }
  return wishes
}

fun reduceWishList(userName: String?, wishList: WishList, wishes: MutableList<Wish>): MutableList<Wish> {
  when (userName) {
    wishList.owner -> {
      if (!wishList.managed) {
        wishes.forEach { it.donations.clear() }
      }
    }

    null -> {
      wishes.removeIf { it.invisible == true }
      wishes.forEach {
        if (it.donations.isNotEmpty()) {
          it.replaceDonations("wunschmanager@voegtle.org")
        }
      }
    }

    else -> wishes.removeIf { it.invisible == true }
  }
  return wishes
}

fun addAffiliateTags(wishes: MutableList<Wish>): MutableList<Wish> {
 return AmazonAffiliateProgramm().processWishes(wishes)
}

