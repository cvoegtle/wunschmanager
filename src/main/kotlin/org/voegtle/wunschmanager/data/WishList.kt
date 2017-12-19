package org.voegtle.wunschmanager.data

import com.googlecode.objectify.annotation.Entity
import com.googlecode.objectify.annotation.Id

@Entity
class WishList(@Id var id: Long? = null, var event: String = "")