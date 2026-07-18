package de.voegtle.wunschmanager

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@SpringBootApplication
class Application

@Configuration
class WebConfig : WebMvcConfigurer {
  override fun addResourceHandlers(registry: ResourceHandlerRegistry) {
    val blobstorePath = System.getenv("BLOBSTORE_EMULATOR_PATH")
    if (!blobstorePath.isNullOrBlank()) {
      val normalizedPath = if (blobstorePath.endsWith("/")) blobstorePath else "$blobstorePath/"
      registry.addResourceHandler("/uploads/**")
        .addResourceLocations("file:$normalizedPath")
    }
  }
}

fun main(args: Array<String>) {
  runApplication<Application>(*args)
}
