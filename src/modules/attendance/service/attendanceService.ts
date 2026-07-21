import { AttendanceRepository } from "../repository/attendanceRepository";
import { NotFoundError, ConflictError, BadRequestError, ForbiddenError } from "../../../errors/customErrors";
import { classes } from "../../../schema/classes";
import { db } from "../../../db";
import { eq } from "drizzle-orm";
import { UserContext, getTeacherIdFromUserId } from "../../../utils/rbac";

export class AttendanceService {
  private repository = new AttendanceRepository();

  private async validateTeacherPermission(schoolId: number, user: UserContext, scheduleTeacherId: number) {
    if (user.role === "Teacher" || user.role === "HomeroomTeacher") {
      const teacherId = await getTeacherIdFromUserId(schoolId, user.id);
      if (teacherId !== scheduleTeacherId) {
        throw new ForbiddenError("Anda hanya diperbolehkan mengelola absensi untuk jadwal mengajar Anda sendiri");
      }
      return teacherId;
    }
    return scheduleTeacherId;
  }

  async createAttendance(
    schoolId: number,
    user: UserContext,
    payload: {
      scheduleId: number;
      attendanceDate: string;
      notes?: string;
      details: { studentId: number; status: "PRESENT" | "SICK" | "PERMISSION" | "ABSENT"; notes?: string }[];
    }
  ) {
    // 1. Validasi schedule
    const schedule = await this.repository.findScheduleById(schoolId, payload.scheduleId);
    if (!schedule) {
      throw new BadRequestError("Jadwal pelajaran tidak ditemukan di sekolah ini");
    }

    // 2. Validasi Hak Akses Guru (hanya boleh mengisi jadwal miliknya)
    await this.validateTeacherPermission(schoolId, user, schedule.teacherId);

    // 3. Cegah absensi ganda (scheduleId + attendanceDate)
    const existing = await this.repository.findAttendanceByScheduleAndDate(schoolId, payload.scheduleId, payload.attendanceDate);
    if (existing) {
      throw new ConflictError("Absensi untuk jadwal pelajaran pada tanggal ini sudah dibuat");
    }

    // 4. Ambil daftar siswa aktif di kelas
    const classStudents = await this.repository.findClassStudents(schoolId, schedule.classId);
    const activeStudentIds = new Set(classStudents.map((s) => s.id));

    // 5. Validasi siswa yang diinput
    for (const d of payload.details) {
      if (!activeStudentIds.has(d.studentId)) {
        throw new BadRequestError(`Siswa dengan ID ${d.studentId} tidak aktif atau tidak terdaftar di kelas untuk jadwal ini`);
      }
    }

    // 6. Buat absensi
    try {
      const attendance = await this.repository.createAttendance(
        schoolId,
        schedule.teacherId, // Gunakan teacherId dari jadwal
        payload.scheduleId,
        payload.attendanceDate,
        payload.notes,
        payload.details
      );

      const details = await this.repository.findAttendanceDetails(attendance.id);
      return {
        ...attendance,
        details,
      };
    } catch (error: any) {
      console.error("[CRITICAL ERROR IN createAttendance]:", error);
      console.error("Payload details:", payload.details);
      throw error;
    }
  }

  async getAttendanceById(schoolId: number, user: UserContext, id: number) {
    const attendance = await this.repository.findAttendanceById(schoolId, id);
    if (!attendance) {
      throw new NotFoundError("Data absensi tidak ditemukan");
    }

    if (user.role === "Teacher" || user.role === "HomeroomTeacher") {
      const schedule = await this.repository.findScheduleById(schoolId, attendance.scheduleId);
      if (schedule) {
        await this.validateTeacherPermission(schoolId, user, schedule.teacherId);
      }
    }

    const details = await this.repository.findAttendanceDetails(id);
    return {
      ...attendance,
      details,
    };
  }

  async updateAttendance(
    schoolId: number,
    user: UserContext,
    id: number,
    payload: {
      notes?: string;
      details?: { studentId: number; status: "PRESENT" | "SICK" | "PERMISSION" | "ABSENT"; notes?: string }[];
    }
  ) {
    // 1. Pastikan absensi ada
    const attendance = await this.repository.findAttendanceById(schoolId, id);
    if (!attendance) {
      throw new NotFoundError("Data absensi tidak ditemukan");
    }

    // 2. Ambil schedule
    const schedule = await this.repository.findScheduleById(schoolId, attendance.scheduleId);
    if (!schedule) {
      throw new BadRequestError("Jadwal pelajaran terkait absensi ini tidak ditemukan");
    }

    // 3. Validasi Hak Akses Guru
    await this.validateTeacherPermission(schoolId, user, schedule.teacherId);

    // 4. Validasi siswa yang diupdate jika ada
    if (payload.details && payload.details.length > 0) {
      const classStudents = await this.repository.findClassStudents(schoolId, schedule.classId);
      const activeStudentIds = new Set(classStudents.map((s) => s.id));

      for (const d of payload.details) {
        if (!activeStudentIds.has(d.studentId)) {
          throw new BadRequestError(`Siswa dengan ID ${d.studentId} tidak aktif atau tidak terdaftar di kelas untuk jadwal ini`);
        }
      }
    }

    const updated = await this.repository.updateAttendance(schoolId, id, payload.notes, payload.details);
    const details = await this.repository.findAttendanceDetails(id);
    return {
      ...updated,
      details,
    };
  }

  async deleteAttendance(schoolId: number, user: UserContext, id: number) {
    // 1. Pastikan absensi ada
    const attendance = await this.repository.findAttendanceById(schoolId, id);
    if (!attendance) {
      throw new NotFoundError("Data absensi tidak ditemukan");
    }

    // 2. Ambil schedule
    const schedule = await this.repository.findScheduleById(schoolId, attendance.scheduleId);
    if (!schedule) {
      throw new BadRequestError("Jadwal pelajaran terkait absensi ini tidak ditemukan");
    }

    // 3. Validasi Hak Akses Guru
    await this.validateTeacherPermission(schoolId, user, schedule.teacherId);

    // 4. Hard delete agar absensi bisa dibuat ulang di tanggal yang sama
    await this.repository.hardDeleteAttendance(schoolId, id);
  }

  async getAllAttendances(
    schoolId: number,
    user: UserContext,
    filters: { classId?: number; teacherId?: number; date?: string; allowedHomeroomClassIds?: number[] }
  ) {
    if (user.role === "Teacher" || user.role === "HomeroomTeacher") {
      const myTeacherId = await getTeacherIdFromUserId(schoolId, user.id);
      filters.teacherId = myTeacherId;

      if (user.role === "HomeroomTeacher") {
        const homeroomClasses = await db.select({ id: classes.id }).from(classes).where(eq(classes.homeroomTeacherId, myTeacherId));
        filters.allowedHomeroomClassIds = homeroomClasses.map(c => c.id);
      }
    }
    return await this.repository.findAllAttendances(schoolId, filters);
  }

  async getAttendanceRecap(schoolId: number, user: UserContext, classId: number, month: string) {
    const rawData = await this.repository.getMonthlyRecapData(schoolId, classId, month);
    if (!rawData) {
      throw new NotFoundError("Kelas tidak ditemukan");
    }

    const { class: cls, students: classStudents, attendances: monthlyAttendances, details } = rawData;

    // Create a map of attendanceId -> attendanceDate & subjectName
    const attendanceMap = new Map<number, { date: string; subject: string }>();
    monthlyAttendances.forEach(a => {
      attendanceMap.set(a.id, { date: a.attendanceDate, subject: a.subjectName });
    });

    // Group details by studentId and date
    const studentDailyStatuses = new Map<number, Map<string, string[]>>();
    
    details.forEach(d => {
      const attInfo = attendanceMap.get(d.attendanceId);
      if (!attInfo) return;

      const dateStr = attInfo.date;
      if (!studentDailyStatuses.has(d.studentId)) {
        studentDailyStatuses.set(d.studentId, new Map());
      }
      const dateMap = studentDailyStatuses.get(d.studentId)!;
      if (!dateMap.has(dateStr)) {
        dateMap.set(dateStr, []);
      }
      dateMap.get(dateStr)!.push(d.status);
    });

    const formattedStudents = classStudents.map(student => {
      const dailyStatus: Record<string, string> = {};
      const dateMap = studentDailyStatuses.get(student.studentId);

      const summary = {
        PRESENT: 0,
        SICK: 0,
        PERMISSION: 0,
        ABSENT: 0,
      };

      if (dateMap) {
        dateMap.forEach((statuses, dateStr) => {
          let consolidatedStatus = "PRESENT";
          if (statuses.includes("ABSENT")) {
            consolidatedStatus = "ABSENT";
          } else if (statuses.includes("SICK")) {
            consolidatedStatus = "SICK";
          } else if (statuses.includes("PERMISSION")) {
            consolidatedStatus = "PERMISSION";
          }
          dailyStatus[dateStr] = consolidatedStatus;
          summary[consolidatedStatus as keyof typeof summary]++;
        });
      }

      return {
        studentId: student.studentId,
        studentName: student.studentName,
        nisn: student.nisn,
        nis: student.nis,
        dailyStatus,
        summary,
      };
    });

    const uniqueDates = Array.from(new Set(monthlyAttendances.map(a => a.attendanceDate))).sort();

    return {
      class: {
        id: cls.id,
        name: cls.name,
      },
      month,
      dates: uniqueDates,
      students: formattedStudents,
    };
  }
}
