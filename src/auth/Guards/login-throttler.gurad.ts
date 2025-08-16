import { ExecutionContext, Injectable } from "@nestjs/common";
import { ThrottlerException, ThrottlerGuard, ThrottlerLimitDetail } from "@nestjs/throttler";

@Injectable()
export class LoginThrottlerGuard extends ThrottlerGuard{
    protected async getTracker(req: Record<string, any>): Promise<string> {
        const email = req.body?.email || "anonymous";
        return `login-${email}`;
    }
    protected getlimit():Promise<number>{
        return Promise.resolve(5)   
    }
    protected getTil():Promise<number>{
        return Promise.resolve(6000)
    }
    protected async throwThrottlingException(): Promise<void> {
        throw new ThrottlerException("Too many attemps please try after one min")
    }
}