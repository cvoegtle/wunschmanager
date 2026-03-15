package de.voegtle.wunschmanager

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpStatus
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService
import org.springframework.security.oauth2.core.oidc.user.OidcUser
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.HttpStatusEntryPoint
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler
import org.springframework.security.web.util.matcher.RequestMatcher

@Configuration
@EnableWebSecurity
class SecurityConfig {

  @Bean
  fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
    CsrfTokenRequestAttributeHandler()
    http
      .authorizeHttpRequests { authorize ->
        authorize
          .requestMatchers("/",
                           "/error",
                           "/favicon.ico",
                           "/manifest.webapp",
                           "/please_login.html",
                           "/logged_out.html",
                           "/app/**",
                           "/user/status",
                           "/wishlist/get",
                           "/wishlist/shared",
                           "/wish/list",
                           "/image/upload",
                           "/image/delete",
                           "/image/rotate").permitAll()
          .anyRequest().authenticated() // Alle anderen Pfade erfordern Authentifizierung
      }
      .exceptionHandling { exception ->
        val apiEntryPoint = HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)

        val apiRequestMatcher = RequestMatcher { request ->
          val path = request.servletPath
          path.startsWith("/wish/") ||
          path.startsWith("/wishlist/") ||
          path.startsWith("/user/") ||
          path.startsWith("/image/") ||
          "XMLHttpRequest" == request.getHeader("X-Requested-With")
        }

        exception.defaultAuthenticationEntryPointFor(apiEntryPoint, apiRequestMatcher)
      }
      .oauth2Login { oauth2Login ->
        oauth2Login
          .loginPage("/oauth2/authorization/google")
//          .defaultSuccessUrl("http://localhost:4200/index.html", true)
          .defaultSuccessUrl("/app/index.html", true)
          .failureUrl("/please_login.html")
          .userInfoEndpoint { userInfo ->
            userInfo.oidcUserService(oidcUserService()) // Optional: Custom OidcUserService
          }
      }
      .csrf { csrf ->
        csrf.disable()
//        csrf.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
//          .csrfTokenRequestHandler(requestHandler)
//        withHttpOnlyFalse() ist wichtig, damit Angular das Cookie lesen kann.
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
