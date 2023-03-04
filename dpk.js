const crypto = require("crypto");

exports.deterministicPartitionKey = (event) => {
  const TRIVIAL_PARTITION_KEY = "0";
  
  if (!event) return TRIVIAL_PARTITION_KEY;
  
  const MAX_PARTITION_KEY_LENGTH = 256;
 
  if (event.partitionKey) {
    let existingPartitionKey = event.partitionKey;
    if (typeof existingPartitionKey !== "string") {
      existingPartitionKey = JSON.stringify(existingPartitionKey);
    }
    if (existingPartitionKey.length <= MAX_PARTITION_KEY_LENGTH) {
      return existingPartitionKey;
    }
    return crypto.createHash("sha3-512").update(existingPartitionKey).digest("hex");
  }
  
  return crypto.createHash("sha3-512").update(JSON.stringify(event)).digest("hex");
};