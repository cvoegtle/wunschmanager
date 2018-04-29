package org.voegtle.wunschmanager.data

import com.googlecode.objectify.annotation.Entity
import com.googlecode.objectify.annotation.Id

@Entity class User(@Id var email: String? = null, var firstname: String? = null,
                   var familyname: String? = null)