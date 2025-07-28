package de.voegtle.wunschmanager

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.RequestMapping

/**
 * Dieser Controller leitet alle Anfragen, die zu Angular-Routen gehören,
 * an die index.html der Angular-Anwendung weiter.
 * Das ist notwendig, damit "Deep Linking" (direktes Aufrufen von URLs wie /app/view/123) funktioniert.
 */
@Controller
class ForwardingController {

  /**
   * Fängt alle Pfade unter /app/ ab, die keinen Punkt (also keine Dateiendung) enthalten.
   * Zusätzlich werden die spezifischen Pfade aus deiner alten .htaccess-Datei explizit behandelt.
   * Dies verhindert, dass API-Aufrufe oder Anfragen an statische Dateien (wie .js, .css) abgefangen werden.
   */
  @RequestMapping(
    value = [
      // Fängt die Wurzel der App ab
      "/app",
      "/app/",
      // Fängt alle bekannten Top-Level-Routen und deren Unterpfade ab
      "/app/view/**",
      "/app/edit/**",
      "/app/share/**"
    ]
  )
  fun forward(): String {
    // Leitet die Anfrage intern an die statische index.html weiter.
    // Die URL in der Browser-Adressleiste bleibt unverändert.
    return "forward:/app/index.html"
  }
}
