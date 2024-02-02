import { Ratelimit } from "@upstash/ratelimit";
import redis from "@/lib/redis";

const ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(40, "30 s"),
  });

 export default ratelimit; 
