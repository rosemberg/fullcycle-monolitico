import { Sequelize } from "sequelize-typescript";
import InvoiceFacadeFactory from "../factory/invoice.facade.factory";
import { InvoiceItemModel } from "../repository/invoice-item.model";
import { InvoiceModel } from "../repository/invoice.model";

describe("Invoice Facade test", () => {
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
    const facade = InvoiceFacadeFactory.create();

    const input = {
      name: "Invoice 1",
      document: "Document 1",
      street: "Street 1",
      number: "123",
      complement: "Complement 1",
      city: "City 1",
      state: "State 1",
      zipCode: "12345",
      items: [
        {
          id: "1",
          name: "Item 1",
          price: 100,
        },
        {
          id: "2",
          name: "Item 2",
          price: 200,
        },
      ],
    };

    const output = await facade.generate(input);

    expect(output.id).toBeDefined();
    expect(output.name).toBe(input.name);
    expect(output.document).toBe(input.document);
    expect(output.street).toBe(input.street);
    expect(output.number).toBe(input.number);
    expect(output.complement).toBe(input.complement);
    expect(output.city).toBe(input.city);
    expect(output.state).toBe(input.state);
    expect(output.zipCode).toBe(input.zipCode);
    expect(output.items.length).toBe(2);
    expect(output.items[0].id).toBeDefined();
    expect(output.items[0].name).toBe(input.items[0].name);
    expect(output.items[0].price).toBe(input.items[0].price);
    expect(output.items[1].id).toBeDefined();
    expect(output.items[1].name).toBe(input.items[1].name);
    expect(output.items[1].price).toBe(input.items[1].price);
    expect(output.total).toBe(300);

    const invoiceDb = await InvoiceModel.findOne({
      where: { id: output.id },
      include: [InvoiceItemModel],
    });

    expect(invoiceDb).toBeDefined();
    expect(invoiceDb.id).toBe(output.id);
    expect(invoiceDb.name).toBe(output.name);
    expect(invoiceDb.document).toBe(output.document);
    expect(invoiceDb.street).toBe(output.street);
    expect(invoiceDb.number).toBe(output.number);
    expect(invoiceDb.complement).toBe(output.complement);
    expect(invoiceDb.city).toBe(output.city);
    expect(invoiceDb.state).toBe(output.state);
    expect(invoiceDb.zipcode).toBe(output.zipCode);
    expect(invoiceDb.items.length).toBe(2);
    expect(invoiceDb.items[0].name).toBe(output.items[0].name);
    expect(invoiceDb.items[0].price).toBe(output.items[0].price);
    expect(invoiceDb.items[1].name).toBe(output.items[1].name);
    expect(invoiceDb.items[1].price).toBe(output.items[1].price);
  });

  it("should find an invoice", async () => {
    const facade = InvoiceFacadeFactory.create();

    const input = {
      name: "Invoice 1",
      document: "Document 1",
      street: "Street 1",
      number: "123",
      complement: "Complement 1",
      city: "City 1",
      state: "State 1",
      zipCode: "12345",
      items: [
        {
          id: "1",
          name: "Item 1",
          price: 100,
        },
        {
          id: "2",
          name: "Item 2",
          price: 200,
        },
      ],
    };

    const output = await facade.generate(input);

    const findInput = {
      id: output.id,
    };

    const findOutput = await facade.find(findInput);

    expect(findOutput.id).toBe(output.id);
    expect(findOutput.name).toBe(output.name);
    expect(findOutput.document).toBe(output.document);
    expect(findOutput.address.street).toBe(output.street);
    expect(findOutput.address.number).toBe(output.number);
    expect(findOutput.address.complement).toBe(output.complement);
    expect(findOutput.address.city).toBe(output.city);
    expect(findOutput.address.state).toBe(output.state);
    expect(findOutput.address.zipCode).toBe(output.zipCode);
    expect(findOutput.items.length).toBe(2);
    expect(findOutput.items[0].id).toBeDefined();
    expect(findOutput.items[0].name).toBe(output.items[0].name);
    expect(findOutput.items[0].price).toBe(output.items[0].price);
    expect(findOutput.items[1].id).toBeDefined();
    expect(findOutput.items[1].name).toBe(output.items[1].name);
    expect(findOutput.items[1].price).toBe(output.items[1].price);
    expect(findOutput.total).toBe(300);
  });
});