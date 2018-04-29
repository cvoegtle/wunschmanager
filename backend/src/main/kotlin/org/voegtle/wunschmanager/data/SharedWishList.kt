package org.voegtle.wunschmanager.data

import com.googlecode.objectify.annotation.Entity
import com.googlecode.objectify.annotation.Id
import com.googlecode.objectify.annotation.Index

@Entity
class SharedWishList(@Id var id: Long? = null, @Index var sharedWith: String? = null, @Index var wishListId: Long? = null)