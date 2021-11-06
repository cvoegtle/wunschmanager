package org.voegtle.wunschmanager.data

data class Donation (var donor: String = "",
                     var proxyDonor: String? = null,
                     var organiser: Boolean = true,
                     var amount: Double = 0.0) {
  override fun equals(other: Any?): Boolean {
    return other != null && other is Donation && donor == other.donor
  }

  override fun hashCode(): Int {
    return donor.hashCode()
  }
}

class DonationComparator : Comparator<Donation> {
  /**
   * zuerst der Organisator, danach nach
   * donor
   **/
  override fun compare(o1: Donation?, o2: Donation?): Int {
    if (o1 == o2) {
      return 0
    }
    if (o1 == null) {
      return -1
    }
    if (o2 == null) {
      return 1
    }
    if (o1.organiser != o2.organiser) {
      return o1.organiser.compareTo(o2.organiser)
    }
    return o1.donor.compareTo(o2.donor)
  }
}

