package com.hamsterapi.auth.support

/** roles 컬럼은 CSV("USER,SUPER_ADMIN") 로 저장한다. R2DBC 라 AttributeConverter 대신 여기서 변환. */
fun String?.toRoleList(): List<String> =
    this?.split(",")?.map { it.trim() }?.filter { it.isNotBlank() } ?: emptyList()

fun List<String>.toRoleCsv(): String = this.distinct().joinToString(",")
