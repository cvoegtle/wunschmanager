package org.voegtle.wunschmanager.data

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test


class WishTest {
  @Test fun creationTest() {
    val wish = Wish(id = 1, caption = "Test", description = "Test Test")
    assertEquals("Test", wish.caption)
  }

  @Test fun deserializationTest() {
    val json = """
      {
        "donations": [
          {
            "amount": 300,
            "donor": "Mama",
            "organiser": true,
            "proxyDonor": "cvoegtle@gmail.com"
          },
          {
            "amount": 100
          }
        ],
        "wish": {
          "caption": "Test",
          "estimatedPrice": 3000,
          "groupGift": true,
          "id": 4644337115725824,
          "suggestedParticipation": 100
        }
      }
    """.trimIndent()
    val mapper = com.fasterxml.jackson.databind.ObjectMapper().registerModule(com.fasterxml.jackson.module.kotlin.KotlinModule.Builder().build())
    val request = mapper.readValue(json, ProxyReserveRequest::class.java)
    assertEquals(2, request.donations.size)
    assertEquals(300.0, request.donations[0].amount)
    assertEquals("Mama", request.donations[0].donor)
    assertEquals(100.0, request.donations[1].amount)
    assertEquals(null, request.donations[1].donor)
  }
}
