import { db } from "../../../db";
import { schools } from "../../../schema/schools";
import { eq } from "drizzle-orm";

export class SchoolsService {
  async getSchoolSettings(schoolId: number) {
    const list = await db
      .select()
      .from(schools)
      .where(eq(schools.id, schoolId))
      .limit(1);

    if (list.length === 0) {
      throw new Error("404: School settings not found");
    }
    return list[0];
  }

  async updateSchoolSettings(schoolId: number, data: any) {
    const { foundationName, regionalName, accreditation, name, address, phone, email, website, logoUrl } = data;
    
    await db
      .update(schools)
      .set({
        foundationName: foundationName !== undefined ? foundationName : undefined,
        regionalName: regionalName !== undefined ? regionalName : undefined,
        accreditation: accreditation !== undefined ? accreditation : undefined,
        name: name !== undefined ? name : undefined,
        address: address !== undefined ? address : undefined,
        phone: phone !== undefined ? phone : undefined,
        email: email !== undefined ? email : undefined,
        website: website !== undefined ? website : undefined,
        logoUrl: logoUrl !== undefined ? logoUrl : undefined,
        updatedAt: new Date(),
      })
      .where(eq(schools.id, schoolId));

    return this.getSchoolSettings(schoolId);
  }
}
