package org.voegtle.wunschmanager.data

import com.fasterxml.jackson.annotation.JsonIgnore
import com.googlecode.objectify.Key
import com.googlecode.objectify.annotation.Entity
import com.googlecode.objectify.annotation.Id
import com.googlecode.objectify.annotation.Index
import com.googlecode.objectify.annotation.Parent
import java.util.Date

@Entity class Wish(@Id var id: Long? = null,
                   @JsonIgnore @Parent var wishList: Key<WishList>? = null,
                   @Index var caption: String = "",
                   @Index var description: String = "",
                   var link: String? = null,
                   @Index var donor: String? = null,
                   @Index var createTimestamp: Long = 0,
                   @Index var priority: Int = 5,
                   var background: Color? = null,
                   var invisible: Boolean? = null) : Comparable<Wish> {
  override fun compareTo(other: Wish): Int {
    if (this.priority == other.priority) {
      return this.createTimestamp.compareTo(other.createTimestamp)
    }
    return -1 * this.priority.compareTo(other.priority)
  }

  fun copy(wishlistKey: Key<WishList>, donor: String? = null): Wish = Wish(wishList = wishlistKey, caption = this.caption,
                                                    description = this.description, link = this.link,
                                                    donor = donor, createTimestamp = Date().time,
                                                    priority = this.priority, background = this.background,
                                                    invisible = this.invisible)
}