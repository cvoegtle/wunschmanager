package org.voegtle.wunschmanager.data

import com.googlecode.objectify.annotation.Entity
import com.googlecode.objectify.annotation.Id
import com.googlecode.objectify.annotation.Index

@Entity
class WishList(@Id var id: Long? = null, @Index var owner: String? = null, @Index var event: String = "")