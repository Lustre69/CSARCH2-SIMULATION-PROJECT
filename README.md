# CSARCH2-SIMULATION-PROJECT
## Test Case 1: Sequential
The first test case is a sequence of numbers up to n(number of memory blocks) repeated 2 times.
The first half of the sequence are all cache misses since they are all unique numbers from 0 to n while the second half are all cache hits since they are now all present in the cache memory. Furthermore, the expected output would have half of the sequence having a cache miss and the other half having cache hits.

![image](https://github.com/Lustre69/CSARCH2-SIMULATION-PROJECT/assets/80824378/3bf979cc-a377-4ef2-a908-40ddea8656c1)

## Test Case 2: Random
Since the sequence are random, there are cases where the cache is not filled up, but there are many repeating numbers so the hit rate is high. There are also some cases where the hit rate is very low due to a higher variability of numbers in the sequence.
![image](https://github.com/Lustre69/CSARCH2-SIMULATION-PROJECT/assets/80824378/ef6aa4e2-b45a-43f6-8906-fce38665dcdb)

![image](https://github.com/Lustre69/CSARCH2-SIMULATION-PROJECT/assets/80824378/369d686e-716a-4965-9751-b23c719163a6)


## Test Case 3: Mid-Repeat Blocks
This test case has a sequence of numbers repeating twice while the 2nd iteration is extended by 2 times. For this certain case, the number of cache hits would be around 1/3 of the sequence since the first sequence will all be misses while the second sequence which is the the duplicate will all have cache hits while the extension of the second sequence will then all have cache misses.
![image](https://github.com/Lustre69/CSARCH2-SIMULATION-PROJECT/assets/80824378/0cac8a7f-6d7a-4717-be7a-c5d7278acd26)

