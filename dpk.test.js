const { deterministicPartitionKey } = require("./dpk");
const crypto = require("crypto");

describe("deterministicPartitionKey", () => {
  it("returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });
  
  it("returns a 64 byte hex if no partition key is present yet in the event", () => {
    const key = deterministicPartitionKey({someField: "somevalue"});
    expect(key.length).toBe(128);
  });
  
  it("the partition key returned is generated using sha3-512 on the JSON-stringified event if it doesn't contain a partitionKey field yet", () => {
    const event = {someField: "somevalue"};
    const key = deterministicPartitionKey(event);
    expect(key).toBe(crypto.createHash("sha3-512").update(JSON.stringify(event)).digest("hex"));
  });
  
  it("returns the event partitionKey if there's one already present and it's a string", () => {
    const existingKey = "somekey";
    const key = deterministicPartitionKey({partitionKey: existingKey});
    expect(key).toBe(existingKey);
  });
  
  it("returns the JSON-stringified partitionKey of the event if there's one already present and it's not a string", () => {
    const existingKey = 23492884;
    const key = deterministicPartitionKey({partitionKey: existingKey});
    expect(key).toBe(JSON.stringify(existingKey));
  });
});
