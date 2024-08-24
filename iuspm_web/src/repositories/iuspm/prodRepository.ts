import { API_BASE_URL } from "../../config";
import { Semester } from "../../models/note";
import IUSPMRepository from "./repository";

class ProdIUSPMRepository extends IUSPMRepository {

    async connection(username: string, password: string) {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "username": username,
            "password": password,
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
        };

        return await fetch(`${API_BASE_URL}/api/token/`, requestOptions)
            .then((response) => {

                if (response.ok) {
                    return response.json()
                }
                throw new Error("Impossible de se connecter" + response.statusText);

            })
            .then((data) => {
                return {
                    access: data.access
                }
            })
    }

    async createStudentNote(cc: number, ef: number, isNormal: boolean, uuidEC: string, uuidStudent: string, token?: string) {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        token && myHeaders.append("Authorization", `Bearer ${token}`);

        const raw = JSON.stringify({
            "cc": cc,
            "ef": ef,
            "ec": uuidEC,
            "student": uuidStudent,
            "is_normal": isNormal
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
        };

        return await fetch(`${API_BASE_URL}/base/api/v1/note/`, requestOptions)
            .then((response) => {

                if (response.ok) {
                    return response.json()
                }
                throw new Error("Impossible de mettre à jour la note" + response.statusText);

            })
            .then((data) => {
                return {
                    uuid: data.id,
                    cc: data.cc,
                    ef: data.ef,
                    ec: data.ec,
                    isNormal: data.is_normal
                }
            })
    }

    async updateStudentNote(uuid: string, cc: number, ef: number, isNormal: boolean, uuidEC: string, uuidStudent: string, token?: string) {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        token && myHeaders.append("Authorization", `Bearer ${token}`);

        console.log(uuid);


        const raw = JSON.stringify({
            "id": uuid,
            "cc": cc,
            "ef": ef,
            "ec": uuidEC,
            "student": uuidStudent,
            "is_normal": isNormal
        });

        const requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: raw,
        };

        return await fetch(`${API_BASE_URL}/base/api/v1/note/${uuid}/`, requestOptions)
            .then((response) => {

                if (response.ok) {
                    return response.json()
                }
                throw new Error("Impossible de mettre à jour la note" + response.statusText);

            })
            .then((data) => {
                return {
                    uuid: data.id,
                    cc: data.cc,
                    ef: data.ef,
                    ec: data.ec,
                    isNormal: data.is_normal
                }
            })
    }

    async getStudentNotes(uuid: string, token?: string) {
        const myHeaders = new Headers();
        token && myHeaders.append("Authorization", `Bearer ${token}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
        };

        return await fetch(`${API_BASE_URL}/base/api/v1/student/${uuid}/note/`, requestOptions)
            .then((response) => {

                if (response.ok) {
                    return response.json()
                }
                throw new Error("Impossible de recupérer les notes de l'étudiant " + response.statusText);
            })
            .then((data) => {
                const results: any[] = data.results
                return results.map((e) => {
                    return {
                        uuid: e.id,
                        cc: e.cc,
                        ef: e.ef,
                        updatedAt: new Date(e.updated_at),
                        isNormal: e.is_normal,
                        ec: {
                            uuid: e.ec.id,
                            code: e.ec.code,
                            label: e.ec.label,
                            ue: {
                                code: e.ec.ue.code,
                                label: e.ec.ue.label
                            }
                        },
                        semester: e.semester
                    }
                })
            })
    }

    async getStudent(uuid: string, token?: string) {
        const myHeaders = new Headers();
        token && myHeaders.append("Authorization", `Bearer ${token}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
        };

        return await fetch(`${API_BASE_URL}/base/api/v1/student/${uuid}/`, requestOptions)
            .then((response) => {

                if (response.ok) {
                    return response.json()
                }
                throw new Error("Impossible de recupérer les étudiants " + response.statusText);

            })
            .then((data) => {
                return {
                    uuid: data.id,
                    name: data.name,
                    register: data.register_number,
                    birthPlace: data.birth_place,
                    insertedAt: new Date(data.inserted_at),
                    birthAt: new Date(data.birth_at),
                    sector: {
                        uuid: data.sector.id,
                        label: data.sector.label
                    },
                    level: data.current_level,
                    cycle: data.cycle
                }
            })
    }


    async getStudents(token?: string) {
        const myHeaders = new Headers();
        token && myHeaders.append("Authorization", `Bearer ${token}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
        };

        return await fetch(`${API_BASE_URL}/base/api/v1/student/`, requestOptions)
            .then((response) => {

                if (response.ok) {
                    return response.json()
                }
                throw new Error("Impossible de recupérer les étudiants " + response.statusText);

            })
            .then((data) => {
                const results: any[] = data.results
                return results.map((e) => {
                    return {
                        uuid: e.id,
                        register: e.register_number,
                        name: e.name,
                        level: e.current_level,
                        sector: e.sector.label
                    }
                })
            })
    }

    async getRNGlobal(id: string, year: string, token?: string) {
        const myHeaders = new Headers();
        token && myHeaders.append("Authorization", `Bearer ${token}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
        };

        const results = await fetch(`${API_BASE_URL}/base/api/v1/student/${id}/rn/${year}/`, requestOptions)
            .then((response) => {

                if (response.ok) {
                    return response.blob()
                }
                throw new Error("Impossible de recupérer le relevé (" + response.statusText + ")");
            })
            .then((blob) => window.URL.createObjectURL(blob))

        return results
    }

    async getRNSemester(id: string, year: string, semester: Semester, token?: string) {
        const myHeaders = new Headers();
        token && myHeaders.append("Authorization", `Bearer ${token}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
        };

        const results = await fetch(`${API_BASE_URL}/base/api/v1/student/${id}/rn/${year}/${semester}/`, requestOptions)
            .then((response) => {

                if (response.ok) {
                    return response.blob()
                }
                throw new Error("Impossible de recupérer le relevé (" + response.statusText + ")");
            })
            .then((blob) => window.URL.createObjectURL(blob))

        return results
    }

}

export default ProdIUSPMRepository;