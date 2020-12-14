package org.voegtle.wunschmanager.data

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test


class WishTest {
  @Test fun creationTest() {
    val wish = Wish(id = 1, caption = "Test", description = "Test Test")
    assertEquals("Test", wish.caption)
  }
}