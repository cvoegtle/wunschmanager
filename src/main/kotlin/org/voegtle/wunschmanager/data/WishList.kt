package org.voegtle.wunschmanager.data

import com.googlecode.objectify.annotation.Entity
import com.googlecode.objectify.annotation.Id
import com.googlecode.objectify.annotation.Index
import java.util.Date

@Entity
class WishList(@Id var id: Long? = null, @Index var owner: String? = null, @Index var event: String = "",
               var managed: Boolean = false, @Index var createTimestamp: Long? = null) : Comparable<WishList> {
  override fun compareTo(other: WishList): Int {
    return when {
      createTimestamp?:0 < other.createTimestamp?:0 -> -1
      createTimestamp?:0 > other.createTimestamp?:0 -> 1
      else -> 0
    }
  }

}