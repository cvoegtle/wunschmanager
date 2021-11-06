package de.voegtle.wunschmanager.util

import com.googlecode.objectify.Key
import com.googlecode.objectify.ObjectifyService
import org.voegtle.wunschmanager.data.Wish
import org.voegtle.wunschmanager.data.WishList
import org.voegtle.wunschmanager.data.WishOrder
import org.voegtle.wunschmanager.data.findPriority

fun duplicateUnusedWishes(sourceList: WishList, destination: WishList): List<Wish> {
  val wishes = ObjectifyService.ofy().load().type(Wish::class.java).ancestor(sourceList).list()
  return wishes.onEach { it.migrateDonor() }.filter { it.donations.isEmpty() }.map { it.copy(Key.create(destination))}.toList()
}

fun duplicateWishes(wishes: Collection<Wish> , destination: WishList): List<Wish> {
  return wishes.map { it.copy(Key.create(destination)) }.toList()
}

fun updatePriorities(wishes: MutableList<Wish>, wishOrders: List<WishOrder>) {
  wishes.forEach { it.priority = findPriority(wishOrders, it.id!!) }
}

