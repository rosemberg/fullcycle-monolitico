import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "./invoice.entity";
import InvoiceItem from "./invoice-item.entity";

describe("Invoice entity", () => {
  it("should calculate total", () => {
    const item1 = new InvoiceItem({
      id: new Id("1"),
      name: "Item 1",
      price: 100,
    });

    const item2 = new InvoiceItem({
      id: new Id("2"),
      name: "Item 2",
      price: 200,
    });

    const address = new Address(
      "Street",
      "123",
      "Complement",
      "City",
      "State",
      "12345"
    );

    const invoice = new Invoice({
      id: new Id("1"),
      name: "Invoice 1",
      document: "Document 1",
      address: address,
      items: [item1, item2],
    });

    expect(invoice.total()).toBe(300);
  });
});