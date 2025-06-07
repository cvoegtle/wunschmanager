package de.voegtle.wunschmanager

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService
import org.springframework.security.oauth2.core.oidc.user.OidcUser
import org.springframework.security.web.SecurityFilterChain

@Configuration
@EnableWebSecurity
class SecurityConfig {

  @Bean
  fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
    http
      .authorizeHttpRequests { authorize ->
        authorize
          .requestMatchers("/", "/index.html", "/favicon.png", "/user/status", "/error").permitAll() // Öffentliche Pfade
          .anyRequest().authenticated() // Alle anderen Pfade erfordern Authentifizierung
      }
      .oauth2Login { oauth2Login ->
        oauth2Login
          .loginPage("/oauth2/authorization/google") // Optional: Wenn du einen eigenen Login-Link hast, der hierhin zeigt
          .defaultSuccessUrl("/edit", true) // Wohin nach erfolgreichem Login?
          .failureUrl("/") // Wohin bei fehlgeschlagenem Login?
          .userInfoEndpoint { userInfo ->
            userInfo.oidcUserService(oidcUserService()) // Optional: Custom OidcUserService
          }            }
      .logout { logout ->
        logout
          .logoutSuccessUrl("/") // Wohin nach dem Logout?
          .invalidateHttpSession(true)
          .clearAuthentication(true)
          .deleteCookies("JSESSIONID") // Ggf. weitere Cookies löschen
      }
    return http.build()
  }

  @Bean
  fun oidcUserService(): OAuth2UserService<OidcUserRequest, OidcUser> {
    val delegate = OidcUserService()
    return OAuth2UserService { userRequest: OidcUserRequest ->
      var oidcUser = delegate.loadUser(userRequest)
      // Hier könntest du den Nutzer in deiner Datenbank speichern oder aktualisieren
      // basierend auf oidcUser.getAttributes() oder oidcUser.getIdToken()
      // z.B. userRepository.findByGoogleId(oidcUser.subject)?.apply { ... } ?: userRepository.save(...)
      oidcUser
    }
  }
}
