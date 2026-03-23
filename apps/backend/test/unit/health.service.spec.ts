import { HealthService } from "../../src/mvp/modules/health/health.service";

describe("HealthService", () => {
  it("should return ok when database query succeeds", async () => {
    const prisma = {
      $queryRawUnsafe: jest.fn().mockResolvedValue([1]),
    };
    const service = new HealthService(prisma as never);
    const result = await service.check();

    expect(result.status).toBe("ok");
    expect(result.dependencies.database.up).toBe(true);
  });

  it("should return degraded when database query fails", async () => {
    const prisma = {
      $queryRawUnsafe: jest.fn().mockRejectedValue(new Error("db down")),
    };
    const service = new HealthService(prisma as never);
    const result = await service.check();

    expect(result.status).toBe("degraded");
    expect(result.dependencies.database.up).toBe(false);
    expect(result.dependencies.database.error).toBe("db down");
  });
});
