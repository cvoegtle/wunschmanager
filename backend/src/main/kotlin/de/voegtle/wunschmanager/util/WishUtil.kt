package de.voegtle.wunschmanager.util

import com.googlecode.objectify.Key
import com.googlecode.objectify.ObjectifyService
import org.voegtle.wunschmanager.data.Wish
import org.voegtle.wunschmanager.data.WishList

fun duplicateUnusedWishes(sourceList: WishList, destination: WishList): List<Wish> {
  val wishes = ObjectifyService.ofy().load().type(Wish::class.java).ancestor(sourceList).list()
  return wishes.filter { wish -> wish.donor == null }.map { wish -> wish.copy(Key.create(destination))}.toList()
}

fun duplicateWishes(wishes: Collection<Wish> , destination: WishList): List<Wish> {
  return wishes.map { wish -> wish.copy(Key.create(destination)) }.toList()
}