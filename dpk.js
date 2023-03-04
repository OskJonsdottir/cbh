const crypto = require("crypto");


const TRIVIAL_PARTITION_KEY = "0";
const MAX_PARTITION_KEY_LENGTH = 256;

exports.deterministicPartitionKey = (event) => {
  
  if (!event) return TRIVIAL_PARTITION_KEY;
  
  if (event.partitionKey) {
    const existingPartitionKey = (typeof event.partitionKey === "string") ? 
      event.partitionKey : 
      JSON.stringify(event.partitionKey);
    
    if (existingPartitionKey.length <= MAX_PARTITION_KEY_LENGTH) {
      return existingPartitionKey;
    }
    
    return crypto.createHash("sha3-512").update(existingPartitionKey).digest("hex");
  }
  
  return crypto.createHash("sha3-512").update(JSON.stringify(event)).digest("hex");
};