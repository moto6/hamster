package identity;

public record BookInventoryId (
        String id
){
    public static BookInventoryId create() {
        return new BookInventoryId("11111");
    }
}
