package de.voegtle.wunschmanager

import org.springframework.boot.builder.SpringApplicationBuilder
import org.springframework.boot.web.support.SpringBootServletInitializer
import com.googlecode.objectify.ObjectifyService
import org.voegtle.wunschmanager.data.SharedWishList
import org.voegtle.wunschmanager.data.Wish
import org.voegtle.wunschmanager.data.WishList


class ServletInitializer : SpringBootServletInitializer() {
  override fun configure(builder: SpringApplicationBuilder): SpringApplicationBuilder {
    ObjectifyService.register(Wish::class.java)
    ObjectifyService.register(WishList::class.java)
    ObjectifyService.register(SharedWishList::class.java)
    return builder.sources(Application::class.java)
  }
}