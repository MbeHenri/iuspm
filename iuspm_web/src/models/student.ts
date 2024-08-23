
export interface StudentSimple {
    uuid: string,
    register: string,
    name: string,
    level: number,
    sector: string
}

export default interface Student {
    uuid: string,
    register: string,
    name: string,
    level: number,
    birthPlace: string,
    birthAt: Date,
    insertedAt: Date,
    sector: {
        uuid: string,
        label: string
    }
}