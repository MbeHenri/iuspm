import StudentSimple from "../models/student";
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

    async getStudents(): Promise<StudentSimple[]> {
        return await this.base_rep.getStudents()
    }

    async getRN(student: StudentSimple, year: string, semester: null | "1" | "2"): Promise<string> {
        return semester ?
            await this.base_rep.getRNSemester(student.uuid, year, semester) :
            await this.base_rep.getRNGlobal(student.uuid, year)
    }
}

export default BaseService;
