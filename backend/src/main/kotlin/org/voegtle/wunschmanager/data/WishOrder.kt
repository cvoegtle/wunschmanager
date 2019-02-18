package org.voegtle.wunschmanager.data

class WishOrder(val id: Long, val priority: Int)

fun findPriority(wishOrders: List<WishOrder>, id: Long): Int {
  val order = wishOrders.firstOrNull { wishOrder -> wishOrder.id == id }
  return order!!.priority
}
