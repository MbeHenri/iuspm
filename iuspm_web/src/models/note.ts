
export enum Semester {
    s1 = 1,
    s2 = 2
}

export interface NoteSimple {
    // identifiant de la note depuis le client
    id: string,
    // identifiant de la note d'après l'api iuspm
    uuid: string | null,
    cc: number | null,
    ef: number | null,
    updatedAt: Date | null,
    isNormal: boolean | null,
    ec: {
        uuid: string,
        code: string,
        label: string,
        ue: {
            code: string,
            label: string
        }
    },
    semester: Semester
}