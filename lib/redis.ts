
import {Redis} from '@upstash/redis'
import {Redis as Iredis} from 'ioredis'

// const redis = new Redis({
//     url:process.env.UPSTASH_REDIS_REST_URL as string,
//     token:process.env.UPSTASH_REDIS_REST_TOKEN as string
// })

const redis = new Iredis()

export default redis