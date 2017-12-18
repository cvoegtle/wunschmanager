package de.voegtle.wunschmanager

import org.springframework.boot.builder.SpringApplicationBuilder
import org.springframework.boot.web.support.SpringBootServletInitializer
import com.googlecode.objectify.ObjectifyService
import org.voegtle.wunschmanager.data.Wish


class ServletInitializer : SpringBootServletInitializer() {
  override fun configure(builder: SpringApplicationBuilder): SpringApplicationBuilder {
    ObjectifyService.register(Wish::class.java)
    return builder.sources(Application::class.java)
  }
}