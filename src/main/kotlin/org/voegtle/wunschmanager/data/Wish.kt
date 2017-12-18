package org.voegtle.wunschmanager.data

import com.googlecode.objectify.annotation.Entity
import com.googlecode.objectify.annotation.Id

@Entity class Wish(@Id var id: Long? = null,
                   var caption: String,
                   var description: String,
                   var link: String? = null,
                   var available: Boolean = true)