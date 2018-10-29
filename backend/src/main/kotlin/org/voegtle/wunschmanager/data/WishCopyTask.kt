package org.voegtle.wunschmanager.data

class WishIds(val sourceListId: Long, val wishIds: List<Long>)
class WishCopyTask(val destinationListId: Long, val wishes: ArrayList<WishIds>)