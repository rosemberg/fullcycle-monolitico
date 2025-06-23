import { Sequelize } from "sequelize-typescript";
import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice.entity";
import InvoiceItem from "../domain/invoice-item.entity";
import { InvoiceItemModel } from "./invoice-item.model";
import { InvoiceModel } from "./invoice.model";
import InvoiceRepository from "./invoice.repository";

describe("Invoice Repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([InvoiceModel, InvoiceItemModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should generate an invoice", async () => {
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

    const invoice = new Invoice({
      id: new Id("1"),
      name: "Invoice 1",
      document: "Document 1",
      address: new Address(
        "Street 1",
        "123",
        "Complement 1",
        "City 1",
        "State 1",
        "12345"
      ),
      items: [item1, item2],
    });

    const repository = new InvoiceRepository();
    await repository.generate(invoice);

    const invoiceDb = await InvoiceModel.findOne({
      where: { id: "1" },
      include: [InvoiceItemModel],
    });

    expect(invoiceDb).toBeDefined();
    expect(invoiceDb.id).toEqual(invoice.id.id);
    expect(invoiceDb.name).toEqual(invoice.name);
    expect(invoiceDb.document).toEqual(invoice.document);
    expect(invoiceDb.street).toEqual(invoice.address.street);
    expect(invoiceDb.number).toEqual(invoice.address.number);
    expect(invoiceDb.complement).toEqual(invoice.address.complement);
    expect(invoiceDb.city).toEqual(invoice.address.city);
    expect(invoiceDb.state).toEqual(invoice.address.state);
    expect(invoiceDb.zipcode).toEqual(invoice.address.zipCode);
    expect(invoiceDb.items.length).toBe(2);
    expect(invoiceDb.items[0].id).toEqual(item1.id.id);
    expect(invoiceDb.items[0].name).toEqual(item1.name);
    expect(invoiceDb.items[0].price).toEqual(item1.price);
    expect(invoiceDb.items[1].id).toEqual(item2.id.id);
    expect(invoiceDb.items[1].name).toEqual(item2.name);
    expect(invoiceDb.items[1].price).toEqual(item2.price);
  });

  it("should find an invoice", async () => {
    const invoice = await InvoiceModel.create(
      {
        id: "1",
        name: "Invoice 1",
        document: "Document 1",
        street: "Street 1",
        number: "123",
        complement: "Complement 1",
        city: "City 1",
        state: "State 1",
        zipcode: "12345",
        createdAt: new Date(),
        updatedAt: new Date(),
        items: [
          {
            id: "1",
            name: "Item 1",
            price: 100,
            invoice_id: "1",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: "2",
            name: "Item 2",
            price: 200,
            invoice_id: "1",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      },
      {
        include: [{ model: InvoiceItemModel }],
      }
    );

    const repository = new InvoiceRepository();
    const result = await repository.find(invoice.id);

    expect(result.id.id).toEqual(invoice.id);
    expect(result.name).toEqual(invoice.name);
    expect(result.document).toEqual(invoice.document);
    expect(result.address.street).toEqual(invoice.street);
    expect(result.address.number).toEqual(invoice.number);
    expect(result.address.complement).toEqual(invoice.complement);
    expect(result.address.city).toEqual(invoice.city);
    expect(result.address.state).toEqual(invoice.state);
    expect(result.address.zipCode).toEqual(invoice.zipcode);
    expect(result.items.length).toBe(2);
    expect(result.items[0].id.id).toEqual(invoice.items[0].id);
    expect(result.items[0].name).toEqual(invoice.items[0].name);
    expect(result.items[0].price).toEqual(invoice.items[0].price);
    expect(result.items[1].id.id).toEqual(invoice.items[1].id);
    expect(result.items[1].name).toEqual(invoice.items[1].name);
    expect(result.items[1].price).toEqual(invoice.items[1].price);
    expect(result.total()).toBe(300);
  });
});