import { Elysia, t } from "elysia";
import { SchoolsController } from "../controller/schoolsController";
import { authMiddleware, requireRoles } from "../../../middleware/auth";
import { tenantMiddleware } from "../../../middleware/tenant";

const controller = new SchoolsController();

export const schoolsRoutes = new Elysia({ prefix: "/schools" })
  .use(tenantMiddleware)
  .use(authMiddleware)
  .get("/current", ({ schoolId }: any) => controller.getSettings(schoolId), {
    beforeHandle: requireRoles(["SuperAdmin", "SchoolAdmin", "Principal", "Teacher", "HomeroomTeacher", "BKTeacher", "Counselor", "Polsis", "Student"])
  })
  .put("/current", ({ schoolId, body }: any) => controller.updateSettings(schoolId, body), {
    body: t.Object({
      foundationName: t.Optional(t.String()),
      regionalName: t.Optional(t.String()),
      accreditation: t.Optional(t.String()),
      name: t.Optional(t.String()),
      address: t.Optional(t.String()),
      phone: t.Optional(t.String()),
      email: t.Optional(t.String()),
      website: t.Optional(t.String()),
      logoUrl: t.Optional(t.String()),
    }),
    beforeHandle: requireRoles(["SuperAdmin", "SchoolAdmin", "Principal"])
  });
