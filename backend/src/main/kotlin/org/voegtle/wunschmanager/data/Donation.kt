package org.voegtle.wunschmanager.data

data class Donation (var donor: String? = null,
                     var proxyDonor: String? = null,
                     var organiser: Boolean = false,
                     var amount: Double = 0.0) {
  override fun equals(other: Any?): Boolean {
    return other != null && other is Donation && donor == other.donor
  }

  override fun hashCode(): Int {
    return donor?.hashCode() ?: 0
  }

  fun ensureDonor(userName: String) {
    if (donor.isNullOrEmpty()) {
      donor = userName
    } else {
      proxyDonor = userName
    }
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
      return -1 * o1.organiser.compareTo(o2.organiser)
    }

    val d1 = o1.donor
    val d2 = o2.donor

    if (d1 == d2) {
      return 0
    }
    if (d1 == null) {
      return -1
    }
    if (d2 == null) {
      return 1
    }

    return d1.compareTo(d2, ignoreCase = true)
  }
}
