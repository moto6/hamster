package identity;

import java.util.UUID;

public record UserId(
        String id
) {

    public UserId {
        if (id == null || id.isBlank()) {
            throw new IllegalArgumentException("UserId must not be null or blank");
        }
    }

    public static UserId generate() {
        return new UserId(UUID.randomUUID().toString());
    }
}
