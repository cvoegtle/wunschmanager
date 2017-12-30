package org.voegtle.wunschmanager.data

import com.googlecode.objectify.annotation.Id

class SharedWishList (@Id var id: Long? = null, var sharedWith: String? = null, var wishListId: Long? = null )