package com.iamcore.admin

import identity.AdminId
import name.EmailAddress

data class Admin(
    val adminId: AdminId,
    val name: String,
    val emailAddress: EmailAddress,
) {
}