import { NoteSimple, Semester } from "../models/note";
import Student, { StudentSimple } from "../models/student";
import { UserAuth } from "../models/user";
import { getIUSPMRepository } from "../repositories/iuspm";
import IUSPMRepository from "../repositories/iuspm/repository";

class BaseService {

    base_rep: IUSPMRepository;

    user?: UserAuth

    constructor(user?: UserAuth) {
        this.base_rep = getIUSPMRepository("good");
        if (user) {
            this.user = user
        }
    }

    async getStudent(uuid: string): Promise<Student> {
        return await this.base_rep.getStudent(uuid, this.user?.token)
    }

    async getStudents(): Promise<StudentSimple[]> {
        return await this.base_rep.getStudents(this.user?.token)
    }

    async getRN(student: StudentSimple, year: string, semester: null | Semester): Promise<string> {
        return semester ?
            await this.base_rep.getRNSemester(student.uuid, year, semester, this.user?.token) :
            await this.base_rep.getRNGlobal(student.uuid, year, this.user?.token)
    }

    async getStudentNotes(student: Student): Promise<Map<Semester, NoteSimple[]>> {

        const s1Notes: NoteSimple[] = []
        const s2Notes: NoteSimple[] = []

        const notes: any[] = await this.base_rep.getStudentNotes(student.uuid, this.user?.token)

        notes.forEach((note, id) => {
            switch (note.semester) {
                case Semester.s1:
                    s1Notes.push({ ...note, id })
                    break;
                case Semester.s2:
                    s2Notes.push({ ...note, id })
                    break;

                default:
                    break;
            }
        })

        const map = new Map<Semester, NoteSimple[]>()
        map.set(Semester.s1, s1Notes)
        map.set(Semester.s2, s2Notes)


        return map
    }

    async updateStudentNote(note: NoteSimple, student: Student): Promise<NoteSimple> {
        const data = (note.uuid ?
            await this.base_rep.updateStudentNote(note.uuid, note.cc ?? 0, note.ef ?? 0, note.isNormal ?? true, note.ec.uuid, student.uuid, this.user?.token) :
            await this.base_rep.createStudentNote(note.cc ?? 0, note.ef ?? 0, note.isNormal ?? true, note.ec.uuid, student.uuid, this.user?.token))
        return { ...note, uuid: data.uuid, cc: data.cc, ef: data.ef, isNormal: data.isNormal }
    }

}

export default BaseService;
