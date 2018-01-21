package org.voegtle.wunschmanager.data

import com.fasterxml.jackson.annotation.JsonIgnore
import com.googlecode.objectify.Key
import com.googlecode.objectify.annotation.Entity
import com.googlecode.objectify.annotation.Id
import com.googlecode.objectify.annotation.Ignore
import com.googlecode.objectify.annotation.Index
import com.googlecode.objectify.annotation.Parent

@Entity class Wish(@Id var id: Long? = null,
                   @JsonIgnore @Parent var wishList: Key<WishList>? = null,
                   @Index var caption: String = "",
                   @Index var description: String = "",
                   var link: String? = null,
                   @Index var donor: String? = null,
                   @Index var createTimestamp: Long? = null,
                   var invisible: Boolean? = null)