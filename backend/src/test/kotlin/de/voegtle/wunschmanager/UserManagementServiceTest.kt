package de.voegtle.wunschmanager

import com.google.appengine.api.users.UserService
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito
import org.mockito.MockitoAnnotations
import javax.servlet.http.HttpServletRequest

class UserManagementServiceTest {
  @Mock val userService: UserService? = null
  @InjectMocks val userManagementService = UserManagementService()

  @BeforeEach fun init() {
    MockitoAnnotations.openMocks(this)
  }


  @Test fun checkStatus() {
    val request = Mockito.mock(HttpServletRequest::class.java)
    Mockito.`when`(request.scheme).thenReturn("https")
    Mockito.`when`(request.serverName).thenReturn("www.voegtle.org")
    Mockito.`when`(request.serverPort).thenReturn(8443)

    Mockito.`when`(userService!!.createLoginURL("/go")).thenReturn("/_ah/login/go")
    Mockito.`when`(userService.createLogoutURL("/go")).thenReturn("_ah/logout?/go")
    val userStatus = userManagementService.status("/go", request)
    assertEquals("/_ah/login/go", userStatus.url)
  }

  @Test fun checkLocaliseGlobal() {
    val request = Mockito.mock(HttpServletRequest::class.java)
    Mockito.`when`(request.scheme).thenReturn("https")
    Mockito.`when`(request.serverName).thenReturn("www.voegtle.org")
    Mockito.`when`(request.serverPort).thenReturn(8443)
    val localUrl = userManagementService.localise(req = request, url = "/go")
    assertEquals("/go", localUrl)
  }

  @Test fun checkLocaliseLocalhost() {
    val request = Mockito.mock(HttpServletRequest::class.java)
    Mockito.`when`(request.scheme).thenReturn("https")
    Mockito.`when`(request.serverName).thenReturn("localhost")
    Mockito.`when`(request.serverPort).thenReturn(8443)
    val localUrl = userManagementService.localise(req = request, url = "/go")
    assertEquals("https://localhost:8443/go", localUrl)
  }
}