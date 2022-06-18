package de.voegtle.wunschmanager.util

import org.voegtle.wunschmanager.data.Wish

class AmazonAffiliateProgramm {

  fun processWishes(wishes: MutableList<Wish>): MutableList<Wish> {
    wishes.filter { hasAmazonLink(it) }.forEach { addAffiliateTag(it) }
    return wishes
  }

  private fun hasAmazonLink(wish: Wish): Boolean {
    val link = wish.link?:""
    return link.startsWith(AMAZON_URL_PREFIX)
  }

  private fun addAffiliateTag(wish: Wish) {
    wish.link += AMAZON_WUNSCHMANAGER_TAG
  }

  companion object {
    const val AMAZON_URL_PREFIX = "https://www.amazon.de/"
    const val AMAZON_WUNSCHMANAGER_TAG = ""  // Disable Affiliate Programm "&tag=wunschmanager-21"
  }

}
