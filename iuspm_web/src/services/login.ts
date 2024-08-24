
import { getIUSPMRepository } from "../repositories/iuspm";
import IUSPMRepository from "../repositories/iuspm/repository";

class BaseService {

    base_rep: IUSPMRepository;

    constructor() {
        this.base_rep = getIUSPMRepository("good");
    }

    async connection(username: string, password: string): Promise<string> {
        const data = await this.base_rep.connection(username, password)
        return `${data.access}`
    }

}

export default BaseService;
