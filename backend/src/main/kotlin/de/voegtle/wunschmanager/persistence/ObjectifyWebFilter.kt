package de.voegtle.wunschmanager.persistence

import com.googlecode.objectify.ObjectifyService
import jakarta.servlet.Filter
import jakarta.servlet.FilterChain
import jakarta.servlet.FilterConfig
import jakarta.servlet.ServletException
import jakarta.servlet.ServletRequest
import jakarta.servlet.ServletResponse
import jakarta.servlet.annotation.WebFilter
import org.springframework.core.annotation.Order
import org.springframework.stereotype.Component
import java.io.IOException

@Component
@Order(1)
class ObjectifyWebFilter: Filter {
  @Throws(IOException::class, ServletException::class)
  override fun doFilter(request: ServletRequest?, response: ServletResponse?, chain: FilterChain) {
    val closeable = ObjectifyService.begin()

    try {
      chain.doFilter(request, response)
    } catch (var8: Throwable) {
      if (closeable != null) {
        try {
          closeable.close()
        } catch (var7: Throwable) {
          var8.addSuppressed(var7)
        }
      }

      throw var8
    }

    closeable?.close()
  }

  @Throws(ServletException::class)
  override fun init(filterConfig: FilterConfig?) {
  }

  override fun destroy() {
  }
}
