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
  
  it("returns a key generated using sha3-512 on the JSON-stringified event if it doesn't contain a partitionKey field yet", () => {
    const event = {someField: "somevalue"};
    const key = deterministicPartitionKey(event);
    expect(key).toBe(crypto.createHash("sha3-512").update(JSON.stringify(event)).digest("hex"));
  });
  
  it("returns the event partitionKey if there's one already present and it's a string and the string isn't empty", () => {
    const existingKey = "somekey";
    const key = deterministicPartitionKey({partitionKey: existingKey});
    expect(key).toBe(existingKey);
  });
  
  it("returns the hash of the JSON-stringified event even if there's a partitionKey present and is a string, if the partition key is empty", () => {
    const existingKey = "";
    const event = {partitionKey: existingKey};
    const key = deterministicPartitionKey(event);
    expect(key).toBe(crypto.createHash("sha3-512").update(JSON.stringify(event)).digest("hex"));
  });
  
  it("returns a hash of the existing partitionKey if there's one already present and is a string, but the partition key is longer than 256 chars", () => {
    const veryLongExistingKey = "12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567";
    const event = {partitionKey: veryLongExistingKey};
    const key = deterministicPartitionKey(event);
    expect(key).toBe(crypto.createHash("sha3-512").update(veryLongExistingKey).digest("hex"));
  });
  
  it("returns the JSON-stringified partitionKey of the event if there's one already present and it's not a string", () => {
    const existingKey = 23492884;
    const key = deterministicPartitionKey({partitionKey: existingKey});
    expect(key).toBe(JSON.stringify(existingKey));
  });
  
  it("returns a hashed JSON-stringified partitionKey of the event if there's one already present and it's not a string and it's length is bigger than 256 characters after stringifying", () => {
    const longNonStringExistingKey = {someField: "12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890"};
    const event = {partitionKey: longNonStringExistingKey};
    const key = deterministicPartitionKey(event);
    expect(key).toBe(crypto.createHash("sha3-512").update(JSON.stringify(longNonStringExistingKey)).digest("hex"));
  });
  
});
