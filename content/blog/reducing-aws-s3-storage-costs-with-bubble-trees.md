>> Note | This post will be talking about [Amazon Web Services (AWS) Simple Storage Solution (S3)](https://aws.amazon.com/s3/). If you're not familiar with this technology, [here is a good primer](https://aws.amazon.com/s3/getting-started/).

### Understanding S3 pricing
S3 Standard - General purpose storage for any type of data, typically used for frequently accessed data
| Usage | Cost |
| ----- | ---- |
| First 50 TB/mo | $0.023 per GB |
| Next 450 TB/mo | $0.022 per GB |
| Over 500 TB/mo | $0.021 per GB |

source: https://aws.amazon.com/s3/pricing/

? Putting this here for later: I think we can do a `head` request to reduce the cost from $20/execution to even lower, need to look into it more
