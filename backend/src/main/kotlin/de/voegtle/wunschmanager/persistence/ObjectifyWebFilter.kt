package de.voegtle.wunschmanager.persistence

import com.googlecode.objectify.ObjectifyFilter
import javax.servlet.annotation.WebFilter

@WebFilter(urlPatterns = ["/*"])
class ObjectifyWebFilter: ObjectifyFilter()