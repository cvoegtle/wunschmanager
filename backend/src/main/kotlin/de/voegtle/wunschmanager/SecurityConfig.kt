package de.voegtle.wunschmanager

import com.google.cloud.Identity.user
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService
import org.springframework.security.oauth2.core.oidc.user.OidcUser
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.csrf.CookieCsrfTokenRepository
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler

@Configuration
@EnableWebSecurity
class SecurityConfig {

  @Bean
  fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
    CsrfTokenRequestAttributeHandler()
    http
      .authorizeHttpRequests { authorize ->
        authorize
          .requestMatchers("/please_login.html",
                           "/logged_out.html",
                           "/favicon.ico",
                           "/manifest.webapp",
                           "/user/status",
                           "/logout",
                           "/error",
                           "/view",
                           "/share",
                           "/wishlist/get",
                           "/wish/list").permitAll()
          .anyRequest().authenticated() // Alle anderen Pfade erfordern Authentifizierung
      }
      .oauth2Login { oauth2Login ->
        oauth2Login
          .loginPage("/oauth2/authorization/google")
//          .defaultSuccessUrl("http://localhost:4200/index.html", true)
          .defaultSuccessUrl("/index.html", true)
          .failureUrl("/please_login.html")
          .userInfoEndpoint { userInfo ->
            userInfo.oidcUserService(oidcUserService()) // Optional: Custom OidcUserService
          }
      }
      .csrf { csrf ->
        csrf.disable()
//        csrf.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
//          .csrfTokenRequestHandler(requestHandler)
        // withHttpOnlyFalse() ist wichtig, damit Angular das Cookie lesen kann.
      }
      .logout { logout ->
        logout
          .logoutSuccessUrl("/logged_out.html") // Wohin nach dem Logout?
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
