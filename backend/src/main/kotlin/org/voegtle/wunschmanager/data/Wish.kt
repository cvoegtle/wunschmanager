package org.voegtle.wunschmanager.data

import com.fasterxml.jackson.annotation.JsonIgnore
import com.googlecode.objectify.Key
import com.googlecode.objectify.annotation.Entity
import com.googlecode.objectify.annotation.Id
import com.googlecode.objectify.annotation.Index
import com.googlecode.objectify.annotation.Parent
import java.util.Date
import java.util.TreeSet

@Entity class Wish(@Id var id: Long? = null,
                   @JsonIgnore @Parent var wishList: Key<WishList>? = null,
                   @Index var caption: String = "",
                   var groupGift: Boolean = false,
                   var estimatedPrice: Double? = null,
                   var suggestedParticipation: Double? = null,
                   @Index var description: String = "",
                   var link: String? = null,
                   var alternatives: List<Alternative> = ArrayList(),
                   @Index var donor: String? = null,
                   @Index var proxyDonor: String? = null,
                   @Index var createTimestamp: Long = 0,
                   @Index var priority: Int = 0,
                   var background: Color? = null,
                   var invisible: Boolean? = null,
                   var donations: TreeSet<Donation> = TreeSet(DonationComparator())
) : Comparable<Wish> {

  override fun compareTo(other: Wish): Int {
    if (this.priority == other.priority) {
      return this.createTimestamp.compareTo(other.createTimestamp)
    }
    return -1 * this.priority.compareTo(other.priority)
  }

  fun copy(wishlistKey: Key<WishList>): Wish = Wish(wishList = wishlistKey, caption = this.caption,
                                                    groupGift = this.groupGift, estimatedPrice= this.estimatedPrice,
                                                    suggestedParticipation = this.suggestedParticipation,
                                                    description = this.description,
                                                    link = this.link,
                                                    alternatives = this.alternatives.map { it }.toList(),
                                                    createTimestamp = Date().time,
                                                    priority = this.priority, background = this.background,
                                                    invisible = this.invisible)

  fun removeDonation(donor: String) {
    donations.removeIf { it.donor == donor || it.proxyDonor == donor }
  }

  fun isAvailable(userName: String) = donations.isEmpty() || (groupGift && !isReservedForMe(userName))

  fun isReservedForMe(userName: String) = donations.stream().anyMatch {  userName == it.donor || userName == it.proxyDonor }

  fun addDonation(donor: String, proxyDonor: String? = null) {
    addDonation(Donation(donor, proxyDonor))
  }

  fun addDonation(donation: Donation) {
    donations.add(donation)
  }

  fun firstDonor() = donations.first()!!.donor

  fun migrateDonor() {
    donor?.let {
      addDonation(it, proxyDonor)
      donor = null
      proxyDonor = null
    }
  }

  fun replaceDonations(replacementDonor: String) {
    donations.clear()
    addDonation(replacementDonor)
  }

}
