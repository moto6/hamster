package com.iamcore.user

import identity.UserId
import name.EmailAddress

class User(
    val userId: UserId,
    val name: String,
    val emailAddress: EmailAddress,
)