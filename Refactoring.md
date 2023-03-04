# Refactoring

You've been asked to refactor the function `deterministicPartitionKey` in [`dpk.js`](dpk.js) to make it easier to read and understand without changing its functionality. For this task, you should:

1. Write unit tests to cover the existing functionality and ensure that your refactor doesn't break it. We typically use `jest`, but if you have another library you prefer, feel free to use it.
2. Refactor the function to be as "clean" and "readable" as possible. There are many valid ways to define those words - use your own personal definitions, but be prepared to defend them. Note that we do like to use the latest JS language features when applicable.
3. Write up a brief (~1 paragraph) explanation of why you made the choices you did and why specifically your version is more "readable" than the original.

You will be graded on the exhaustiveness and quality of your unit tests, the depth of your refactor, and the level of insight into your thought process provided by the written explanation.

## Your Explanation Here

I made several changes

- reduced quite a bit of confusing if...else branching and replaced it with return statements to leave the function as soon as the code has the value to be returned read. Makes the code easier to read.
- removed redundant check that 'candidate' exists: by returning early if the event doesn't exist, we guarantee that 'candidate' already exists
- renamed (or removed) some intermediate variables that were named with pretty vague names (what's 'data' or 'candidate'?) to better express intent
- moved check that the key was too long to the only case when this can happen, namely, when it's already present in the event. If we generate it, it can't be longer than 256, given that our hashing algo produces an output of 512 bits.
- replaced the only internal variable needed by a constant, since it's easier to follow the code if you know it doesn't change.