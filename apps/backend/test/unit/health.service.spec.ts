import { HealthService } from "../../src/modules/health/health.service";

describe("HealthService", () => {
  it("should return ok", () => {
    const service = new HealthService();
    const result = service.check();
    expect(result.status).toBe("ok");
  });
});

