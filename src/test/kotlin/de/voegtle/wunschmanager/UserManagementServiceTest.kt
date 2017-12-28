package de.voegtle.wunschmanager

import com.google.appengine.api.users.UserService
import org.junit.Assert.assertEquals
import org.junit.Before
import org.junit.Test
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito
import org.mockito.MockitoAnnotations
import javax.servlet.http.HttpServletRequest

class UserManagementServiceTest {
  @Mock val userService: UserService? = null
  @InjectMocks val userManagementService = UserManagementService()

  @Before fun init() {
    MockitoAnnotations.initMocks(this)
  }


  @Test fun checkStatus() {
    val request = Mockito.mock(HttpServletRequest::class.java)
    Mockito.`when`(request.scheme).thenReturn("https")
    Mockito.`when`(request.serverName).thenReturn("www.voegtle.org")
    Mockito.`when`(request.serverPort).thenReturn(8443)

    Mockito.`when`(userService!!.createLoginURL("/go")).thenReturn("/_ah/login/go")
    Mockito.`when`(userService!!.createLogoutURL("/go")).thenReturn("_ah/logout?/go")
    val userStatus = userManagementService.status("/go", request)
    assertEquals("https://www.voegtle.org:8443/_ah/login/go", userStatus.url)
  }

  @Test fun checkLocalise() {
    val request = Mockito.mock(HttpServletRequest::class.java)
    Mockito.`when`(request.scheme).thenReturn("https")
    Mockito.`when`(request.serverName).thenReturn("www.voegtle.org")
    Mockito.`when`(request.serverPort).thenReturn(8443)
    val localUrl = userManagementService.localise(req = request, url = "/go")
    assertEquals("https://www.voegtle.org:8443/go", localUrl)
  }
}