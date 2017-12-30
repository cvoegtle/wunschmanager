package org.voegtle.wunschmanager.data

import org.junit.Assert
import org.junit.Test

class WishTest {
  @Test fun creationTest() {
    val wish = Wish(id = 1, caption = "Test", description = "Test Test")
    Assert.assertEquals(null, wish.available)
    Assert.assertEquals("Test", wish.caption)
  }
}