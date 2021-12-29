package de.voegtle.wunschmanager.util

import org.voegtle.wunschmanager.data.Wish

class AmazonAffiliateProgramm {
  val AMAZON_URL_PREFIX = "https://www.amazon.de/"
  val AMAZON_WUNSCHMANAGER_TAG = "&tag=wunschmanager-21"

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

}
