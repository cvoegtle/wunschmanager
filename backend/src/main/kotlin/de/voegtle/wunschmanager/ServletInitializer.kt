package de.voegtle.wunschmanager

import com.google.cloud.NoCredentials
import com.google.cloud.datastore.DatastoreOptions
import com.googlecode.objectify.ObjectifyFactory
import com.googlecode.objectify.ObjectifyService
import jakarta.servlet.ServletContextEvent
import jakarta.servlet.ServletContextListener
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import org.voegtle.wunschmanager.data.SharedWishList
import org.voegtle.wunschmanager.data.Wish
import org.voegtle.wunschmanager.data.WishList


@Component // Make it a Spring-managed bean
class MyServletContextListener : ServletContextListener {

  // Verwende einen Logger statt println für bessere Kontrolle und Formatierung
  private val logger = LoggerFactory.getLogger(MyServletContextListener::class.java)

  override fun contextInitialized(sce: ServletContextEvent) {
    val datastoreOptionsBuilder = DatastoreOptions.newBuilder()
    val emulatorHost = System.getenv("DATASTORE_EMULATOR_HOST")

    if (emulatorHost != null && emulatorHost.isNotBlank()) {
      logger.info("DATASTORE_EMULATOR_HOST ist gesetzt auf: {}. Konfiguriere Objectify explizit für den Emulator.", emulatorHost)
      datastoreOptionsBuilder.setHost(emulatorHost)
      datastoreOptionsBuilder.setCredentials(NoCredentials.getInstance())
    } else {
      logger.warn("DATASTORE_EMULATOR_HOST ist NICHT gesetzt. Die Anwendung wird versuchen, sich mit dem Live-Dienst zu verbinden.")
    }
    val datastore = datastoreOptionsBuilder.build().service
    ObjectifyService.init(ObjectifyFactory(datastore))

    ObjectifyService.register(Wish::class.java)
    ObjectifyService.register(WishList::class.java)
    ObjectifyService.register(SharedWishList::class.java)
  }
}
