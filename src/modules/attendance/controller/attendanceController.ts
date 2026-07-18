import { AttendanceService } from "../service/attendanceService";

const attendanceService = new AttendanceService();

export class AttendanceController {
  async getAll({ schoolId, user, query }: any) {
    const classId = query.classId ? parseInt(query.classId, 10) : undefined;
    const teacherId = query.teacherId ? parseInt(query.teacherId, 10) : undefined;
    const date = query.date || undefined;

    const data = await attendanceService.getAllAttendances(schoolId, user, { classId, teacherId, date });
    return {
      success: true,
      message: "Daftar absensi berhasil diambil",
      data,
    };
  }

  async getRecap({ schoolId, user, query }: any) {
    const classId = parseInt(query.classId, 10);
    const month = query.month;

    const data = await attendanceService.getAttendanceRecap(schoolId, user, classId, month);
    return {
      success: true,
      message: "Rekap absensi bulanan berhasil diambil",
      data,
    };
  }

  async getById({ schoolId, user, params }: any) {
    const id = parseInt(params.id, 10);
    const data = await attendanceService.getAttendanceById(schoolId, user, id);
    return {
      success: true,
      message: "Detail absensi berhasil diambil",
      data,
    };
  }

  async create({ schoolId, user, body }: any) {
    const data = await attendanceService.createAttendance(schoolId, user, body);
    return {
      success: true,
      message: "Absensi berhasil disimpan",
      data,
    };
  }

  async update({ schoolId, user, params, body }: any) {
    const id = parseInt(params.id, 10);
    const data = await attendanceService.updateAttendance(schoolId, user, id, body);
    return {
      success: true,
      message: "Absensi berhasil diperbarui",
      data,
    };
  }

  async delete({ schoolId, user, params }: any) {
    const id = parseInt(params.id, 10);
    await attendanceService.deleteAttendance(schoolId, user, id);
    return {
      success: true,
      message: "Absensi berhasil dihapus",
    };
  }
}
