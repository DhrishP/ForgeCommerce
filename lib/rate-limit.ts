import { Ratelimit } from "@upstash/ratelimit";
import redis from "@/lib/redis";

const ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(15, "30 s"),
  });

 export default ratelimit; 
